package com.jira.jiraclone.entities;

import com.jira.jiraclone.entities.enums.RoleInOrganization;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleInOrganization roleInOrganisation; // e.g., "ADMIN", "MEMBER", etc.

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private Organization organization;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
