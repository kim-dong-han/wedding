package com.wedding.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Person {

    private String name;

    private String parentRelation;

    private String father;

    private String mother;

    private String accountBank;

    @Column(length = 100)
    private String accountNumber;

    private String accountOwner;
}
