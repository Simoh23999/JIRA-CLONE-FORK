package com.jira.jiraclone.services.ImplServices;

import com.jira.jiraclone.dtos.SprintRequestDTO;
import com.jira.jiraclone.entities.Project;
import com.jira.jiraclone.entities.ProjectMembership;
import com.jira.jiraclone.entities.Sprint;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.enums.SprintStatus;
import com.jira.jiraclone.exceptions.BadRequestException;
import com.jira.jiraclone.exceptions.ConflictException;
import com.jira.jiraclone.exceptions.NotFoundException;
import com.jira.jiraclone.repositories.ProjectMembershipRepository;
import com.jira.jiraclone.repositories.ProjectRepository;
import com.jira.jiraclone.repositories.SprintRepository;
import com.jira.jiraclone.security.UserPrincipal;
import com.jira.jiraclone.services.IntrefacesServices.ISprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SprintServiceImpl implements ISprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMembershipRepository projectMembershipRepository;

    @Override
    public void createSprint(SprintRequestDTO dto) {
        // Validation des dates
        validateSprintDates(dto.getStartDate(), dto.getEndDate());

        // Récupérer le projet
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new NotFoundException("Projet introuvable !"));

        User currentUser = getCurrentUser();

        // Trouver son ProjectMembership
        ProjectMembership createdBy = projectMembershipRepository
                .findByMembershipUserIdAndProjectId(currentUser.getId(), project.getId())
                .orElseThrow(() -> new NotFoundException("L'utilisateur n'est pas membre de ce projet"));


        // Vérifier qu'il n'y a pas déjà un sprint actif dans ce projet
        List<Sprint> activeSprints = sprintRepository.findByProjectIdAndStatus(dto.getProjectId(), SprintStatus.ACTIVE);
        if (!activeSprints.isEmpty()) {
            throw new ConflictException("Il existe déjà un sprint actif dans ce projet");
        }

        // Créer le sprint
        Sprint sprint = Sprint.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .project(project)
                .createdByProjectMembership(createdBy)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus() != null ? dto.getStatus() : SprintStatus.PLANNED)
                .build();

        sprintRepository.save(sprint);
    }

    @Override
    public void updateSprint(Long id, SprintRequestDTO dto) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Sprint introuvable !"));

        // Vérifier que le sprint peut être modifié (pas terminé ou annulé)
        if (sprint.getStatus() == SprintStatus.COMPLETED || sprint.getStatus() == SprintStatus.CANCELLED) {
            throw new ConflictException("Impossible de modifier un sprint terminé ou annulé");
        }

        // Validation des dates
        validateSprintDates(dto.getStartDate(), dto.getEndDate());

        // Si le sprint est actif, on ne peut modifier que certains champs
        if (sprint.getStatus() == SprintStatus.ACTIVE) {
            sprint.setName(dto.getName());
            sprint.setDescription(dto.getDescription());
            sprint.setEndDate(dto.getEndDate()); // On peut étendre la date de fin
        } else {
            // Sprint plannifié - tous les champs peuvent être modifiés
            sprint.setName(dto.getName());
            sprint.setDescription(dto.getDescription());
            sprint.setStartDate(dto.getStartDate());
            sprint.setEndDate(dto.getEndDate());
            if (dto.getStatus() != null) {
                sprint.setStatus(dto.getStatus());
            }
        }

        sprintRepository.save(sprint);
    }

    @Override
    public void startSprint(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new NotFoundException("Sprint introuvable !"));

        // Vérifier l'état actuel
        if (sprint.getStatus() != SprintStatus.PLANNED) {
            throw new ConflictException("Seul un sprint planifié peut être démarré");
        }

        // Vérifier qu'il n'y a pas déjà un sprint actif dans le même projet
        List<Sprint> activeSprints = sprintRepository.findByProjectIdAndStatus(sprint.getProject().getId(), SprintStatus.ACTIVE);
        if (!activeSprints.isEmpty()) {
            throw new ConflictException("Il existe déjà un sprint actif dans ce projet");
        }

        // Vérifier que la date de début est aujourd'hui ou dans le passé
        if (sprint.getStartDate().isAfter(LocalDate.now())) {
            throw new ConflictException("Impossible de démarrer un sprint dont la date de début est dans le futur");
        }

        sprint.setStatus(SprintStatus.ACTIVE);
        sprintRepository.save(sprint);
    }

    @Override
    public void completeSprint(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new NotFoundException("Sprint introuvable !"));

        // Vérifier l'état actuel
        if (sprint.getStatus() != SprintStatus.ACTIVE) {
            throw new ConflictException("Seul un sprint actif peut être terminé");
        }

        sprint.setStatus(SprintStatus.COMPLETED);
        sprintRepository.save(sprint);
    }

    @Override
    public void cancelSprint(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new NotFoundException("Sprint introuvable !"));

        // Vérifier l'état actuel
        if (sprint.getStatus() == SprintStatus.COMPLETED) {
            throw new ConflictException("Impossible d'annuler un sprint déjà terminé");
        }
        if (sprint.getStatus() == SprintStatus.CANCELLED) {
            throw new ConflictException("Le sprint est déjà annulé");
        }

        sprint.setStatus(SprintStatus.CANCELLED);
        sprintRepository.save(sprint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Sprint> getSprintsByProject(Long projectId) {
        // Vérifier que le projet existe
        if (!projectRepository.existsById(projectId)) {
            throw new NotFoundException("Projet introuvable !!");
        }

        return sprintRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    @Override
    @Transactional(readOnly = true)
    public Sprint getSprintById(Long sprintId) {
        return sprintRepository.findById(sprintId)
                .orElseThrow(() -> new NotFoundException("Sprint introuvable !!!" ));
    }

//    validation des dates de début et de fin du sprint
    private void validateSprintDates(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new BadRequestException("Les dates de début et de fin sont requises");
        }

        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("La date de début ne peut pas être après la date de fin");
        }

        if (startDate.equals(endDate)) {
            throw new BadRequestException("La date de début ne peut pas être identique à la date de fin");
        }

        // Vérifier que le sprint ne dépasse pas une durée raisonnable (par exemple 4 semaines)
        long duration = ChronoUnit.DAYS.between(startDate, endDate);
        if (duration > 28) { // 4 semaines
            throw new BadRequestException("La durée du sprint ne peut pas dépasser 4 semaines");
        }

        if (duration < 1) {
            throw new BadRequestException("La durée minimale d'un sprint est d'1 jour");
        }
    }

    private User getCurrentUser() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = principal.getUser();
        if ( user != null) {
            return user;

        }
        return null;
    }
}