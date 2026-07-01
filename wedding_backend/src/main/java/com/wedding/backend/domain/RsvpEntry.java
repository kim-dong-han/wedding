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
public class RsvpEntry {

    @Id
    private String id;

    private String name;

    /** "groom" 또는 "bride" */
    private String side;

    private int guests;

    private boolean attending;

    @Column(length = 1000)
    private String message;

    private String phone;

    private LocalDateTime createdAt;
}
