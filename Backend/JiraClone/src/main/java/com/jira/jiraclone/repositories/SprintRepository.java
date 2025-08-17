package com.jira.jiraclone.repositories;

import com.jira.jiraclone.entities.Sprint;
import com.jira.jiraclone.entities.enums.SprintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {

    /**
     * Trouve tous les sprints d'un projet, triés par date de création décroissante
     */
    List<Sprint> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    /**
     * Trouve tous les sprints d'un projet avec un statut donné
     */
    List<Sprint> findByProjectIdAndStatus(Long projectId, SprintStatus status);

    /**
     * Trouve le sprint actif d'un projet (s'il existe)
     */
    @Query("SELECT s FROM Sprint s WHERE s.project.id = :projectId AND s.status = 'ACTIVE'")
    List<Sprint> findActiveSprintsByProjectId(@Param("projectId") Long projectId);

    /**
     * Vérifie s'il existe un sprint actif dans un projet
     */
    boolean existsByProjectIdAndStatus(Long projectId, SprintStatus status);

    /**
     * Trouve tous les sprints créés par un membre de projet donné
     */
    List<Sprint> findByCreatedByProjectMembershipIdOrderByCreatedAtDesc(Long projectMembershipId);

    /**
     * Compte le nombre de sprints dans un projet
     */
    long countByProjectId(Long projectId);

    /**
     * Trouve tous les sprints d'un projet avec un statut donné, triés par date de début
     */
    List<Sprint> findByProjectIdAndStatusOrderByStartDate(Long projectId, SprintStatus status);
}