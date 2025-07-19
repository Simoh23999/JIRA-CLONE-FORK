package com.jira.jiraclone.controllers;

import com.jira.jiraclone.dtos.AddMemberRequest;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.security.UserPrincipal;
import com.jira.jiraclone.services.IntrefacesServices.IMembershipService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/memberships")
@CrossOrigin(origins ="http://localhost:3000, http://127.0.0.1:3000")
public class MembershipController {

    private IMembershipService membershipService;
    public MembershipController(IMembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @PostMapping("/add")
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
}
