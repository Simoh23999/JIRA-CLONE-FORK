package com.jira.jiraclone.repositories;

import com.jira.jiraclone.entities.Organization;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findById(Long id);
}
