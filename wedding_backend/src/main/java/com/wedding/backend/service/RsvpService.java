package com.wedding.backend.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.wedding.backend.domain.RsvpEntry;
import com.wedding.backend.dto.RsvpDto;
import com.wedding.backend.repository.RsvpRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RsvpService {

    private final RsvpRepository rsvpRepository;

    public List<RsvpEntry> findAll() {
        return rsvpRepository.findAllByOrderByCreatedAtDesc();
    }

    public RsvpEntry create(RsvpDto.CreateRequest req) {
        RsvpEntry entry = new RsvpEntry(
            UUID.randomUUID().toString(),
            req.name(),
            req.side(),
            req.guests(),
            req.attending(),
            req.message(),
            req.phone(),
            LocalDateTime.now()
        );
        return rsvpRepository.save(entry);
    }

    public void delete(String id) {
        rsvpRepository.deleteById(id);
    }

    public RsvpDto toDto(RsvpEntry e) {
        return new RsvpDto(
            e.getId(), e.getName(), e.getSide(), e.getGuests(), e.isAttending(),
            e.getMessage(), e.getPhone(), e.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );
    }
}
