package com.wedding.backend.domain;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {

    private String name;

    private String hall;

    private String address;

    private double lat;

    private double lng;

    private String phone;
}
