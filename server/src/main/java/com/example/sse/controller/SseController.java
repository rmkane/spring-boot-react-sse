package com.example.sse.controller;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.sse.model.Event;
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
    public ResponseEntity<List<Event>> getInitialEvents() {
        List<Event> events = eventService.getAllEvents();
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

        // Send initial events immediately
        try {
            List<Event> events = eventService.getAllEvents();
            String eventsJson = objectMapper.writeValueAsString(events);
            emitter.send(SseEmitter.event()
                .name("initial-events")
                .data(eventsJson));
            log.debug("Sent initial events to {}", emitterId);
        } catch (IOException e) {
            log.error("Error sending initial events to {}", emitterId, e);
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
            log.error("SSE connection error: {} (remaining connections: {})", emitterId, emitters.size() - 1, ex);
            emitters.remove(emitterId);
        });

        return emitter;
    }

    private synchronized void startBroadcastScheduler() {
        if (!schedulerStarted) {
            scheduler.scheduleAtFixedRate(() -> {
                if (!emitters.isEmpty()) {
                    try {
                        List<Event> events = eventService.getAllEvents();
                        String eventsJson = objectMapper.writeValueAsString(events);
                        
                        // Broadcast to all connected clients
                        emitters.entrySet().removeIf(entry -> {
                            try {
                                entry.getValue().send(SseEmitter.event()
                                    .name("events-update")
                                    .data(eventsJson));
                                return false; // Keep the entry
                            } catch (IOException e) {
                                log.warn("Failed to send update to {}, removing connection", entry.getKey());
                                return true; // Remove the entry
                            }
                        });
                        
                        log.debug("Broadcasted event update to {} connections", emitters.size());
                    } catch (Exception e) {
                        log.error("Error in broadcast scheduler", e);
                    }
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
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }
}
