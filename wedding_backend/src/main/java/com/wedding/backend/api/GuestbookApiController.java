package com.wedding.backend.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.wedding.backend.dto.GuestbookDto;
import com.wedding.backend.service.GuestbookService;

import lombok.RequiredArgsConstructor;

/** 방명록은 하객에게도 공개 표시되므로 조회/작성/(비밀번호 확인 후) 삭제를 모두 공개 API로 제공. */
@RestController
@RequiredArgsConstructor
public class GuestbookApiController {

    private final GuestbookService guestbookService;

    @GetMapping("/api/guestbook")
    public List<GuestbookDto> list() {
        return guestbookService.findAll().stream().map(guestbookService::toDto).toList();
    }

    @PostMapping("/api/guestbook")
    @ResponseStatus(HttpStatus.CREATED)
    public GuestbookDto create(@RequestBody GuestbookDto.CreateRequest request) {
        return guestbookService.toDto(guestbookService.create(request));
    }

    @DeleteMapping("/api/guestbook/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, @RequestBody GuestbookDto.DeleteRequest request) {
        boolean deleted = guestbookService.deleteIfPasswordMatches(id, request.password());
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}
