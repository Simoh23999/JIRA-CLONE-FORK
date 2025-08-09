package com.jira.jiraclone.controllers;

import com.jira.jiraclone.dtos.ProjectDto;
import com.jira.jiraclone.dtos.ResponseProjectDTO;
import com.jira.jiraclone.dtos.ProjectMemberDTO;
import com.jira.jiraclone.entities.Project;
import com.jira.jiraclone.entities.ProjectMembership;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.security.UserPrincipal;
import com.jira.jiraclone.services.IntrefacesServices.IProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000"
})
public class ProjectController {

    private final IProjectService projectService;

    public ProjectController(IProjectService projectService) {
        this.projectService = projectService;
    }

    // 1. Créer un projet
    @PostMapping("/organizations/{organizationId}/projects")
    public ResponseEntity<Map<String, Object>> createProject(
            @PathVariable Long organizationId,
            @RequestBody ProjectDto projectDto,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        Project project = projectService.createProject(organizationId, projectDto, requester);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 201);
        response.put("message", "Projet créé avec succès");
        response.put("project", mapToResponseDTO(project));

        return ResponseEntity.status(201).body(response);
    }

    // 2. Récupérer un projet par son ID
    @GetMapping("/{projectId}")
    public ResponseEntity<Map<String, Object>> getProjectById(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        Project project = projectService.getProjectById(projectId, requester);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Projet récupéré avec succès");
        response.put("project", mapToResponseDTO(project));

        return ResponseEntity.ok(response);
    }

    // 3. Mettre à jour un projet
    @PutMapping("/{projectId}")
    public ResponseEntity<Map<String, Object>> updateProject(
            @PathVariable Long projectId,
            @RequestBody ProjectDto projectDto,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        Project updatedProject = projectService.updateProject(projectId, projectDto, requester);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Projet mis à jour avec succès");
        response.put("project", mapToResponseDTO(updatedProject));

        return ResponseEntity.ok(response);
    }

    // 4. Supprimer un projet
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Map<String, Object>> deleteProject(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        projectService.deleteProject(projectId, requester);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Projet supprimé avec succès");

        return ResponseEntity.ok(response);
    }

    // 5. Récupérer tous les projets d'une organisation
    @GetMapping("/organizations/{organizationId}/projects")
    public ResponseEntity<Map<String, Object>> getProjectsByOrganization(
            @PathVariable Long organizationId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        List<Project> projects = projectService.getProjectsByOrganization(organizationId, requester);

        List<ResponseProjectDTO> projectDTOs = projects.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Projets récupérés avec succès");
        response.put("projects", projectDTOs);

        return ResponseEntity.ok(response);
    }

    // Méthode utilitaire pour mapper un Project vers ResponseProjectDTO
    private ResponseProjectDTO mapToResponseDTO(Project project) {
        return ResponseProjectDTO.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .organizationName(project.getOrganization() != null ? project.getOrganization().getName() : null)
                .createdByName(project.getCreatedBy() != null ? project.getCreatedBy().getUser().getUsername() : null)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .members(project.getProjectMemberships().stream()
                        .map(pm -> ProjectMemberDTO.builder()
                                .memberId(pm.getMembership().getId())
                                .username(pm.getMembership().getUser().getUsername())
                                .role(pm.getRoleInProject().name())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}

/*
Voila les endpoints de la classe ProjectController :
1. POST /api/projects/organizations/{organizationId}/projects - Créer un projet
2. GET /api/projects/{projectId} - Récupérer un projet par son ID
3. PUT /api/projects/{projectId} - Mettre à jour un projet
4. DELETE /api/projects/{projectId} - Supprimer un projet
5. GET /api/projects/organizations/{organizationId}/projects - Récupérer tous les projets d'une organisation

 */