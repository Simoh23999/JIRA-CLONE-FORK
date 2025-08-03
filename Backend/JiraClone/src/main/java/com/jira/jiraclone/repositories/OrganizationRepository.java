package com.jira.jiraclone.repositories;

import com.jira.jiraclone.dtos.MyOrganizationDto;
import com.jira.jiraclone.entities.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findById(Long id);

    @Query("SELECT new com.jira.jiraclone.dtos.MyOrganizationDto(" +
            "o.id, o.name, o.description, " +
            "(SELECT u2.username FROM User u2 " +
            "JOIN u2.memberships m2 " +
            "WHERE m2.organization = o AND m2.roleInOrganisation = 'OWNER'), " +
            "CAST(m.roleInOrganisation AS string)) " +
            "FROM Membership m " +
            "JOIN m.organization o " +
            "JOIN m.user u " +
            "WHERE u.email = :email")
    List<MyOrganizationDto> findMyOrganizationsByUserEmail(@Param("email") String email);
}
