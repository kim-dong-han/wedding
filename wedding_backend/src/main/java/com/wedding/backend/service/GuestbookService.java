package com.wedding.backend.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.wedding.backend.domain.GuestbookEntry;
import com.wedding.backend.dto.GuestbookDto;
import com.wedding.backend.repository.GuestbookRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GuestbookService {

    private final GuestbookRepository guestbookRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<GuestbookEntry> findAll() {
        return guestbookRepository.findAllByOrderByCreatedAtDesc();
    }

    public GuestbookEntry create(GuestbookDto.CreateRequest req) {
        GuestbookEntry entry = new GuestbookEntry(
            UUID.randomUUID().toString(),
            req.name(),
            req.message(),
            passwordEncoder.encode(req.password()),
            LocalDateTime.now()
        );
        return guestbookRepository.save(entry);
    }

    /** 비밀번호가 일치하면 삭제하고 true, 아니면 false를 반환한다. */
    public boolean deleteIfPasswordMatches(String id, String rawPassword) {
        return guestbookRepository.findById(id)
            .filter(entry -> passwordEncoder.matches(rawPassword, entry.getPasswordHash()))
            .map(entry -> {
                guestbookRepository.delete(entry);
                return true;
            })
            .orElse(false);
    }

    /** 관리자 페이지에서는 비밀번호 확인 없이 삭제 가능 */
    public void deleteAsAdmin(String id) {
        guestbookRepository.deleteById(id);
    }

    public GuestbookDto toDto(GuestbookEntry e) {
        return new GuestbookDto(e.getId(), e.getName(), e.getMessage(), e.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
    }
}
