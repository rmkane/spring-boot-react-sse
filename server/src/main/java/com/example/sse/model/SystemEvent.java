package com.example.sse.model;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemEvent {
    private UUID id;
    private String name;
    private String description;
    private Severity severity;
    private Instant createdAt;
    private Instant updatedAt;
    private boolean active;
    private int count;
}
