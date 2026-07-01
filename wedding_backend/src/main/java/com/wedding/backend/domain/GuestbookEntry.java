package com.wedding.backend.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestbookEntry {

    @Id
    private String id;

    private String name;

    @Column(length = 2000)
    private String message;

    /** BCrypt로 해시된 삭제용 비밀번호 (평문 저장하지 않음) */
    private String passwordHash;

    private LocalDateTime createdAt;
}
