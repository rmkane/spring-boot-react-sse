package com.example.sse.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventSchedulerService {

    private final EventService eventService;

    @Scheduled(fixedRate = 10000) // Every 10 seconds
    public void updateRandomEvent() {
        log.debug("Scheduled event update triggered");
        eventService.updateRandomEvent();
    }
}
