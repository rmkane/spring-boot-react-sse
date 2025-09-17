package com.example.sse.model.sse;

import com.example.sse.model.SystemEvent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SseEvent {
    private Operation operation;
    private SystemEvent event;
}
