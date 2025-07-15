package com.jira.jiraclone.repositories;

import com.jira.jiraclone.entities.UserRole;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<UserRole, Long> {
    UserRole findByRoleName(String roleName);
}
