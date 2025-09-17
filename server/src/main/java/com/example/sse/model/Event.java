package com.example.sse.model;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    private UUID id;
    private String name;
    private String description;
    private Severity severity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean active;
    private int count;
}
