package com.jira.jiraclone.dtos;

import com.jira.jiraclone.entities.enums.RoleInOrganization;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class AddMemberRequest {
    private String email;
    private Long organizationId;
    private RoleInOrganization role; // Assuming role is a string representation of RoleInOrganization enum
}
