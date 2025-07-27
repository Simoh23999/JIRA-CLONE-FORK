package com.jira.jiraclone.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrganizationDto {
    @NotBlank(message = "Le Nom de l'organisation ne peut pas être vide")
    private String name;
    @NotBlank(message = "La description de l'organisation ne peut pas être vide")
    @Size(max = 500)
    private String description;
}
