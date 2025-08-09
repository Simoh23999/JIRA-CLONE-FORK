package com.jira.jiraclone.entities;

import com.jira.jiraclone.entities.enums.ProjectRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    @ManyToOne
    private Project project;// Assuming each project membership is linked to a specific project

    @ManyToOne
    private Membership membership; // Assuming each project membership is linked to a specific membership

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ProjectRole roleInProject; // Role in the project, e.g., "ADMIN", "MEMBER", etc.
    private LocalDateTime creationDate;
}
