package com.wedding.backend.dto;

public record RsvpDto(
    String id,
    String name,
    String side,
    int guests,
    boolean attending,
    String message,
    String phone,
    String createdAt
) {

    public record CreateRequest(
        String name,
        String side,
        int guests,
        boolean attending,
        String message,
        String phone
    ) {
    }
}
