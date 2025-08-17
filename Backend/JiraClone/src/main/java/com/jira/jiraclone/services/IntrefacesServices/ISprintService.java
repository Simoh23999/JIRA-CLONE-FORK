package com.jira.jiraclone.services.IntrefacesServices;


import com.jira.jiraclone.dtos.SprintRequestDTO;
import com.jira.jiraclone.entities.Sprint;
import com.jira.jiraclone.entities.User;

import java.time.LocalDate;
import java.util.List;

public interface ISprintService {
    void createSprint(SprintRequestDTO dto);
    void updateSprint(Long id, SprintRequestDTO dto);

    void startSprint(Long sprintId);

    void completeSprint(Long sprintId);

    void cancelSprint(Long sprintId);

    List<Sprint> getSprintsByProject(Long projectId);

    Sprint getSprintById(Long sprintId);
}
