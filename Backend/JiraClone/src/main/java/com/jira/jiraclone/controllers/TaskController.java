// src/main/java/com/jira/jiraclone/controllers/TaskController.java
package com.jira.jiraclone.controllers;

import com.jira.jiraclone.dtos.TaskRequestDto;
import com.jira.jiraclone.dtos.TaskResponseDto;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.enums.TaskStatus;
import com.jira.jiraclone.security.UserPrincipal;
import com.jira.jiraclone.services.IntrefacesServices.ITaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000"
})
public class TaskController {

    private final ITaskService taskService;

    public TaskController(ITaskService taskService) {
        this.taskService = taskService;
    }

    // 1. Créer une tâche (PROJECT_OWNER)
    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponseDto> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        TaskResponseDto created = taskService.createTask(projectId, dto, requester);
        return ResponseEntity.status(201).body(created);
    }

    // 2. Assigner une tâche (PROJECT_OWNER)
    @PostMapping("/tasks/{taskId}/assign")
    public ResponseEntity<Void> assignTask(
            @PathVariable Long taskId,
            @RequestParam Long assigneeProjectMembershipId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        taskService.assignTask(taskId, assigneeProjectMembershipId, requester);
        return ResponseEntity.ok().build();
    }

    // 3. Changer le statut (seul l'assignee)
    @PutMapping("/tasks/{taskId}/status")
    public ResponseEntity<TaskResponseDto> updateStatus(
            @PathVariable Long taskId,
            @RequestParam TaskStatus newStatus,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        TaskResponseDto updated = taskService.updateTaskStatus(taskId, newStatus, requester);
        return ResponseEntity.ok(updated);
    }

    // 4. Récupérer une tâche
    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponseDto> getTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        TaskResponseDto dto = taskService.getTaskById(taskId, requester);
        return ResponseEntity.ok(dto);
    }

    // 5. Lister les tâches d'un projet
    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponseDto>> getTasksByProject(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        List<TaskResponseDto> list = taskService.getTasksByProject(projectId, requester);
        return ResponseEntity.ok(list);
    }

    // 5. Lister les tâches d'un projet
    @GetMapping("/projects/{projectId}/sprintActif")
    public ResponseEntity<List<TaskResponseDto>> getTasksByProjectSprintActif(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        List<TaskResponseDto> list = taskService.findBySprintStatusActif(projectId, requester);
        return ResponseEntity.ok(list);
    }


    // 6. Mettre à jour une tâche (PROJECT_OWNER uniquement)
    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponseDto> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        TaskResponseDto updated = taskService.updateTask(taskId, dto, requester);
        return ResponseEntity.ok(updated);
    }

    // 7. Supprimer une tâche (PROJECT_OWNER uniquement)
    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User requester = userPrincipal.getUser();
        taskService.deleteTask(taskId, requester);
        return ResponseEntity.noContent().build();
    }
}
