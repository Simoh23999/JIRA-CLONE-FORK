package com.jira.jiraclone.repositories;

import com.jira.jiraclone.entities.Organization;
import com.jira.jiraclone.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project,Long> {

    // recupere un projet par son id
    Optional<Project> findById(Long id);

    // recupere tous les projets lie a une organisation
    List<Project> findByOrganization(Organization organization);

    // verifie si un projet existe dans une organisation
    boolean existsByNameAndOrganization(String name, Organization organization);
}
