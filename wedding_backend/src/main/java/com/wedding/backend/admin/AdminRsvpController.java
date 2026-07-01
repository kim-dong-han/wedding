package com.wedding.backend.admin;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wedding.backend.domain.RsvpEntry;
import com.wedding.backend.service.RsvpService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class AdminRsvpController {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final RsvpService rsvpService;

    @GetMapping("/admin/rsvp")
    public String rsvpPage(Model model) {
        model.addAttribute("rsvps", rsvpService.findAll());
        return "admin/rsvp";
    }

    @PostMapping("/admin/rsvp/{id}/delete")
    public String deleteRsvp(@PathVariable String id) {
        rsvpService.delete(id);
        return "redirect:/admin/rsvp";
    }

    @GetMapping("/admin/rsvp/export")
    @ResponseBody
    public ResponseEntity<byte[]> exportCsv() {
        StringBuilder sb = new StringBuilder("﻿");
        sb.append("이름,구분,하객수,참석여부,메시지,연락처,응답일시\n");
        for (RsvpEntry r : rsvpService.findAll()) {
            sb.append('"').append(r.getName()).append("\",")
              .append('"').append("groom".equals(r.getSide()) ? "신랑" : "신부").append("\",")
              .append('"').append(r.getGuests()).append("\",")
              .append('"').append(r.isAttending() ? "참석" : "불참").append("\",")
              .append('"').append(r.getMessage() == null ? "" : r.getMessage().replace("\"", "\"\"")).append("\",")
              .append('"').append(r.getPhone()).append("\",")
              .append('"').append(r.getCreatedAt().format(DATE_FORMAT)).append("\"\n");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));
        headers.setContentDispositionFormData("attachment", "rsvp-list.csv");
        return new ResponseEntity<>(sb.toString().getBytes(StandardCharsets.UTF_8), headers, 200);
    }
}
