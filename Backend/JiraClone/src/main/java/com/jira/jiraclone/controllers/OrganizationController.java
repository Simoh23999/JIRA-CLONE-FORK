// src/main/java/com/jira/jiraclone/controllers/OrganizationController.java
package com.jira.jiraclone.controllers;

import com.jira.jiraclone.dtos.OrganizationDto;
import com.jira.jiraclone.dtos.OrganizationResponseDto;
import com.jira.jiraclone.entities.Organization;
import com.jira.jiraclone.security.UserPrincipal;
import com.jira.jiraclone.services.IntrefacesServices.IOrganizationService;
import com.jira.jiraclone.services.OrganizationSecurityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins ="http://localhost:3000, http://127.0.0.1:3000")
@RequestMapping("/organizations")
public class OrganizationController {

    private final IOrganizationService organizationService;
    private final OrganizationSecurityService organizationSecurityService;

    public OrganizationController(IOrganizationService organizationService,
                                  OrganizationSecurityService organizationSecurityService) {
        this.organizationService = organizationService;
        this.organizationSecurityService = organizationSecurityService;
    }

    // GET /organizations/{id}
    @GetMapping("/{id}")
    @PreAuthorize("@organizationSecurityService.canViewOrganization(#id,authentication)")
    public ResponseEntity<OrganizationResponseDto> getOrganizationById(@PathVariable Long id) {
        OrganizationResponseDto org = organizationService.getOrganizationById(id);
        return ResponseEntity.ok(org);
    }

    // POST /organizations
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrganization(@Valid @RequestBody OrganizationDto organizationDto,
                                                                  @AuthenticationPrincipal UserPrincipal userPrincipal){
        organizationService.createOrganization(organizationDto, userPrincipal);
        Map<String, Object> response = new HashMap<>();
        response.put("status", 201);
        response.put("message", "Organisation créée avec succès");
        return ResponseEntity.status(201).body(response);
    }

    // PUT /organizations/{id}
    @PutMapping("/{id}")
    @PreAuthorize("@organizationSecurityService.canEditAndDeleteOrganization(#id,authentication)")
    public ResponseEntity<Map<String, Object>> updateOrganization(
            @PathVariable Long id,
            @Valid @RequestBody OrganizationDto organizationDto) {
        organizationService.updateOrganization(id, organizationDto);
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Organisation mise à jour");
        return ResponseEntity.ok(response);
    }

    // DELETE /organizations/{id}
    @DeleteMapping("/{id}")
//    @PreAuthorize("@organizationSecurityService.canEditAndDeleteOrganization(#id,authentication)")
    public ResponseEntity<Map<String, Object>> deleteOrganization(@PathVariable Long id) {
        organizationService.deleteOrganization(id);
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Organisation supprimée");
        return ResponseEntity.ok(response);
    }
}