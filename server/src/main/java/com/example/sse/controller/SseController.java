package com.example.sse.controller;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.sse.model.SystemEvent;
import com.example.sse.service.EventService;
import com.example.sse.service.EventSchedulerService;
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
    private final EventSchedulerService eventSchedulerService;

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
        eventSchedulerService.addEmitter(emitterId, emitter);

        log.info("New SSE connection established: {} (total connections: {})", emitterId, eventSchedulerService.getConnectionCount());

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
            eventSchedulerService.removeEmitter(emitterId);
            return emitter;
        }

        emitter.onCompletion(() -> {
            log.info("SSE connection completed: {} (remaining connections: {})", emitterId, eventSchedulerService.getConnectionCount() - 1);
            eventSchedulerService.removeEmitter(emitterId);
        });

        emitter.onTimeout(() -> {
            log.info("SSE connection timed out: {} (remaining connections: {})", emitterId, eventSchedulerService.getConnectionCount() - 1);
            eventSchedulerService.removeEmitter(emitterId);
        });

        emitter.onError((ex) -> {
            // Handle different types of connection errors gracefully
            if (ex instanceof AsyncRequestNotUsableException ||
                (ex.getCause() instanceof IOException) ||
                (ex.getMessage() != null && ex.getMessage().contains("Broken pipe"))) {
                log.debug("SSE connection closed for client {} (remaining connections: {})",
                    emitterId, eventSchedulerService.getConnectionCount() - 1);
            } else {
                log.error("SSE connection error: {} (remaining connections: {})",
                    emitterId, eventSchedulerService.getConnectionCount() - 1, ex);
            }
            eventSchedulerService.removeEmitter(emitterId);
        });

        return emitter;
    }


    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("SSE Server is running! Active connections: " + eventSchedulerService.getConnectionCount());
    }

    @GetMapping("/events")
    public ResponseEntity<List<SystemEvent>> getAllEvents() {
        List<SystemEvent> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }
}
