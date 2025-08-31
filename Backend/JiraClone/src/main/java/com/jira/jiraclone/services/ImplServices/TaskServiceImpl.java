// src/main/java/com/jira/jiraclone/services/ImplServices/TaskServiceImpl.java
package com.jira.jiraclone.services.ImplServices;

import com.jira.jiraclone.dtos.TaskRequestDto;
import com.jira.jiraclone.dtos.TaskResponseDto;
import com.jira.jiraclone.entities.*;
import com.jira.jiraclone.entities.enums.ProjectRole;
import com.jira.jiraclone.entities.enums.SprintStatus;
import com.jira.jiraclone.entities.enums.TaskStatus;
import com.jira.jiraclone.exceptions.NotFoundException;
import com.jira.jiraclone.exceptions.UnauthorizedException;
import com.jira.jiraclone.repositories.*;
import com.jira.jiraclone.services.IntrefacesServices.ITaskService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements ITaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;
    private final MembershipRepository membershipRepository;
    private final ProjectMembershipRepository projectMembershipRepository;

    public TaskServiceImpl(TaskRepository taskRepository,
                           ProjectRepository projectRepository,
                           SprintRepository sprintRepository,
                           MembershipRepository membershipRepository,
                           ProjectMembershipRepository projectMembershipRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.sprintRepository = sprintRepository;
        this.membershipRepository = membershipRepository;
        this.projectMembershipRepository = projectMembershipRepository;
    }

    // Mapper entité -> DTO
    private TaskResponseDto toDto(Task t) {
        return TaskResponseDto.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .projectId(t.getProject() != null ? t.getProject().getId() : null)
                .sprintId(t.getSprint() != null ? t.getSprint().getId() : null)
                .createdByProjectMembershipId(t.getCreatedBy() != null ? t.getCreatedBy().getId() : null)
                .assignedToProjectMembershipId(t.getAssignedTo() != null ? t.getAssignedTo().getId() : null)
                .assignedByProjectMembershipId(t.getAssignedBy() != null ? t.getAssignedBy().getId() : null)
                .status(t.getStatus())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }

    /*
     * createTask :
     * - seul le PROJECT_OWNER (dans le projet) peut créer une tâche
     * - sprintId est optionnel (si fourni, vérifier que le sprint appartient au projet)
     */
    @Override
    @Transactional
    public TaskResponseDto createTask(Long projectId, TaskRequestDto dto, User requester) {
        // 1. projet existe ?
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Projet introuvable."));

        // 2. requester membre de l'organisation ?
        Membership requesterMembershipInOrg = membershipRepository
                .findByUserAndOrganization(requester, project.getOrganization())
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de l'organisation du projet."));

        // 3. requester membre du projet et ROLE PROJECT_OWNER ?
        ProjectMembership requesterPM = projectMembershipRepository
                .findByProjectAndMembership(project, requesterMembershipInOrg)
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de ce projet."));

        if (requesterPM.getRoleInProject() != ProjectRole.PROJECT_OWNER) {
            throw new UnauthorizedException("Seul le PROJECT_OWNER peut créer une tâche.");
        }

        // 4. Si sprintId fourni, vérifier qu'il existe et appartient au même projet
        Sprint sprint = null;
        if (dto.getSprintId() != null) {
            sprint = sprintRepository.findById(dto.getSprintId())
                    .orElseThrow(() -> new NotFoundException("Sprint introuvable."));
            if (!sprint.getProject().getId().equals(project.getId())) {
                throw new UnauthorizedException("Le sprint ne fait pas partie de ce projet.");
            }
        }

        // 5. Création
        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .project(project)
                .sprint(sprint)
                .createdBy(requesterPM)
                .status(TaskStatus.TODO)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Task saved = taskRepository.save(task);
        return toDto(saved);
    }

    /*
     * assignTask :
     * - Seul PROJECT_OWNER du projet peut assigner
     * - L'assignee doit être un ProjectMembership du même projet et avoir rôle PROJECT_MEMBER
     */
    @Override
    @Transactional
    public void assignTask(Long taskId, Long assigneeProjectMembershipId, User requester) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Tâche introuvable."));

        Project project = task.getProject();

        // vérifier requester est PROJECT_OWNER
        Membership requesterMembershipInOrg = membershipRepository.findByUserAndOrganization(requester, project.getOrganization())
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de l'organisation."));
        ProjectMembership requesterPM = projectMembershipRepository
                .findByProjectAndMembership(project, requesterMembershipInOrg)
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre du projet."));
        if (requesterPM.getRoleInProject() != ProjectRole.PROJECT_OWNER) {
            throw new UnauthorizedException("Seul le PROJECT_OWNER peut assigner une tâche.");
        }

        // vérifier assignee existe
        ProjectMembership assigneePM = projectMembershipRepository.findById(assigneeProjectMembershipId)
                .orElseThrow(() -> new NotFoundException("ProjectMembership à assigner introuvable."));

        // même projet ?
        if (!assigneePM.getProject().getId().equals(project.getId())) {
            throw new UnauthorizedException("Le membre à assigner n'appartient pas à ce projet.");
        }

        // doit être PROJECT_MEMBER (pas OWNER)
        if (assigneePM.getRoleInProject() != ProjectRole.PROJECT_MEMBER) {
            throw new UnauthorizedException("Seul un PROJECT_MEMBER peut recevoir une tâche.");
        }

        // assigner
        task.setAssignedTo(assigneePM);
        task.setAssignedBy(requesterPM);
        task.setUpdatedAt(LocalDateTime.now());
        taskRepository.save(task);
    }

    /*
     * updateTaskStatus :
     * - Seul l'assignee (ProjectMembership) peut changer le statut de SA tâche
     * - MAIS : PROJECT_OWNER peut aussi forcer le changement (règle métier étendue)
     */
    @Override
    @Transactional
    public TaskResponseDto updateTaskStatus(Long taskId, TaskStatus newStatus, User requester) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Tâche introuvable."));

        Project project = task.getProject();

        // vérifier membership org
        Membership requesterMembershipInOrg = membershipRepository.findByUserAndOrganization(requester, project.getOrganization())
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de l'organisation."));

        ProjectMembership requesterPM = projectMembershipRepository
                .findByProjectAndMembership(project, requesterMembershipInOrg)
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre du projet."));

        ProjectMembership assignee = task.getAssignedTo();

        // 1. cas normal : c'est l'assignee qui change son statut
        boolean isAssignee = assignee != null && requesterPM.getId().equals(assignee.getId());

        // 2. cas spécial : le PROJECT_OWNER force le statut
        boolean isOwner = requesterPM.getRoleInProject() == ProjectRole.PROJECT_OWNER;

        if (!isAssignee && !isOwner) {
            throw new UnauthorizedException("Vous ne pouvez changer que vos tâches assignées (sauf si vous êtes PROJECT_OWNER).");
        }

        task.setStatus(newStatus);
        task.setUpdatedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);
        return toDto(saved);
    }

    /*
     * getTaskById :
     * - vérifie que requester appartient à l'organisation et au projet (membre du projet)
     */
    @Override
    public TaskResponseDto getTaskById(Long taskId, User requester) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Tâche introuvable."));

        Project project = task.getProject();

        // vérifier membership org
        Membership m = membershipRepository.findByUserAndOrganization(requester, project.getOrganization())
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de l'organisation."));

        // vérifier membre du projet
        projectMembershipRepository.findByProjectAndMembership(project, m)
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre du projet."));

        return toDto(task);
    }

    /*
     * getTasksByProject :
     * - retourne toutes les tâches du projet si requester est membre du projet
     */
    @Override
    public List<TaskResponseDto> getTasksByProject(Long projectId, User requester) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Projet introuvable."));

        Membership m = membershipRepository.findByUserAndOrganization(requester, project.getOrganization())
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de l'organisation."));

        projectMembershipRepository.findByProjectAndMembership(project, m)
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre du projet."));

        return taskRepository.findByProject(project).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    /*
     * updateTask :
     * - Seul le PROJECT_OWNER peut mettre à jour une tâche
     * - Peut modifier titre, description, sprint, etc.
     */
    @Override
    @Transactional
    public TaskResponseDto updateTask(Long taskId, TaskRequestDto dto, User requester) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Tâche introuvable."));

        Project project = task.getProject();

        // vérifier que requester est OWNER
        Membership requesterMembershipInOrg = membershipRepository
                .findByUserAndOrganization(requester, project.getOrganization())
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de l'organisation."));

        ProjectMembership requesterPM = projectMembershipRepository
                .findByProjectAndMembership(project, requesterMembershipInOrg)
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre du projet."));

        if (requesterPM.getRoleInProject() != ProjectRole.PROJECT_OWNER) {
            throw new UnauthorizedException("Seul le PROJECT_OWNER peut mettre à jour une tâche.");
        }

        // mise à jour des champs
        if (dto.getTitle() != null) task.setTitle(dto.getTitle());
        if (dto.getDescription() != null) task.setDescription(dto.getDescription());

        if (dto.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(dto.getSprintId())
                    .orElseThrow(() -> new NotFoundException("Sprint introuvable."));
            if (!sprint.getProject().getId().equals(project.getId())) {
                throw new UnauthorizedException("Le sprint ne fait pas partie de ce projet.");
            }
            task.setSprint(sprint);
        }

        task.setUpdatedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);
        return toDto(saved);
    }

    /*
     * deleteTask :
     * - Seul le PROJECT_OWNER peut supprimer une tâche
     */
    @Override
    @Transactional
    public void deleteTask(Long taskId, User requester) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Tâche introuvable."));

        Project project = task.getProject();

        // vérifier que requester est OWNER
        Membership requesterMembershipInOrg = membershipRepository
                .findByUserAndOrganization(requester, project.getOrganization())
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de l'organisation."));

        ProjectMembership requesterPM = projectMembershipRepository
                .findByProjectAndMembership(project, requesterMembershipInOrg)
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre du projet."));

        if (requesterPM.getRoleInProject() != ProjectRole.PROJECT_OWNER) {
            throw new UnauthorizedException("Seul le PROJECT_OWNER peut supprimer une tâche.");
        }

        taskRepository.delete(task);
    }

    @Override
    public List<TaskResponseDto> findBySprintStatusActif(Long projectId, User requester) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Projet introuvable."));

        List<Sprint> sprints=sprintRepository.findByProjectIdAndStatus(projectId, SprintStatus.ACTIVE);

        if (sprints.isEmpty()) {
            throw new NotFoundException("Aucun sprint actif trouvé pour ce projet.");
        }

        Membership m = membershipRepository.findByUserAndOrganization(requester, project.getOrganization())
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de l'organisation."));

        projectMembershipRepository.findByProjectAndMembership(project, m)
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre du projet."));

        return taskRepository.findBySprintIn(sprints).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

}
