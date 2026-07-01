package com.wedding.backend.domain;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OrderColumn;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 청첩장 전체 정보를 담는 단일 행(singleton row, id=1) 엔티티.
 * 기존 React localStorage의 WeddingInfo 구조를 그대로 반영한다.
 */
@Entity
@Data
@NoArgsConstructor
public class WeddingInfo {

    public static final Long SINGLETON_ID = 1L;

    @Id
    private Long id = SINGLETON_ID;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "name", column = @Column(name = "groom_name")),
        @AttributeOverride(name = "parentRelation", column = @Column(name = "groom_parent_relation")),
        @AttributeOverride(name = "father", column = @Column(name = "groom_father")),
        @AttributeOverride(name = "mother", column = @Column(name = "groom_mother")),
        @AttributeOverride(name = "accountBank", column = @Column(name = "groom_account_bank")),
        @AttributeOverride(name = "accountNumber", column = @Column(name = "groom_account_number")),
        @AttributeOverride(name = "accountOwner", column = @Column(name = "groom_account_owner")),
    })
    private Person groom = new Person();

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "name", column = @Column(name = "bride_name")),
        @AttributeOverride(name = "parentRelation", column = @Column(name = "bride_parent_relation")),
        @AttributeOverride(name = "father", column = @Column(name = "bride_father")),
        @AttributeOverride(name = "mother", column = @Column(name = "bride_mother")),
        @AttributeOverride(name = "accountBank", column = @Column(name = "bride_account_bank")),
        @AttributeOverride(name = "accountNumber", column = @Column(name = "bride_account_number")),
        @AttributeOverride(name = "accountOwner", column = @Column(name = "bride_account_owner")),
    })
    private Person bride = new Person();

    private LocalDate date;

    private LocalTime time;

    @Embedded
    private Location location = new Location();

    @Lob
    @Column(length = 2000)
    private String message;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "wedding_gallery", joinColumns = @JoinColumn(name = "wedding_info_id"))
    @OrderColumn(name = "sort_order")
    @Column(name = "image_url", length = 1000)
    private List<String> gallery = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "wedding_interview", joinColumns = @JoinColumn(name = "wedding_info_id"))
    @OrderColumn(name = "sort_order")
    private List<InterviewItem> interview = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "wedding_notice", joinColumns = @JoinColumn(name = "wedding_info_id"))
    @OrderColumn(name = "sort_order")
    private List<NoticeItem> notices = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "wedding_transport", joinColumns = @JoinColumn(name = "wedding_info_id"))
    @OrderColumn(name = "sort_order")
    private List<TransportItem> transportation = new ArrayList<>();

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "enabled", column = @Column(name = "opening_enabled")),
        @AttributeOverride(name = "text", column = @Column(name = "opening_text")),
        @AttributeOverride(name = "subtext", column = @Column(name = "opening_subtext")),
    })
    private OpeningAnimation openingAnimation = new OpeningAnimation();

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "enabled", column = @Column(name = "bgm_enabled")),
        @AttributeOverride(name = "url", column = @Column(name = "bgm_url")),
        @AttributeOverride(name = "title", column = @Column(name = "bgm_title")),
    })
    private Bgm bgm = new Bgm();
}
