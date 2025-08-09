package com.jira.jiraclone.controllers;

import com.jira.jiraclone.dtos.ProjectMemberResponseDTO;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.security.UserPrincipal;
import com.jira.jiraclone.services.IntrefacesServices.IProjectMembershipService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000"
})
public class ProjectMembershipController {

    private final IProjectMembershipService projectMembershipService;

    public ProjectMembershipController(IProjectMembershipService projectMembershipService) {
        this.projectMembershipService = projectMembershipService;
    }

    // 1. Ajouter un membre à un projet (rôle par défaut : PROJECT_MEMBER)
    @PostMapping("/{projectId}/members")
    public ResponseEntity<Map<String, Object>> addMemberToProject(
            @PathVariable Long projectId,
            @RequestParam Long membershipId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        projectMembershipService.addMemberToProject(projectId, membershipId, requester);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 201);
        response.put("message", "Membre ajouté avec succès au projet (rôle : PROJECT_MEMBER).");
        return ResponseEntity.status(201).body(response);
    }

    // 2. Supprimer un membre d’un projet
    @DeleteMapping("/members/{projectMembershipId}")
    public ResponseEntity<Map<String, Object>> removeMemberFromProject(
            @PathVariable Long projectMembershipId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        projectMembershipService.removeMemberFromProject(projectMembershipId, requester);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Membre supprimé du projet avec succès.");
        return ResponseEntity.ok(response);
    }

    // 3. Modifier le rôle d’un membre dans un projet
    @PutMapping("/members/{projectMembershipId}/role")
    public ResponseEntity<Map<String, Object>> updateMemberRole(
            @PathVariable Long projectMembershipId,
            @RequestParam("newRole") String newRole, // le front peut envoyer une string "PROJECT_ADMIN" ou autre
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        projectMembershipService.updateProjectMemberRole(projectMembershipId, Enum.valueOf(com.jira.jiraclone.entities.enums.ProjectRole.class, newRole), requester);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Rôle du membre mis à jour avec succès.");
        return ResponseEntity.ok(response);
    }

    // 4. Récupérer tous les membres d’un projet
    @GetMapping("/{projectId}/members")
    public ResponseEntity<Map<String, Object>> getProjectMembers(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        List<ProjectMemberResponseDTO> members = projectMembershipService.getProjectMembers(projectId, requester);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Liste des membres récupérée avec succès.");
        response.put("members", members);
        return ResponseEntity.ok(response);
    }
}
