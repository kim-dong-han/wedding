package com.wedding.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wedding.backend.domain.RsvpEntry;

public interface RsvpRepository extends JpaRepository<RsvpEntry, String> {

    List<RsvpEntry> findAllByOrderByCreatedAtDesc();
}
