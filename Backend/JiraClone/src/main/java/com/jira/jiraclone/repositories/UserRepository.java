package com.jira.jiraclone.repositories;

import com.jira.jiraclone.entities.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(@NotBlank(message = "L'email ne peut pas être vide") @Email(message = "Format d'email invalide") String email);

    boolean existsByUsernameAndIdNot(String newUsername, Long id);
}
