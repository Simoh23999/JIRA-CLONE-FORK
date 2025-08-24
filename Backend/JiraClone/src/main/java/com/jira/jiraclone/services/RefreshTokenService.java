package com.jira.jiraclone.services;

import com.jira.jiraclone.entities.RefreshToken;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.exceptions.ConflictException;
import com.jira.jiraclone.exceptions.NotFoundException;
import com.jira.jiraclone.repositories.RefreshTokenRepository;
import com.jira.jiraclone.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    public RefreshToken createRefreshToken(String email){
        User userInfo = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Utilisateur non trouvé"));

        // Delete existing refresh token if it exists
        refreshTokenRepository.findByUser(userInfo)
                .ifPresent(refreshTokenRepository::delete);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(userInfo)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusDays(30)) // Set expiry date to 30 days from now
                .createdAt(LocalDateTime.now())
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken refreshToken) {
        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new ConflictException("Le token de rafraîchissement a expiré");
        }
        return refreshToken;
    }

    @Transactional
    public void deleteByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        refreshTokenRepository.deleteByUser(user);
    }

    @Transactional
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}
