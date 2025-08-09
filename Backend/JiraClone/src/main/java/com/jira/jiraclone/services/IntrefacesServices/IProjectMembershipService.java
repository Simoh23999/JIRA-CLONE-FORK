package com.jira.jiraclone.services.IntrefacesServices;

import com.jira.jiraclone.dtos.ProjectMemberResponseDTO;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.enums.ProjectRole;

import java.util.List;

public interface IProjectMembershipService {

    void addMemberToProject(Long projectId, Long membershipId, User requester);
    void removeMemberFromProject(Long projectMembershipId, User requester);
    void updateProjectMemberRole(Long projectMembershipId, ProjectRole newRole, User requester);
    List<ProjectMemberResponseDTO> getProjectMembers(Long projectId, User requester);

}
