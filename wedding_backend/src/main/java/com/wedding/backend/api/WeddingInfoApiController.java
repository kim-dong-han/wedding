package com.wedding.backend.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wedding.backend.dto.WeddingInfoDto;
import com.wedding.backend.service.WeddingInfoService;

import lombok.RequiredArgsConstructor;

/** 하객용 React 청첩장 페이지가 읽어가는 공개 조회 API. */
@RestController
@RequiredArgsConstructor
public class WeddingInfoApiController {

    private final WeddingInfoService weddingInfoService;

    @GetMapping("/api/wedding-info")
    public WeddingInfoDto getWeddingInfo() {
        return weddingInfoService.getDto();
    }
}
