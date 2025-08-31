// src/main/java/com/jira/jiraclone/entities/Task.java
package com.jira.jiraclone.entities;

import com.jira.jiraclone.entities.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Informations de base
    @Column(nullable = false, length = 180)
    private String title;

    @Column(length = 2000)
    private String description;

    // Relations principales
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    private Sprint sprint;

    // Qui a créé la tâche (membre du projet)
    @ManyToOne(fetch = FetchType.LAZY)
    private ProjectMembership createdBy;

    // À qui elle est assignée (membre du projet)
    @ManyToOne(fetch = FetchType.LAZY)
    private ProjectMembership assignedTo;

    // Qui a fait l’assignation (le PROJECT_OWNER)
    @ManyToOne(fetch = FetchType.LAZY)
    private ProjectMembership assignedBy;

    // Statut et dates
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
