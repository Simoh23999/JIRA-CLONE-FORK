package com.jira.jiraclone.services.ImplServices;

import com.jira.jiraclone.entities.Organization;
import com.jira.jiraclone.exceptions.OrganizationNotFoundException;
import com.jira.jiraclone.repositories.OrganizationRepository;
import com.jira.jiraclone.services.IntrefacesServices.IOrganizationService;

public class OrganizationServiceImpl implements IOrganizationService {

    private final OrganizationRepository organizationRepository;
    public OrganizationServiceImpl(OrganizationRepository organizationRepository){
        this.organizationRepository = organizationRepository;
    }

    @Override
    public Organization getOrganizationById(Long id) {
        return organizationRepository.findById(id)
                .orElseThrow() -> new OrganizationNotFoundException("Organization not found");
    }

    @Override
    public void createOrganization(Organization organization) {

    }

    @Override
    public void updateOrgnaization(Long Id, Organization organization) {

    }

    @Override
    public void deleteOrganization(Long Id) {

    }
}
