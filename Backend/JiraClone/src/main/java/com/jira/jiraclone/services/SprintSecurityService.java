package com.jira.jiraclone.services;

import com.jira.jiraclone.entities.ProjectMembership;
import com.jira.jiraclone.entities.Sprint;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.enums.ProjectRole;
import com.jira.jiraclone.repositories.ProjectMembershipRepository;
import com.jira.jiraclone.repositories.SprintRepository;
import com.jira.jiraclone.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SprintSecurityService {

    private final ProjectMembershipRepository projectMembershipRepository;
    private final SprintRepository sprintRepository;

    /**
     * Vérifie si l'utilisateur actuel peut créer un sprint dans le projet donné
     */
    public boolean canCreateSprint(Long projectId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            System.out.println("User is ");
            return false;
        }

        Optional<ProjectMembership> membership = projectMembershipRepository
                .findByMembershipUserIdAndProjectId(currentUser.getId(), projectId);

        System.out.println("Membership is " + membership.isPresent() +"/ Membership Role"+ membership.get().getRoleInProject() +"/ Membership Id" + membership.get().getId());

        return membership.isPresent() &&
                membership.get().getRoleInProject() == ProjectRole.PROJECT_OWNER;
    }

    /**
     * Vérifie si l'utilisateur actuel peut modifier le sprint donné
     */
    public boolean canUpdateSprint(Long sprintId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return false;
        }

        Optional<Sprint> sprint = sprintRepository.findById(sprintId);
        if (sprint.isEmpty()) {
            return false;
        }

        Long projectId = sprint.get().getProject().getId();
        Optional<ProjectMembership> membership = projectMembershipRepository
                .findByMembershipUserIdAndProjectId(currentUser.getId(), projectId);

        boolean istrue =  membership.isPresent() &&
                membership.get().getRoleInProject() == ProjectRole.PROJECT_OWNER;
        System.out.println(membership.get().getRoleInProject());
        return istrue;
    }

    /**
     * Vérifie si l'utilisateur actuel peut supprimer le sprint donné
     */
    public boolean canDeleteSprint(Long sprintId) {
        return canUpdateSprint(sprintId); // Même logique que pour la modification
    }

    /**
     * Vérifie si l'utilisateur actuel peut démarrer le sprint donné
     */
    public boolean canStartSprint(Long sprintId) {
        return canUpdateSprint(sprintId); // Seul le PROJECT_OWNER peut démarrer
    }

    /**
     * Vérifie si l'utilisateur actuel peut terminer le sprint donné
     */
    public boolean canCompleteSprint(Long sprintId) {
        return canUpdateSprint(sprintId); // Seul le PROJECT_OWNER peut terminer
    }

    /**
     * Vérifie si l'utilisateur actuel peut annuler le sprint donné
     */
    public boolean canCancelSprint(Long sprintId) {
        return canUpdateSprint(sprintId); // Seul le PROJECT_OWNER peut annuler
    }

    /**
     * Vérifie si l'utilisateur actuel peut voir les sprints du projet donné
     */
    public boolean canViewSprints(Long projectId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return false;
        }

        Optional<ProjectMembership> membership = projectMembershipRepository
                .findByMembershipUserIdAndProjectId(currentUser.getId(), projectId);

        return membership.isPresent(); // PROJECT_OWNER et PROJECT_MEMBER peuvent voir
    }

    /**
     * Vérifie si l'utilisateur actuel peut voir le sprint donné
     */
    public boolean canViewSprint(Long sprintId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return false;
        }

        Optional<Sprint> sprint = sprintRepository.findById(sprintId);
        if (sprint.isEmpty()) {
            return false;
        }

        Long projectId = sprint.get().getProject().getId();
        return canViewSprints(projectId);
    }

    /**
     * Récupère l'utilisateur actuellement authentifié
     */
    private User getCurrentUser() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = principal.getUser();
        if ( user != null) {
            System.out.println("User is " + user.getUsername() + " with ID: " + user.getId());
            return user;

        }
        return null;
    }
}