package com.jira.jiraclone.controllers;

import com.jira.jiraclone.security.UserPrincipal;
import com.jira.jiraclone.services.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final JwtService jwtService;

    public TestController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    /**
     * Endpoint public - Aucune authentification requise
     */
    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> publicEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Ceci est un endpoint public - Aucune authentification requise");
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint protégé - Authentification requise
     */
    @GetMapping("/protected")
    public ResponseEntity<Map<String, Object>> protectedEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Endpoint protégé - Authentification réussie");
        response.put("username", userPrincipal.getUsername());
        response.put("email", userPrincipal.getEmail());
        response.put("roles", userPrincipal.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .toList());
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint pour les membres seulement
     */
    @GetMapping("/member")
    @PreAuthorize("hasRole('ROLE_MEMBER')")
    public ResponseEntity<Map<String, Object>> memberEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Endpoint MEMBER - Accès autorisé pour les membres");
        response.put("username", userPrincipal.getUsername());
        response.put("email", userPrincipal.getEmail());
        response.put("roles", userPrincipal.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .toList());
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint pour les admins seulement
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> adminEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Endpoint ADMIN - Accès autorisé pour les administrateurs");
        response.put("username", userPrincipal.getUsername());
        response.put("email", userPrincipal.getEmail());
        response.put("roles", userPrincipal.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .toList());
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint pour décoder et afficher le contenu du token JWT
     */
    @GetMapping("/token-info")
    public ResponseEntity<Map<String, Object>> tokenInfo(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                String email = jwtService.extractEmail(token);
                String username = jwtService.extractUsername(token);
                String roles = jwtService.extractRoles(token);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Informations du token JWT");
                response.put("email", email);
                response.put("username", username);
                response.put("roles", roles);
                response.put("timestamp", System.currentTimeMillis());
                response.put("status", "success");
                return ResponseEntity.ok(response);

            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Erreur lors du décodage du token");
                response.put("error", e.getMessage());
                response.put("timestamp", System.currentTimeMillis());
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Token manquant dans l'en-tête Authorization");
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "error");
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Endpoint pour tester les permissions multiples
     */
    @GetMapping("/multi-role")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEMBER')")
    public ResponseEntity<Map<String, Object>> multiRoleEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Endpoint MULTI-ROLE - Accès autorisé pour ADMIN ou MEMBER");
        response.put("username", userPrincipal.getUsername());
        response.put("email", userPrincipal.getEmail());
        response.put("roles", userPrincipal.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .toList());
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint pour obtenir le profil utilisateur connecté
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profil utilisateur connecté");
        response.put("username", userPrincipal.getUsername());
        response.put("email", userPrincipal.getEmail());
        response.put("roles", userPrincipal.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .toList());
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }
}