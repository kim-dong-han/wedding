package com.wedding.backend.dto;

public record GuestbookDto(
    String id,
    String name,
    String message,
    String createdAt
) {

    public record CreateRequest(
        String name,
        String message,
        String password
    ) {
    }

    public record DeleteRequest(
        String password
    ) {
    }
}
