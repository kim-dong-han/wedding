package com.wedding.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wedding.backend.domain.WeddingInfo;

public interface WeddingInfoRepository extends JpaRepository<WeddingInfo, Long> {
}
