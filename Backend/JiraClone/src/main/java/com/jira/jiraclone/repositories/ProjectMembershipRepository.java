package com.jira.jiraclone.repositories;

import com.jira.jiraclone.entities.Membership;
import com.jira.jiraclone.entities.Organization;
import com.jira.jiraclone.entities.Project;
import com.jira.jiraclone.entities.ProjectMembership;
import com.jira.jiraclone.entities.enums.ProjectRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectMembershipRepository extends JpaRepository<ProjectMembership, Long> {
    // recupere liste des membres d'un projet
    List<ProjectMembership> findByProject(Project project);
    // verfier si un membre est dans un projet
    Optional<ProjectMembership> findByProjectAndMembership(Project project, Membership membership);
    // recupere tous les projets d'un membre
    List<ProjectMembership> findByMembership(Membership membership);

    boolean existsByProjectAndMembership(Project project, Membership membership);

    void deleteAllByProject(Project project);

    long countByProjectAndRoleInProject(Project project, ProjectRole projectRole);
}
