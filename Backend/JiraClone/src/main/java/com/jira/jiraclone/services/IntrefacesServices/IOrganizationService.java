package com.jira.jiraclone.services.IntrefacesServices;

import com.jira.jiraclone.dtos.OrganizationDto;
import com.jira.jiraclone.dtos.OrganizationResponseDto;
import com.jira.jiraclone.entities.Organization;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.security.UserPrincipal;

public interface IOrganizationService {
    OrganizationResponseDto getOrganizationById(Long Id);
    // src/main/java/com/jira/jiraclone/services/IntrefacesServices/IOrganizationService.java
    void createOrganization(OrganizationDto organization, UserPrincipal userPrincipal);
    void updateOrganization(Long Id, OrganizationDto organization);
    void deleteOrganization(Long Id);
}
