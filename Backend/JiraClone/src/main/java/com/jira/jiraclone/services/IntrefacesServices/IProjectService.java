package com.jira.jiraclone.services.IntrefacesServices;

import com.jira.jiraclone.dtos.ProjectDto;
import com.jira.jiraclone.entities.Project;
import com.jira.jiraclone.entities.User;

import java.util.List;

public interface IProjectService {

    // creation un nouveau projet
    Project createProject(Long organizationId, ProjectDto projectDto, User requester);

    // recuperer un projet par son ID
    Project getProjectById(Long projectId, User requester);

    // mettre a jour un projet
    Project updateProject(Long projectId, ProjectDto projectDto, User requester);

    // supprimer un projet
    void deleteProject(Long projectId, User requester);

    // recuperer tous les projets d'une organisation
    List<Project> getProjectsByOrganization(Long organizationId, User requester);

}
