package com.wedding.backend.dto;

import java.util.List;

/**
 * React WeddingInfo 인터페이스(src/data/wedding-info.ts)와 1:1로 매칭되는 JSON 응답 DTO.
 */
public record WeddingInfoDto(
    PersonDto groom,
    PersonDto bride,
    String date,
    String time,
    LocationDto location,
    String message,
    List<String> gallery,
    List<InterviewDto> interview,
    List<NoticeDto> notices,
    List<TransportDto> transportation,
    OpeningAnimationDto openingAnimation,
    BgmDto bgm
) {

    public record PersonDto(
        String name,
        String parentRelation,
        ParentsDto parents,
        AccountDto account
    ) {
    }

    public record ParentsDto(
        String father,
        String mother
    ) {
    }

    public record AccountDto(
        String bank,
        String number,
        String owner
    ) {
    }

    public record LocationDto(
        String name,
        String hall,
        String address,
        double lat,
        double lng,
        String phone
    ) {
    }

    public record InterviewDto(
        String question,
        String answer
    ) {
    }

    public record NoticeDto(
        String title,
        String content
    ) {
    }

    public record TransportDto(
        String method,
        String description
    ) {
    }

    public record OpeningAnimationDto(
        boolean enabled,
        String text,
        String subtext
    ) {
    }

    public record BgmDto(
        boolean enabled,
        String url,
        String title
    ) {
    }
}
