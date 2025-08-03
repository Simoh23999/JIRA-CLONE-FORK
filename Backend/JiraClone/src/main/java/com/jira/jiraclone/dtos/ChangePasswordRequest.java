package com.jira.jiraclone.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Valid
public class ChangePasswordRequest {

        @NotBlank(message = "Le mot de passe actuel est requis")
        private String currentPassword;

        @NotBlank(message = "Le nouveau mot de passe est requis")
        @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$",
                message = "Le mot de passe doit contenir au moins une majuscule, une minuscule et un caractère spécial"
        )
        private String newPassword;

        @NotBlank(message = "La confirmation est requise")
        private String confirmPassword;

        @AssertTrue(message = "Les mots de passe ne correspondent pas")
        public boolean isPasswordsMatching() {
            return newPassword != null && newPassword.equals(confirmPassword);
        }
    }


