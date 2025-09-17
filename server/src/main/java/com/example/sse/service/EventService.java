package com.example.sse.service;

import java.util.List;
import java.util.UUID;

import com.example.sse.model.SystemEvent;
import com.example.sse.model.sse.SseEvent;

public interface EventService {
    List<SystemEvent> getAllEvents();
    List<SystemEvent> getAllEventsForSSE();
    SystemEvent getEventById(UUID id);
    SystemEvent createEvent(SystemEvent event);
    SystemEvent updateEvent(SystemEvent event);
    void deleteEvent(UUID id);
    SseEvent updateRandomEvent();
    List<SystemEvent> getActiveEvents();
    void cleanupInactiveEvents();
}
