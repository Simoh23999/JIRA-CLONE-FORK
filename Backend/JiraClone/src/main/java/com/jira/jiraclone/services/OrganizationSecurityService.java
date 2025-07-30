package com.jira.jiraclone.services;

import com.jira.jiraclone.entities.Membership;
import com.jira.jiraclone.entities.enums.RoleInOrganization;
import com.jira.jiraclone.repositories.MembershipRepository;
import com.jira.jiraclone.security.UserPrincipal;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class OrganizationSecurityService {


    private final  MembershipRepository membershipRepository;

    public OrganizationSecurityService(MembershipRepository membershipRepository) {
        this.membershipRepository = membershipRepository;
    }
    // Verifie si l'utilisateur a le droit de voir l'organisation

    public boolean canViewOrganization(Long organizationId, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String email = userPrincipal.getEmail();


        // pour verifier si l'utilisateur a le role ADMIN global
        if (hasGlobalRole(userPrincipal, "ADMIN")) {
            return true;
        }
        // pour verifier si l'utilisateur est membre de l'organisation
        return membershipRepository.existsByUserEmailAndOrganizationId(email, organizationId);
    }

    // Verifie si l'utilisateur a le droit de modifier l'organisation

    public boolean canEditAndDeleteOrganization(Long organizationId,Authentication authentication){
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String email = userPrincipal.getEmail();


        if(hasGlobalRole(userPrincipal, "ADMIN")){
            return true;
        }
        return membershipRepository.existsByUserEmailAndOrganizationIdAndRoleInOrganisation(
                email, organizationId, RoleInOrganization.OWNER
        );

    }



    private boolean hasGlobalRole(UserPrincipal userPrincipal, String role){
        return userPrincipal.getAuthorities().stream()
                .anyMatch(g -> g.getAuthority().equals("ROLE_"+role));
    }

}
