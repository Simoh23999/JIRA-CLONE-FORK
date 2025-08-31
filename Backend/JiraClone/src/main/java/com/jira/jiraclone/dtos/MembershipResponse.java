package com.jira.jiraclone.dtos;

import com.jira.jiraclone.entities.enums.RoleInOrganization;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MembershipResponse {
    private Long userId;
    private Long membershipId;
    private String fullName;
    private String email;
    private RoleInOrganization role;
}
