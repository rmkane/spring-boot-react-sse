package com.example.sse.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.sse.model.SystemEvent;
import com.example.sse.model.sse.Operation;
import com.example.sse.model.sse.SseEvent;
import com.example.sse.model.Severity;
import com.example.sse.service.EventService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EventServiceImpl implements EventService {

    private final Map<UUID, SystemEvent> events = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public EventServiceImpl() {
        // Initialize with some sample events
        initializeSampleEvents();
    }

    private void initializeSampleEvents() {
        String[] eventNames = {
            "Database Connection", "API Response Time", "Memory Usage",
            "CPU Load", "Disk Space", "Network Latency", "User Login",
            "Payment Processing", "Email Delivery", "File Upload"
        };

        String[] descriptions = {
            "Monitoring database connection health",
            "Tracking API response times",
            "Monitoring system memory usage",
            "Tracking CPU utilization",
            "Monitoring available disk space",
            "Measuring network latency",
            "Tracking user authentication",
            "Monitoring payment transactions",
            "Tracking email delivery status",
            "Monitoring file upload progress"
        };

        Severity[] severities = Severity.values();

        for (int i = 0; i < 10; i++) {
            SystemEvent event = SystemEvent.builder()
                .id(UUID.randomUUID())
                .name(eventNames[i])
                .description(descriptions[i])
                .severity(severities[random.nextInt(severities.length)])
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .active(true)
                .count(random.nextInt(100))
                .build();

            events.put(event.getId(), event);
        }
        log.info("Initialized {} sample events", events.size());
    }

    @Override
    public List<SystemEvent> getAllEvents() {
        List<SystemEvent> allEvents = new ArrayList<>(events.values());
        log.debug("Returning {} events to client", allEvents.size());
        return allEvents;
    }

    @Override
    public SystemEvent getEventById(UUID id) {
        return events.get(id);
    }

    @Override
    public SystemEvent createEvent(SystemEvent event) {
        if (event.getId() == null) {
            event.setId(UUID.randomUUID());
        }
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        events.put(event.getId(), event);
        log.info("Created event: {}", event.getName());
        return event;
    }

    @Override
    public SystemEvent updateEvent(SystemEvent event) {
        if (events.containsKey(event.getId())) {
            event.setUpdatedAt(LocalDateTime.now());
            events.put(event.getId(), event);
            log.info("Updated event: {}", event.getName());
            return event;
        }
        return null;
    }

    @Override
    public void deleteEvent(UUID id) {
        SystemEvent removed = events.remove(id);
        if (removed != null) {
            log.info("Deleted event: {}", removed.getName());
        }
    }

    @Override
    public SseEvent updateRandomEvent() {
        // Randomly choose an operation: CREATE, UPDATE, or DELETE
        double operation = random.nextDouble();

        if (operation < 0.4) { // 40% chance - CREATE
            return createRandomEvent();
        } else if (operation < 0.8) { // 40% chance - UPDATE
            return updateExistingEvent();
        } else { // 20% chance - DELETE
            return deleteRandomEvent();
        }
    }

    private SseEvent createRandomEvent() {
        String[] eventNames = {
            "Database Connection", "API Response Time", "Memory Usage",
            "CPU Load", "Disk Space", "Network Latency", "User Login",
            "Payment Processing", "Email Delivery", "File Upload",
            "Cache Hit Rate", "Queue Length", "Error Rate", "Response Time",
            "Active Sessions", "Data Sync", "Backup Status", "Security Scan"
        };

        String[] descriptions = {
            "Monitoring database connection health",
            "Tracking API response times",
            "Monitoring system memory usage",
            "Tracking CPU utilization",
            "Monitoring available disk space",
            "Measuring network latency",
            "Tracking user authentication",
            "Monitoring payment transactions",
            "Tracking email delivery status",
            "Monitoring file upload progress",
            "Tracking cache performance",
            "Monitoring queue processing",
            "Tracking system errors",
            "Measuring response times",
            "Tracking active user sessions",
            "Monitoring data synchronization",
            "Tracking backup operations",
            "Monitoring security scans"
        };

        Severity[] severities = Severity.values();

        SystemEvent newEvent = SystemEvent.builder()
            .id(UUID.randomUUID())
            .name(eventNames[random.nextInt(eventNames.length)])
            .description(descriptions[random.nextInt(descriptions.length)])
            .severity(severities[random.nextInt(severities.length)])
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .active(random.nextBoolean())
            .count(random.nextInt(1000))
            .build();

        events.put(newEvent.getId(), newEvent);
        log.info("Created new event: {} (severity: {}, active: {}, count: {})",
            newEvent.getName(), newEvent.getSeverity(), newEvent.isActive(), newEvent.getCount());

        return SseEvent.builder()
            .operation(Operation.CREATE)
            .event(newEvent)
            .build();
    }

    private SseEvent updateExistingEvent() {
        if (events.isEmpty()) {
            return createRandomEvent(); // Create if no events exist
        }

        List<SystemEvent> eventList = new ArrayList<>(events.values());
        SystemEvent randomEvent = eventList.get(random.nextInt(eventList.size()));

        // Randomly update event properties
        randomEvent.setCount(randomEvent.getCount() + random.nextInt(50) + 1);
        randomEvent.setUpdatedAt(LocalDateTime.now());

        // Randomly change severity
        if (random.nextBoolean()) {
            Severity[] severities = Severity.values();
            randomEvent.setSeverity(severities[random.nextInt(severities.length)]);
        }

        // Randomly toggle active status
        if (random.nextDouble() < 0.3) { // 30% chance
            randomEvent.setActive(!randomEvent.isActive());
        }

        events.put(randomEvent.getId(), randomEvent);
        log.info("Updated event: {} (count: {}, severity: {}, active: {})",
            randomEvent.getName(), randomEvent.getCount(),
            randomEvent.getSeverity(), randomEvent.isActive());

        return SseEvent.builder()
            .operation(Operation.UPDATE)
            .event(randomEvent)
            .build();
    }

    private SseEvent deleteRandomEvent() {
        if (events.size() <= 2) { // Keep at least 2 events
            return updateExistingEvent(); // Update instead of delete
        }

        List<SystemEvent> eventList = new ArrayList<>(events.values());
        SystemEvent eventToDelete = eventList.get(random.nextInt(eventList.size()));

        events.remove(eventToDelete.getId());
        log.info("Deleted event: {} (was active: {}, count: {})",
            eventToDelete.getName(), eventToDelete.isActive(), eventToDelete.getCount());

        return SseEvent.builder()
            .operation(Operation.DELETE)
            .event(eventToDelete)
            .build();
    }

    @Override
    public List<SystemEvent> getActiveEvents() {
        return events.values().stream()
            .filter(SystemEvent::isActive)
            .collect(Collectors.toList());
    }
}
