package com.jira.jiraclone.services.ImplServices;

import com.jira.jiraclone.dtos.ProjectMemberResponseDTO;
import com.jira.jiraclone.entities.Membership;
import com.jira.jiraclone.entities.Project;
import com.jira.jiraclone.entities.ProjectMembership;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.enums.ProjectRole;
import com.jira.jiraclone.exceptions.NotFoundException;
import com.jira.jiraclone.exceptions.UnauthorizedException;
import com.jira.jiraclone.repositories.MembershipRepository;
import com.jira.jiraclone.repositories.ProjectMembershipRepository;
import com.jira.jiraclone.repositories.ProjectRepository;
import com.jira.jiraclone.services.IntrefacesServices.IProjectMembershipService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectMembershipServiceImpl implements IProjectMembershipService {

    private ProjectMembershipRepository projectMembershipRepository;
    private ProjectRepository projectRepository;
    private MembershipRepository membershipRepository;

    public ProjectMembershipServiceImpl(ProjectMembershipRepository projectMembershipRepository,
                                         ProjectRepository projectRepository,
                                         MembershipRepository membershipRepository) {
        this.projectMembershipRepository = projectMembershipRepository;
        this.projectRepository = projectRepository;
        this.membershipRepository = membershipRepository;
    }


    /*
     * 1. Vérifie que le projet existe
     * 2. Vérifie que le requester est PROJECT_OWNER
     * 3. Vérifie que le membership à ajouter existe
     * 4. Vérifie que ce membership n'est pas déjà membre du projet
     * 5. Crée le ProjectMembership
     */
    @Override
    @Transactional
    public void addMemberToProject(Long projectId, Long membershipId, User requester) {
    // 1. verfier que le projet existe
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));
    // 2. verfier que le requester est membre dans l'organisation
        Membership membership = membershipRepository.findByUserAndOrganization(requester,project.getOrganization()).orElseThrow(
                ()-> new UnauthorizedException("Vous n'êtes pas membre de l'organisation.")
        );
        // 3. verfier que le requester est un membre du projet
        ProjectMembership requesterProjectMembership = projectMembershipRepository
                .findByProjectAndMembership(project, membership)
                .orElseThrow(() -> new UnauthorizedException("Vous n'avez pas accès à ce projet."));
        if (requesterProjectMembership.getRoleInProject() != ProjectRole.PROJECT_OWNER) {
            throw new UnauthorizedException("Seul le PROJECT_OWNER peut ajouter des membres.");
        }
        // 4. verfier que le membership à ajouter existe
        Membership newMembership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new NotFoundException("Member a ajouter non trouvé"));
        // 5. verfier que ce membership n'est pas déjà membre du projet
        if (projectMembershipRepository.existsByProjectAndMembership(project, newMembership)) {
            throw new UnauthorizedException("Ce membre est déjà dans le projet.");
        }
        // 6. Crée le ProjectMembership
        ProjectMembership nouveauMember = ProjectMembership.builder()
                .project(project)
                .membership(newMembership)
                .roleInProject(ProjectRole.PROJECT_MEMBER) // Par défaut, le rôle est PROJECT_MEMBER
                .creationDate(LocalDateTime.now())
                .build();
        projectMembershipRepository.save(nouveauMember);
    }


    /*
     * 1. Vérifie que le ProjectMembership existe
     * 2. Vérifie que le requester est PROJECT_OWNER sur ce projet
     * 3. Supprime le ProjectMembership
     */
    @Override
    @Transactional
    public void removeMemberFromProject(Long projectMembershipId, User requester) {
        // 1. Vérifie que le ProjectMembership existe
        ProjectMembership projectMembership = projectMembershipRepository.findById(projectMembershipId)
                .orElseThrow(() -> new NotFoundException("Project membership not found"));

        // 2. Vérifie que le requester est PROJECT_OWNER sur ce projet
        Project project = projectMembership.getProject();
        Membership requesterMembership = membershipRepository.findByUserAndOrganization(requester, project.getOrganization())
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de l'organisation."));

        ProjectMembership requesterProjectMembership = projectMembershipRepository
                .findByProjectAndMembership(project, requesterMembership)
                .orElseThrow(() -> new UnauthorizedException("Vous n'avez pas accès à ce projet."));

        if (requesterProjectMembership.getRoleInProject() != ProjectRole.PROJECT_OWNER) {
            throw new UnauthorizedException("Seul le PROJECT_OWNER peut supprimer des membres.");
        }
        // vous etes pas autoriser de supprimer un PROJECT_OWNER par un autre membre un role PROJECT_OWNER
        if (projectMembership.getRoleInProject() == ProjectRole.PROJECT_OWNER) {
            long ownersCount = projectMembershipRepository.countByProjectAndRoleInProject(project, ProjectRole.PROJECT_OWNER);
            if (ownersCount <= 1) {
                throw new UnauthorizedException("Impossible de supprimer le dernier PROJECT_OWNER.");
            }
        }

        // vous ne pouvez pas vous retirer vous-même du projet
        if (requester.equals(projectMembership.getMembership().getUser())) {
            throw new UnauthorizedException("Vous ne pouvez pas vous retirer vous-même du projet.");
        }


        // 3. Supprime le ProjectMembership
        projectMembershipRepository.delete(projectMembership);
    }

    /*
     * 1. Vérifie que le ProjectMembership existe
     * 2. Vérifie que le requester est PROJECT_OWNER
     * 3. Modifie le rôle et sauvegarde
     */
    @Override
    public void updateProjectMemberRole(Long projectMembershipId, ProjectRole newRole, User requester) {
        // 1. Vérifie que le ProjectMembership existe
        ProjectMembership projectMembership = projectMembershipRepository.findById(projectMembershipId)
                .orElseThrow(() -> new NotFoundException("Project membership not found"));

        // 2. Vérifie que le requester est PROJECT_OWNER
        Project project = projectMembership.getProject();
        Membership requesterMembership = membershipRepository.findByUserAndOrganization(requester, project.getOrganization())
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de l'organisation."));

        ProjectMembership requesterProjectMembership = projectMembershipRepository
                .findByProjectAndMembership(project, requesterMembership)
                .orElseThrow(() -> new UnauthorizedException("Vous n'avez pas accès à ce projet."));

        if (requesterProjectMembership.getRoleInProject() != ProjectRole.PROJECT_OWNER) {
            throw new UnauthorizedException("Seul le PROJECT_OWNER peut modifier les rôles des membres.");
        }
        // 3. Empêche de modifier son propre rôle
        if (requester.equals(projectMembership.getMembership().getUser())) {
            throw new UnauthorizedException("Vous ne pouvez pas modifier votre propre rôle.");
        }
        // 4. Si on rétrograde un PROJECT_OWNER, s'assurer qu'il en reste au moins un
        if (projectMembership.getRoleInProject() == ProjectRole.PROJECT_OWNER
                && newRole != ProjectRole.PROJECT_OWNER) {
            long ownersCount = projectMembershipRepository
                    .countByProjectAndRoleInProject(project, ProjectRole.PROJECT_OWNER);
            if (ownersCount <= 1) {
                throw new UnauthorizedException("Impossible de rétrograder le dernier PROJECT_OWNER.");
            }
        }


        // 3. Modifie le rôle et sauvegarde
        projectMembership.setRoleInProject(newRole);
        projectMembershipRepository.save(projectMembership);
    }
    /*
     * 1. Vérifie que le projet existe
     * 2. Vérifie que le requester est membre du projet
     * 3. Récupère tous les ProjectMembership et les convertit en DTO
     */
    @Override
    public List<ProjectMemberResponseDTO> getProjectMembers(Long projectId, User requester) {
        // 1. Vérifie que le projet existe
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));
        // 2. Vérifie que le requester est membre de l'organisation du projet
        Membership requesterMembership = membershipRepository.findByUserAndOrganization(requester, project.getOrganization())
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de l'organisation."));
        // 3. Vérifie que le requester est membre du projet
        ProjectMembership requesterProjectMembership = projectMembershipRepository
                .findByProjectAndMembership(project, requesterMembership)
                .orElseThrow(() -> new UnauthorizedException("Vous n'avez pas accès à ce projet."));
        // 4. Récupère tous les ProjectMembership et les convertit en DTO
        List<ProjectMembership> projectMemberships = projectMembershipRepository.findByProject(project);
        return projectMemberships.stream()
                .map(pm -> ProjectMemberResponseDTO.builder()
                        .id(pm.getId())
                        .membershipId(pm.getMembership().getUser().getId())
                        .fullName(pm.getMembership().getUser().getUsername())
                        .roleInProject(pm.getRoleInProject())
                        .build())
                .toList();

    }
}
