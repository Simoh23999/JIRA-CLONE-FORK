package com.jira.jiraclone.services.ImplServices;

import com.jira.jiraclone.dtos.ProjectDto;
import com.jira.jiraclone.entities.*;
import com.jira.jiraclone.entities.enums.ProjectRole;
import com.jira.jiraclone.entities.enums.RoleInOrganization;
import com.jira.jiraclone.exceptions.ConflictException;
import com.jira.jiraclone.exceptions.NotFoundException;
import com.jira.jiraclone.exceptions.OrganizationNotFoundException;
import com.jira.jiraclone.exceptions.UnauthorizedException;
import com.jira.jiraclone.repositories.MembershipRepository;
import com.jira.jiraclone.repositories.OrganizationRepository;
import com.jira.jiraclone.repositories.ProjectMembershipRepository;
import com.jira.jiraclone.repositories.ProjectRepository;
import com.jira.jiraclone.services.IntrefacesServices.IProjectService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectServiceImpl implements IProjectService {

    private ProjectRepository projectRepository;
    private OrganizationRepository organizationRepository;
    private MembershipRepository membershipRepository;
    private ProjectMembershipRepository projectMembershipRepository;

    // Constructor injection for repositories
    public ProjectServiceImpl(ProjectRepository projectRepository,
                              OrganizationRepository organizationRepository,
                              MembershipRepository membershipRepository,
                              ProjectMembershipRepository projectMembershipRepository) {
        this.projectRepository = projectRepository;
        this.organizationRepository = organizationRepository;
        this.membershipRepository = membershipRepository;
        this.projectMembershipRepository = projectMembershipRepository;
    }

    /*
     * Règles Métier :
     * 1. Vérifie que l'organisation existe.
     * 2. Vérifie que le requester est membre de l'organisation.
     * 3. Vérifie que le rôle du requester est OWNER ou ADMINPROJECT.
     * 4. Crée le projet avec ses métadonnées.
     * 5. Ajoute automatiquement le créateur comme PROJECT_OWNER dans ProjectMembership.
     */

    @Override
    @Transactional
    public Project createProject(Long organizationId, ProjectDto projectDto, User requester) {
        // 1. Vérifie que l'organisation existe.
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new NotFoundException("Organisation introuvable."));
        // 2. Vérifier que le requester est membre
        Membership membership = membershipRepository.findByUserAndOrganization(requester, organization)
                .orElseThrow(() -> new UnauthorizedException("Vous devez être membre de l'organisation."));
        // 3. Vérifier les droits : seuls OWNER ou ADMIN peuvent créer un projet
        RoleInOrganization role = membership.getRoleInOrganisation();
        if (role != RoleInOrganization.OWNER && role != RoleInOrganization.ADMINPROJECT) {
            throw new UnauthorizedException("Seuls les ADMIN ou OWNER peuvent créer un projet.");
        }
        // 4. Vérifier si un projet avec le même nom existe déjà dans cette organisation
        boolean exists = projectRepository.existsByNameAndOrganization(projectDto.getName(), organization);
        if (exists) {
            throw new ConflictException("Un projet avec ce nom existe déjà dans cette organisation.");
        }
        // 5. Créer le projet avec Builder
        Project project = Project.builder()
                .name(projectDto.getName())
                .description(projectDto.getDescription())
                .organization(organization)
                .createdBy(membership)
                .createdAt(LocalDateTime.now())
                .build();

        // sauvegarder le projet
        Project savedProject = projectRepository.save(project);
        // 6. Ajouter le créateur comme PROJECT_OWNER dans ProjectMembership
        projectMembershipRepository.save(ProjectMembership.builder()
                .project(savedProject)
                .membership(membership)
                .roleInProject(ProjectRole.PROJECT_OWNER)
                .creationDate(LocalDateTime.now())
                .build());
        return savedProject;
    }

    /* * Règles Métier pour getProjectById  :
        * 1. Vérifie que le projet existe.
        * 2. Vérifie que le requester est membre de l'organisation du projet.
        * 3.Renvoie le Projet
     */
    @Override
    @Transactional
    public Project getProjectById(Long projectId, User requester) {
        // 1. Vérifie que le projet existe
        Project project = projectRepository.findById(projectId).orElseThrow(
                () -> new NotFoundException("Projet introuvable.")
        );
        // 2. Vérifie que le requester est membre de l'organisation du projet
        Organization organization = project.getOrganization();
        Membership membership = membershipRepository.findByUserAndOrganization(requester, organization)
                .orElseThrow(() -> new UnauthorizedException("Vous devez être membre de l'organisation."));
        // 3. verfier que le requster est membre du projet
        boolean isMemberOfProject = projectMembershipRepository.existsByProjectAndMembership(project, membership);

        if (!isMemberOfProject) {
            throw new UnauthorizedException("Vous n'êtes pas membre de ce projet.");
        }
        // 4. Renvoie le projet
        return project;
    }



    @Override
    @Transactional
    public Project updateProject(Long projectId, ProjectDto projectDto, User requester) {
        // 1. Vérifie que le projet existe
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Projet introuvable."));
        // 2. Vérifie que le requester est membre de l'organisation du projet
        Organization organization = project.getOrganization();
        Membership membership = membershipRepository.findByUserAndOrganization(requester, organization)
                .orElseThrow(() -> new UnauthorizedException("Vous devez être membre de l'organisation."));
        // 3. verfier que le requster est membre du projet
       ProjectMembership projectMembership = projectMembershipRepository
                .findByProjectAndMembership(project, membership)
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de ce projet."));
        // 4. Verfier les droits :seuls OWNER ou ADMINPROJECT peuvent modifier un projet
        ProjectRole role = projectMembership.getRoleInProject();
        if (role != ProjectRole.PROJECT_OWNER ) {
            throw new UnauthorizedException("Seuls les PROJECT_OWNER  peuvent modifier un projet.");
        }
        // 5.Appliquer les modifications
        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());
        project.setUpdatedAt(LocalDateTime.now());
        // 6. Sauvegarder le projet mis à jour
        Project updatedProject = projectRepository.save(project);
        return updatedProject;
    }

    @Override
    @Transactional
    public void deleteProject(Long projectId, User requester) {

        // 1. Vérifie que le projet existe
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Projet introuvable."));

        // 2. Vérifie que le requester est membre de l'organisation du projet
        Organization organization = project.getOrganization();
        Membership membership = membershipRepository.findByUserAndOrganization(requester, organization)
                .orElseThrow(() -> new UnauthorizedException("Vous devez être membre de l'organisation."));

        // 3. verfier que le requster est membre du projet
        ProjectMembership projectMembership = projectMembershipRepository
                .findByProjectAndMembership(project, membership)
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de ce projet."));

        // 4. Verfier les droits :seuls OWNER ou ADMINPROJECT peuvent supprimer un projet
        ProjectRole role = projectMembership.getRoleInProject();
        if (role != ProjectRole.PROJECT_OWNER) {
            throw new UnauthorizedException("Seuls les PROJECT_OWNER peuvent supprimer un projet.");
        }

        // 5.supprimer les membres du projet
        projectMembershipRepository.deleteAllByProject(project);

        // 6. Supprimer le projet
        projectRepository.delete(project);
    }

    @Override
    public List<Project> getProjectsByOrganization(Long organizationId, User requester) {
        // 1. Vérifie que l'organisation existe
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new NotFoundException("Organisation introuvable."));

        // 2. Vérifie que le requester est membre de l'organisation
        boolean isMember = membershipRepository.existsByUserAndOrganization(requester, organization);
        if (!isMember) {
            throw new UnauthorizedException("Vous n'êtes pas membre de cette organisation.");
        }
        // 3. Récupère tous les projets liés à l'organisation
        return projectRepository.findByOrganization(organization);
    }
}
