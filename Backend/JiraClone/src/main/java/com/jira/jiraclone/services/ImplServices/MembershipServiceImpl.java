package com.jira.jiraclone.services.ImplServices;

import com.jira.jiraclone.entities.Membership;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.enums.RoleInOrganization;
import com.jira.jiraclone.services.IntrefacesServices.IMembershipService;

import java.util.List;

public class MembershipServiceImpl implements IMembershipService {
    @Override
    public void addMemberToOrganization(Long organizationId, String email, RoleInOrganization role, User requester) {

    }

    @Override
    public void removeMemberFromOrganization(Long organizationId, Long targetUserId, User requester) {

    }

    @Override
    public void updateMemberRole(Long organizationId, Long targetUserId, RoleInOrganization newRole, User requester) {

    }

    @Override
    public List<Membership> getMembersByOrganization(Long organizationId, User requester) {
        return List.of();
    }
}
