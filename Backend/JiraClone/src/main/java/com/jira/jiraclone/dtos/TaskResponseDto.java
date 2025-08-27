// src/main/java/com/jira/jiraclone/dtos/TaskResponseDto.java
package com.jira.jiraclone.dtos;

import com.jira.jiraclone.entities.enums.TaskStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponseDto {
    private Long id;
    private String title;
    private String description;

    private Long projectId;
    private Long sprintId;

    private Long createdByProjectMembershipId;
    private Long assignedToProjectMembershipId;
    private Long assignedByProjectMembershipId;

    private TaskStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
