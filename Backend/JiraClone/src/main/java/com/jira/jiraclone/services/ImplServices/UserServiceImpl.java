package com.jira.jiraclone.services.ImplServices;

import com.jira.jiraclone.dtos.MyOrganizationDto;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.exceptions.ConflictException;
import com.jira.jiraclone.exceptions.InvalidPasswordException;
import com.jira.jiraclone.exceptions.NotFoundException;
import com.jira.jiraclone.repositories.MembershipRepository;
import com.jira.jiraclone.repositories.OrganizationRepository;
import com.jira.jiraclone.repositories.UserRepository;
import com.jira.jiraclone.security.UserPrincipal;
import com.jira.jiraclone.services.IntrefacesServices.IUserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrganizationRepository organizationRepository;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           OrganizationRepository organizationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.organizationRepository = organizationRepository;
    }
    @Override
    public void updateUsername(String newUsername) {

            User currentUser = getCurrentAuthenticatedUser();

            // Vérifier que le username n'est pas déjà pris
            if (userRepository.existsByUsernameAndIdNot(newUsername, currentUser.getId())) {
                throw new ConflictException("Ce nom d'utilisateur est déjà utilisé");
            }

            currentUser.setUsername(newUsername);
            currentUser.setUpdatedAt(LocalDateTime.now());
            userRepository.save(currentUser);
        }


    @Override
    public void updatePassword(String currentPassword, String newPassword) {
        User currentUser = getCurrentAuthenticatedUser();

        // Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(currentPassword, currentUser.getPassword())) {
            throw new InvalidPasswordException("Mot de passe actuel incorrect");
        }

        // Vérifier que le nouveau mot de passe est différent
        if (passwordEncoder.matches(newPassword, currentUser.getPassword())) {
            throw new ConflictException("Le nouveau mot de passe doit être différent de l'ancien");
        }

        currentUser.setPassword(passwordEncoder.encode(newPassword));
        currentUser.setUpdatedAt(LocalDateTime.now());
        userRepository.save(currentUser);
    }

    @Override
    public void deleteProfile(String password) {

    }

    @Override
    public List<MyOrganizationDto> getMyOrganizations() {
        User userPrincipal = getCurrentAuthenticatedUser();
        String email = userPrincipal.getEmail();
        return organizationRepository.findMyOrganizationsByUserEmail(email);
    }

    private User getCurrentAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();

        return userRepository.findByEmail(userPrincipal.getEmail())
                .orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
    }
}
