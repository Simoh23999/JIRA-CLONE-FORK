package com.jira.jiraclone.repositories;

import com.jira.jiraclone.entities.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<UserRole, Long> {
    UserRole findByname(String name);
}
