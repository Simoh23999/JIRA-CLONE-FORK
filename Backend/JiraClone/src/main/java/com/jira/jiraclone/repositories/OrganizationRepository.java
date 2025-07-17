package com.jira.jiraclone.repositories;

import com.jira.jiraclone.entities.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Integer> {

}
