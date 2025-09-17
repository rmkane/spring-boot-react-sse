package com.example.sse.controller;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.sse.model.SystemEvent;
import com.example.sse.model.sse.SseEvent;
import com.example.sse.service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@Slf4j
public class SseController {

    private final EventService eventService;
    private final ObjectMapper objectMapper;
    private final ConcurrentHashMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private static volatile boolean schedulerStarted = false;

    @GetMapping("/events/initial")
    public ResponseEntity<List<SystemEvent>> getInitialEvents() {
        List<SystemEvent> events = eventService.getAllEvents();
        log.info("Returning {} initial events", events.size());
        return ResponseEntity.ok(events);
    }

    @GetMapping(value = "/events/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamEvents() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // No timeout
        String emitterId = UUID.randomUUID().toString();
        emitters.put(emitterId, emitter);

        log.info("New SSE connection established: {} (total connections: {})", emitterId, emitters.size());

        // Start the broadcast scheduler if not already started
        startBroadcastScheduler();

        // Send initial events immediately (only active events for initial load)
        try {
            List<SystemEvent> events = eventService.getAllEvents();
            String eventsJson = objectMapper.writeValueAsString(events);
            emitter.send(SseEmitter.event()
                .name("initial-events")
                .data(eventsJson));
            log.info("Sent {} initial events to {}: {}", events.size(), emitterId,
                events.stream().map(SystemEvent::getName).collect(Collectors.joining(", ")));
        } catch (Exception e) {
            // Handle connection errors gracefully
            if (e instanceof IOException ||
                e.getCause() instanceof IOException ||
                e.getMessage() != null && e.getMessage().contains("Broken pipe")) {
                log.debug("Client {} disconnected during initial events, removing connection", emitterId);
            } else {
                log.error("Error sending initial events to {}", emitterId, e);
            }
            emitter.completeWithError(e);
            emitters.remove(emitterId);
            return emitter;
        }

        emitter.onCompletion(() -> {
            log.info("SSE connection completed: {} (remaining connections: {})", emitterId, emitters.size() - 1);
            emitters.remove(emitterId);
        });

        emitter.onTimeout(() -> {
            log.info("SSE connection timed out: {} (remaining connections: {})", emitterId, emitters.size() - 1);
            emitters.remove(emitterId);
        });

        emitter.onError((ex) -> {
            // Handle different types of connection errors gracefully
            if (ex instanceof AsyncRequestNotUsableException ||
                (ex.getCause() instanceof IOException) ||
                (ex.getMessage() != null && ex.getMessage().contains("Broken pipe"))) {
                log.debug("SSE connection closed for client {} (remaining connections: {})",
                    emitterId, emitters.size() - 1);
            } else {
                log.error("SSE connection error: {} (remaining connections: {})",
                    emitterId, emitters.size() - 1, ex);
            }
            emitters.remove(emitterId);
        });

        return emitter;
    }

    private synchronized void startBroadcastScheduler() {
        if (!schedulerStarted) {
            scheduler.scheduleAtFixedRate(() -> {
                try {
                    // Clean up inactive events first
                    eventService.cleanupInactiveEvents();

                    if (!emitters.isEmpty()) {
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
                                // Handle various types of connection errors gracefully
                                if (e instanceof IOException ||
                                    e.getCause() instanceof IOException ||
                                    e.getMessage() != null && e.getMessage().contains("Broken pipe")) {
                                    log.debug("Client {} disconnected, removing connection", entry.getKey());
                                } else {
                                    log.warn("Failed to send update to {}, removing connection: {}",
                                        entry.getKey(), e.getMessage());
                                }
                                return true; // Remove the entry
                            }
                        });

                        // Only log if we actually have connections
                        if (!emitters.isEmpty()) {
                            log.info("Broadcasted {} operation for event {} (ID: {}) to {} connections",
                                sseEvent.getOperation(), sseEvent.getEvent().getName(),
                                sseEvent.getEvent().getId(), emitters.size());
                        } else if (initialSize > 0) {
                            log.debug("All clients disconnected, no broadcast sent");
                        }
                    }
                } catch (Exception e) {
                    log.error("Error in broadcast scheduler", e);
                }
            }, 10, 10, TimeUnit.SECONDS);

            schedulerStarted = true;
            log.info("Started broadcast scheduler for SSE connections");
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("SSE Server is running! Active connections: " + emitters.size());
    }

    @GetMapping("/events")
    public ResponseEntity<List<SystemEvent>> getAllEvents() {
        List<SystemEvent> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }
}
