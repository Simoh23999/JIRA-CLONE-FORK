package com.jira.jiraclone.repositories;

import com.jira.jiraclone.entities.*;
import com.jira.jiraclone.entities.enums.ProjectRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

// * Trouve l'appartenance d'un utilisateur à un projet
// * (via la relation Membership -> User)
//            */
    @Query("SELECT pm FROM ProjectMembership pm " +
            "JOIN pm.membership m " +
            "WHERE m.user.id = :userId AND pm.project.id = :projectId")
    Optional<ProjectMembership> findByMembershipUserIdAndProjectId(
            @Param("userId") Long userId,
            @Param("projectId") Long projectId
    );
}
