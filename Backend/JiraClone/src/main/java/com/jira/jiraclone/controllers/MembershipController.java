package com.jira.jiraclone.controllers;

import com.jira.jiraclone.dtos.AddMemberRequest;
import com.jira.jiraclone.dtos.MembershipResponse;
import com.jira.jiraclone.dtos.UpdateMemberRoleRequest;
import com.jira.jiraclone.entities.Membership;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.enums.RoleInOrganization;
import com.jira.jiraclone.security.UserPrincipal;
import com.jira.jiraclone.services.IntrefacesServices.IMembershipService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000"
})
public class MembershipController {

    private IMembershipService membershipService;
    public MembershipController(IMembershipService membershipService) {
        this.membershipService = membershipService;
    }
    //1. route pour ajouter un membre à une organisation
    @PostMapping("/memberships/add")
    public ResponseEntity<Map<String,Object>>addMembership(
            @RequestBody AddMemberRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
            ){
        User user = userPrincipal.getUser();
        membershipService.addMemberToOrganization(
                request.getOrganizationId(),
                request.getEmail(),
                request.getRole(),
                user
        );
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Membre ajouté avec succès");

        return ResponseEntity.ok().body(response);
    }

    //2. route pour supprimer un membre d'une organisation
    @DeleteMapping("/organizations/{organizationId}/members/{targetUserId}")
    public ResponseEntity<Map<String, Object>> removeMembership(
            @PathVariable Long organizationId,
            @PathVariable Long targetUserId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();

        membershipService.removeMemberFromOrganization(organizationId, targetUserId, requester);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Membre supprimé avec succès");

        return ResponseEntity.ok().body(response);
    }
    //3. route pour mettre à jour le rôle d'un membre dans une organisation
    @PutMapping("/organizations/{organizationId}/members/{targetUserId}/role")
    public ResponseEntity<Map<String, Object>> updateMemberRole(
            @PathVariable Long organizationId,
            @PathVariable Long targetUserId,
            @RequestBody UpdateMemberRoleRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();

        RoleInOrganization newRole = request.getNewRole();
        if (newRole == null) {
            throw new IllegalArgumentException("Le rôle est requis.");
        }

        membershipService.updateMemberRole(organizationId, targetUserId, newRole, requester);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Rôle mis à jour avec succès");

        return ResponseEntity.ok().body(response);
    }

    //4. route pour récupérer tous les membres d'une organisation
    @GetMapping("/organizations/{organizationId}/members")
    public ResponseEntity<Map<String, Object>> getMembersByOrganization(
            @PathVariable Long organizationId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();

        // Appel au service
        List<Membership> memberships = membershipService.getMembersByOrganization(organizationId, requester);

        // Mapping vers DTO
        List<MembershipResponse> memberDTOs = memberships.stream().map(m -> {
            User user = m.getUser();
            return new MembershipResponse(
                    user.getId(),
                    m.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    m.getRoleInOrganisation()
            );
        }).toList();

        // Construction de la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("members", memberDTOs);
        response.put("count", memberDTOs.size());

        return ResponseEntity.ok().body(response);
    }

}
