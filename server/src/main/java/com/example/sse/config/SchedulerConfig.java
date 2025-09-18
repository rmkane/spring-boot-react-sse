package com.example.sse.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.sse.service.EventSchedulerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class SchedulerConfig implements CommandLineRunner {

    private final EventSchedulerService eventSchedulerService;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting event scheduler on application startup...");
        eventSchedulerService.startScheduler();
    }
}
