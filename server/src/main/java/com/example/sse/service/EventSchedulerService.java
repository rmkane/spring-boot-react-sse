package com.example.sse.service;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.sse.model.sse.SseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventSchedulerService {

    private final EventService eventService;
    private final ObjectMapper objectMapper;
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private volatile boolean schedulerStarted = false;

    public void addEmitter(String emitterId, SseEmitter emitter) {
        emitters.put(emitterId, emitter);
        log.info("Added emitter {} (total connections: {})", emitterId, emitters.size());
    }

    public void removeEmitter(String emitterId) {
        emitters.remove(emitterId);
        log.info("Removed emitter {} (remaining connections: {})", emitterId, emitters.size());
    }

    public void startScheduler() {
        if (schedulerStarted) {
            return;
        }

        scheduler.scheduleAtFixedRate(() -> {
            try {
                // Clean up inactive events first
                eventService.cleanupInactiveEvents();

                if (emitters.isEmpty()) {
                    return;
                }

                SseEvent sseEvent = eventService.updateRandomEvent();
                String eventJson = objectMapper.writeValueAsString(sseEvent);

                // Broadcast to all connected clients
                int initialSize = emitters.size();
                emitters.entrySet().removeIf(entry -> {
                    try {
                        entry.getValue().send(SseEmitter.event()
                            .name("event-change")
                            .data(eventJson));
                        return false; // Keep the entry
                    } catch (Exception e) {
                        handleConnectionError(e, entry.getKey());
                        return true; // Remove the entry
                    }
                });

                logBroadcastResult(sseEvent, initialSize);

            } catch (Exception e) {
                log.error("Error in broadcast scheduler", e);
            }
        }, 10, 10, TimeUnit.SECONDS);

        schedulerStarted = true;
        log.info("Started event scheduler - will generate events every 10 seconds");
    }

    private void handleConnectionError(Exception e, String clientId) {
        if (e instanceof IOException ||
            e.getCause() instanceof IOException ||
            e.getMessage() != null && e.getMessage().contains("Broken pipe")) {
            log.debug("Client {} disconnected, removing connection", clientId);
        } else {
            log.warn("Failed to send update to {}, removing connection: {}",
                clientId, e.getMessage());
        }
    }

    private void logBroadcastResult(SseEvent sseEvent, int initialSize) {
        if (!emitters.isEmpty()) {
            log.info("Broadcasted {} operation for event {} (ID: {}) to {} connections",
                sseEvent.getOperation(), sseEvent.getEvent().getName(),
                sseEvent.getEvent().getId(), emitters.size());
        } else if (initialSize > 0) {
            log.debug("All clients disconnected, no broadcast sent");
        }
    }

    public int getConnectionCount() {
        return emitters.size();
    }
}
