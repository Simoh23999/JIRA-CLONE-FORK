package com.jira.jiraclone.controllers;


import com.jira.jiraclone.dtos.AuthRequest;
import com.jira.jiraclone.dtos.AuthResponse;
import com.jira.jiraclone.dtos.RegisterRequest;
import com.jira.jiraclone.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins ="http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return authService.register(request);

    }
    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return authService.authenticate(request);
    }
}


