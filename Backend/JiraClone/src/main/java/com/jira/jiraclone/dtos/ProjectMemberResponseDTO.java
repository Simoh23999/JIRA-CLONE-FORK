package com.jira.jiraclone.dtos;

import com.jira.jiraclone.entities.enums.ProjectRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectMemberResponseDTO {
    private Long id; // ID du ProjectMembership
    private Long membershipId; // ID de la Membership
    private String fullName; // nom complet du user lié à la Membership
    private String email; // email du user
    private ProjectRole roleInProject; // rôle dans le projet
}
