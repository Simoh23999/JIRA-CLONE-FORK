package com.jira.jiraclone.repositories;

import com.jira.jiraclone.entities.Project;
import com.jira.jiraclone.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProject(Project project);

}
