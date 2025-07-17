package com.jira.jiraclone.services.IntrefacesServices;

import com.jira.jiraclone.entities.Membership;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.enums.RoleInOrganization;

import java.util.List;

public interface IMembershipService {
    void addMemberToOrganization(Long organizationId, String email, RoleInOrganization role, User requester);
    void removeMemberFromOrganization(Long organizationId, Long targetUserId, User requester);
    void updateMemberRole(Long organizationId, Long targetUserId, RoleInOrganization newRole, User requester);
    List<Membership> getMembersByOrganization(Long organizationId, User requester);
}
