package com.jira.jiraclone.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Valid
@Data
public class DeleteProfileRequest {

        @NotBlank(message = "Le mot de passe est requis pour supprimer le profil")
        private String password;
}
