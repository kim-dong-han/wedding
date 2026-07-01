package com.wedding.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wedding.backend.domain.GuestbookEntry;

public interface GuestbookRepository extends JpaRepository<GuestbookEntry, String> {

    List<GuestbookEntry> findAllByOrderByCreatedAtDesc();
}
