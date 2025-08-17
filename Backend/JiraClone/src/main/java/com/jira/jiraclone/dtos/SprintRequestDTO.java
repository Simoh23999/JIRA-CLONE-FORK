package com.jira.jiraclone.dtos;

import com.jira.jiraclone.entities.enums.SprintStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SprintRequestDTO {
    @NotBlank(message = "Le nom du sprint est requis")
    private String name;


    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    private String description;

    @NotNull(message = "L'ID du projet est requis")
    private Long projectId;
//
//    @NotNull(message = "L'ID de l'appartenance au projet du créateur est requis")
//    private Long createdByProjectMembershipId;

    @NotNull(message = "La date de début est requise")
    @FutureOrPresent(message = "La date de début ne peut pas être dans le passé")
    private LocalDate startDate;

    @NotNull(message = "La date de fin est requise")
    @Future(message = "La date de fin doit être dans le futur")
    private LocalDate endDate;

    private SprintStatus status; // Optional: defaults to PLANNED in @PrePersist
}
