package com.jira.jiraclone.services.IntrefacesServices;

import com.jira.jiraclone.dtos.TaskRequestDto;
import com.jira.jiraclone.dtos.TaskResponseDto;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.enums.TaskStatus;

import java.util.List;

public interface ITaskService {

    TaskResponseDto createTask(Long projectId, TaskRequestDto dto, User requester);

    void assignTask(Long taskId, Long assigneeProjectMembershipId, User requester);

    TaskResponseDto updateTaskStatus(Long taskId, TaskStatus newStatus, User requester);

    TaskResponseDto getTaskById(Long taskId, User requester);

    List<TaskResponseDto> getTasksByProject(Long projectId, User requester);
    List<TaskResponseDto> findBySprintStatusActif(Long projectId, User requester);

    TaskResponseDto updateTask(Long taskId, TaskRequestDto dto, User requester);

    void deleteTask(Long taskId, User requester);
}
