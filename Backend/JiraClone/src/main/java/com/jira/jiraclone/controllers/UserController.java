package com.jira.jiraclone.controllers;

import com.jira.jiraclone.dtos.ChangePasswordRequest;
import com.jira.jiraclone.dtos.DeleteProfileRequest;
import com.jira.jiraclone.dtos.MyOrganizationDto;
import com.jira.jiraclone.dtos.UpdateUsernameRequest;
import com.jira.jiraclone.services.IntrefacesServices.IUserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/me")
@Validated
public class UserController {

    private final IUserService userService;

    public UserController(IUserService userService){
        this.userService = userService;
    }

    @PutMapping()
    public ResponseEntity<Map<String,Object>> updateUsername(@Valid @RequestBody UpdateUsernameRequest request) {
        userService.updateUsername(request.getUsername());
        Map<String,Object> response = Map.of(
                "status", 200,
                "message", "Nom d'utilisateur mis à jour avec succès"
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
            userService.updatePassword(request.getCurrentPassword(), request.getNewPassword());

        return ResponseEntity.ok(Map.of("message", "Mot de passe mis à jour avec succès"));
    }

    @DeleteMapping()
    public ResponseEntity<Map<String, String>> deleteProfile(
            @Valid @RequestBody DeleteProfileRequest request) {
        userService.deleteProfile(request.getPassword());

        return ResponseEntity.ok(Map.of("message", "Profil supprimé avec succès"));
    }

    @GetMapping("/organizations")
    public ResponseEntity<List<MyOrganizationDto>> getMyOrganizations() {
        List<MyOrganizationDto> organizations = userService.getMyOrganizations();
        return ResponseEntity.ok(organizations);
    }

}
