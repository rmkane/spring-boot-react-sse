package com.example.sse.service;

import java.util.List;
import java.util.UUID;

import com.example.sse.model.Event;

public interface EventService {
    List<Event> getAllEvents();
    Event getEventById(UUID id);
    Event createEvent(Event event);
    Event updateEvent(Event event);
    void deleteEvent(UUID id);
    void updateRandomEvent();
    List<Event> getActiveEvents();
}
