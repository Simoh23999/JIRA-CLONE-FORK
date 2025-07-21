package com.jira.jiraclone.dtos;

import com.jira.jiraclone.entities.enums.RoleInOrganization;
import lombok.Data;

@Data
public class UpdateMemberRoleRequest {
    private RoleInOrganization newRole;
}