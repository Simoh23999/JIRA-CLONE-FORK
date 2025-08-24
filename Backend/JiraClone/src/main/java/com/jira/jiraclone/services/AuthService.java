package com.jira.jiraclone.services;

import com.jira.jiraclone.dtos.AuthRequest;
import com.jira.jiraclone.dtos.AuthResponse;
import com.jira.jiraclone.dtos.RefreshTokenRequest;
import com.jira.jiraclone.dtos.RegisterRequest;
import com.jira.jiraclone.entities.RefreshToken;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.UserRole;
import com.jira.jiraclone.services.RefreshTokenService;
import com.jira.jiraclone.repositories.UserRepository;
import com.jira.jiraclone.repositories.RoleRepository;
import com.jira.jiraclone.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository userRoleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, RoleRepository userRoleRepository,
                       BCryptPasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
                       RefreshTokenService refreshTokenService,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
    }

    public ResponseEntity<AuthResponse> register(RegisterRequest request) {
        try {
            // Vérification de l'email
            if (userRepository.existsByEmail(request.getEmail())) {
                AuthResponse response = AuthResponse.builder()
                        .token(null)
                        .message("Email already exists")
                        .success(false)
                        .build();
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }

            // Création ou récupération du rôle MEMBER
            UserRole memberRole = userRoleRepository.findByRoleName("ROLE_MEMBER");
            if (memberRole == null) {
                UserRole newRole = new UserRole();
                newRole.setRoleName("ROLE_MEMBER");
                memberRole = userRoleRepository.save(newRole);
            }

            // Création de l'utilisateur
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRoles(Collections.singletonList(memberRole));
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            userRepository.save(user);

            AuthResponse response = AuthResponse.builder()
                    .token(null)
                    .message("User registered successfully")
                    .success(true)
                    .build();
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            AuthResponse response = AuthResponse.builder()
                    .token(null)
                    .message("Registration failed: " + e.getMessage())
                    .success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public ResponseEntity<AuthResponse> authenticate(AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            if (authentication.isAuthenticated()) {
                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(userPrincipal.getEmail());
                String token = jwtService.generateToken(userPrincipal);

                AuthResponse response = AuthResponse.builder()
                        .token(token)
                        .refreshToken(refreshToken.getToken())
                        .message("Login successful")
                        .success(true)
                        .build();
                return ResponseEntity.ok(response);
            } else {
                AuthResponse response = AuthResponse.builder()
                        .token(null)
                        .refreshToken(null)
                        .message("Authentication failed")
                        .success(false)
                        .build();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (BadCredentialsException e) {
            AuthResponse response = AuthResponse.builder()
                    .token(null)
                    .refreshToken(null)
                    .message("Invalid email or password")
                    .success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (AuthenticationException e) {
            AuthResponse response = AuthResponse.builder()
                    .token(null)
                    .refreshToken(null)
                    .message("Authentication failed: " + e.getMessage())
                    .success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            AuthResponse response = AuthResponse.builder()
                    .token(null)
                    .refreshToken(null)
                    .message("Login failed: " + e.getMessage())
                    .success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        try {
            String requestRefreshToken = request.getRefreshToken();

            return refreshTokenService.findByToken(requestRefreshToken)
                    .map(refreshTokenService::verifyExpiration)
                    .map(RefreshToken::getUser)
                    .map(user -> {
                        UserPrincipal userPrincipal = new UserPrincipal(user);
                        String newAccessToken = jwtService.generateToken(userPrincipal);

                        return AuthResponse.builder()
                                .token(newAccessToken)
                                .refreshToken(requestRefreshToken) // Garder le même refresh token
                                .message("Token refreshed successfully")
                                .success(true)
                                .build();
                    })
                    .orElseGet(() -> AuthResponse.builder()
                            .token(null)
                            .refreshToken(null)
                            .message("Refresh token is not valid")
                            .success(false)
                            .build());

        } catch (Exception e) {
            return AuthResponse.builder()
                    .token(null)
                    .refreshToken(null)
                    .message("Refresh token error: " + e.getMessage())
                    .success(false)
                    .build();
        }
    }

    // NOUVELLE MÉTHODE : Logout Logic
    public AuthResponse logout(RefreshTokenRequest request) {
        try {
            refreshTokenService.findByToken(request.getRefreshToken())
                    .ifPresent(refreshToken -> {
                        refreshTokenService.deleteByUserEmail(refreshToken.getUser().getEmail());
                    });

            return AuthResponse.builder()
                    .token(null)
                    .refreshToken(null)
                    .message("Logout successful")
                    .success(true)
                    .build();

        } catch (Exception e) {
            return AuthResponse.builder()
                    .token(null)
                    .refreshToken(null)
                    .message("Logout error: " + e.getMessage())
                    .success(false)
                    .build();
        }
    }
}