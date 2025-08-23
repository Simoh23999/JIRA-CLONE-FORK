package com.jira.jiraclone.controllers;

import com.jira.jiraclone.dtos.SprintRequestDTO;
import com.jira.jiraclone.entities.Sprint;
import com.jira.jiraclone.services.IntrefacesServices.ISprintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000"
})
@RequiredArgsConstructor
public class SprintController {

    private final ISprintService sprintService;
//    creeation de sprint (seul PROJECT_OWNER peut créer un sprint)
    @PostMapping
    @PreAuthorize("@sprintSecurityService.canCreateSprint(#dto.projectId)")
    public ResponseEntity<Sprint> createSprint(@Valid @RequestBody SprintRequestDTO dto) {
        Sprint createdSprint = sprintService.createSprint(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createdSprint);
    }

// modifier un spriny (seul PROJECT_OWNER peut le mpdfier)
    @PutMapping("/{sprintId}")
    @PreAuthorize("@sprintSecurityService.canUpdateSprint(#sprintId)")
    public ResponseEntity<String> updateSprint(
            @PathVariable Long sprintId,
            @Valid @RequestBody SprintRequestDTO dto) {
        sprintService.updateSprint(sprintId, dto);
        return ResponseEntity.ok("Sprint mis à jour avec succès");
    }

// demarrer un sprint par le PROJECT_OWNER
    @PatchMapping("/{sprintId}/start")
    @PreAuthorize("@sprintSecurityService.canStartSprint(#sprintId )")
    public ResponseEntity<String> startSprint(@PathVariable Long sprintId) {
        sprintService.startSprint(sprintId);
        return ResponseEntity.ok("Sprint démarré avec succès");
    }

//   completer un sprint - Seul PROJECT_OWNER peut completer
    @PatchMapping("/{sprintId}/complete")
    @PreAuthorize("@sprintSecurityService.canCompleteSprint(#sprintId)")
    public ResponseEntity<String> completeSprint(@PathVariable Long sprintId) {
        sprintService.completeSprint(sprintId);
        return ResponseEntity.ok("Sprint terminé avec succès");
    }

//  canceler un sprint par le PROJECT_OWNER
    @PatchMapping("/{sprintId}/cancel")
    @PreAuthorize("@sprintSecurityService.canCancelSprint(#sprintId)")
    public ResponseEntity<String> cancelSprint(@PathVariable Long sprintId) {
        sprintService.cancelSprint(sprintId);
        return ResponseEntity.ok("Sprint annulé avec succès");
    }

//  voir tous les sprints d'un projet par le PROJECT_OWNER et PROJECT_MEMBER
    @GetMapping("/project/{projectId}")
    @PreAuthorize("@sprintSecurityService.canViewSprints(#projectId)")
    public ResponseEntity<List<Sprint>> getSprintsByProject(@PathVariable Long projectId) {
        List<Sprint> sprints = sprintService.getSprintsByProject(projectId);
        return ResponseEntity.ok(sprints);
    }

//  voir un sprint par son ID - Seul PROJECT_OWNER et PROJECT_MEMBER peuvent le voir
    @GetMapping("/{sprintId}")
    @PreAuthorize("@sprintSecurityService.canViewSprint(#sprintId)")
    public ResponseEntity<Sprint> getSprintById(@PathVariable Long sprintId) {
        Sprint sprint = sprintService.getSprintById(sprintId);
        return ResponseEntity.ok(sprint);
    }
}