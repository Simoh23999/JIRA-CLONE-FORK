package com.jira.jiraclone.repositories;

import com.jira.jiraclone.entities.Membership;
import com.jira.jiraclone.entities.Organization;
import com.jira.jiraclone.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, Long> {

    Optional<Membership> findByUserAndOrganization(User user, Organization organization);

    Optional<Membership> findByOrganization(Organization organization);

    boolean existsByUserAndOrganization(User user, Organization organization);

    void deleteByUserAndOrganization(User user, Organization organization);
}
