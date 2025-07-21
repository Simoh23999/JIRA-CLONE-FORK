package com.jira.jiraclone.services.IntrefacesServices;

import com.jira.jiraclone.entities.Organization;

public interface IOrganizationService {
    Organization getOrganizationById(Long Id);
    void createOrganization(Organization organization);
    void updateOrgnaization(Long Id, Organization organization);
    void deleteOrganization(Long Id);
}
