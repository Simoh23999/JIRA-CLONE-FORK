package com.jira.jiraclone.services.ImplServices;

import com.jira.jiraclone.dtos.OrganizationDto;
import com.jira.jiraclone.dtos.OrganizationResponseDto;
import com.jira.jiraclone.entities.Membership;
import com.jira.jiraclone.entities.Organization;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.enums.RoleInOrganization;
import com.jira.jiraclone.exceptions.NotFoundException;
import com.jira.jiraclone.exceptions.OrganizationNotFoundException;
import com.jira.jiraclone.exceptions.UnauthorizedException;
import com.jira.jiraclone.repositories.MembershipRepository;
import com.jira.jiraclone.repositories.OrganizationRepository;
import com.jira.jiraclone.repositories.UserRepository;
import com.jira.jiraclone.security.UserPrincipal;
import com.jira.jiraclone.services.IntrefacesServices.IOrganizationService;
import com.jira.jiraclone.services.ImplServices.OrganizationServiceImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrganizationServiceImpl implements IOrganizationService {

    private final OrganizationRepository organizationRepository;
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;

    public OrganizationServiceImpl(OrganizationRepository organizationRepository,
                                   MembershipRepository membershipRepository,
                                   UserRepository userRepository) {
        this.organizationRepository = organizationRepository;
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
    }

    @Override
    public OrganizationResponseDto getOrganizationById(Long id) {
          Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Organisation non trouvée"));
          String OwnerName = org.getMemberships().stream()
                .filter(membership -> membership.getRoleInOrganisation() == RoleInOrganization.OWNER)
                .map(membership -> membership.getUser().getUsername())
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Propriétaire non trouvé"));
            return OrganizationResponseDto.builder()
                .name(org.getName())
                .description(org.getDescription())
                .OwnerName(OwnerName)
                .build();
    }
    @Override
    public void createOrganization(OrganizationDto organizationDto, UserPrincipal userPrincipal) {
        String email = userPrincipal.getEmail();
        User creator = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));

        Organization organization = new Organization();
        organization.setName(organizationDto.getName());
        organization.setDescription(organizationDto.getDescription());
        organization.setCreatedAt(LocalDateTime.now());
        organization.setUpdatedAt(LocalDateTime.now());
        Organization savedOrg = organizationRepository.save(organization);

        Membership ownerMembership = Membership.builder()
                .organization(savedOrg)
                .user(creator)
                .roleInOrganisation(RoleInOrganization.OWNER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        membershipRepository.save(ownerMembership);
    }

    @Override
    public void updateOrganization(Long id, OrganizationDto organizationDto) {

        Organization existing = organizationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Organisation non trouvée"));

        existing.setName(organizationDto.getName());
        existing.setDescription(organizationDto.getDescription());
        existing.setUpdatedAt(LocalDateTime.now());
        organizationRepository.save(existing);
    }

    @Override
    public void deleteOrganization(Long id){
        Organization existing = organizationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Organisation non trouvée"));
//        List<Membership> memberships = existing.getMemberships();
        organizationRepository.delete(existing);
//        if (memberships != null && !memberships.isEmpty()) {
//            for (Membership membership : memberships) {
//                membershipRepository.delete(membership);
//            }
//        }
    }
}