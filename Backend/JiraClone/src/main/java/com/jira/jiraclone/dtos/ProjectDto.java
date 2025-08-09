package com.jira.jiraclone.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProjectDto {
    @NotBlank(message = "Le nom du projet est obligatoire.")
    @Size(min = 3, max = 100, message = "Le nom doit contenir entre 3 et 100 caractères.")
    private String name;

    @Size(max = 500, message = "La description ne doit pas dépasser 500 caractères.")
    private String description;
}
