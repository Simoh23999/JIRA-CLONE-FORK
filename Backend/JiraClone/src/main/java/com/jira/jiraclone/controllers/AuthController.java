package com.jira.jiraclone.controllers;


import com.jira.jiraclone.dtos.AuthRequest;
import com.jira.jiraclone.dtos.AuthResponse;
import com.jira.jiraclone.dtos.RefreshTokenRequest;
import com.jira.jiraclone.dtos.RegisterRequest;
import com.jira.jiraclone.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins ="http://localhost:3000, http://127.0.0.1:3000")
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

    // Endpoint to refresh the JWT token
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    // Endpoint to logout and invalidate the refresh token
    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(@RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.logout(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}


