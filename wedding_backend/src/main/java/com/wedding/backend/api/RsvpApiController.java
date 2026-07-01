package com.wedding.backend.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.wedding.backend.dto.RsvpDto;
import com.wedding.backend.service.RsvpService;

import lombok.RequiredArgsConstructor;

/** 하객이 참석 여부를 제출하는 공개 API. 조회/삭제는 관리자 화면(Thymeleaf)에서만 제공. */
@RestController
@RequiredArgsConstructor
public class RsvpApiController {

    private final RsvpService rsvpService;

    @PostMapping("/api/rsvp")
    @ResponseStatus(HttpStatus.CREATED)
    public RsvpDto create(@RequestBody RsvpDto.CreateRequest request) {
        return rsvpService.toDto(rsvpService.create(request));
    }
}
