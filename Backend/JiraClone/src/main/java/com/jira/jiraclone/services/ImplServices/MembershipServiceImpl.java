package com.jira.jiraclone.services.ImplServices;

import com.jira.jiraclone.entities.Membership;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.enums.RoleInOrganization;
import com.jira.jiraclone.exceptions.ConflictException;
import com.jira.jiraclone.exceptions.NotFoundException;
import com.jira.jiraclone.exceptions.UnauthorizedException;
import com.jira.jiraclone.repositories.MembershipRepository;
import com.jira.jiraclone.repositories.OrganizationRepository;
import com.jira.jiraclone.repositories.UserRepository;
import com.jira.jiraclone.services.IntrefacesServices.IMembershipService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MembershipServiceImpl implements IMembershipService {

    private MembershipRepository membershipRepository;
    private UserRepository userRepository;
    private OrganizationRepository organizationRepository;

    public MembershipServiceImpl(MembershipRepository membershipRepository, UserRepository userRepository, OrganizationRepository organizationRepository) {
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }

   /*
   Les Regles de cette methode addMemberToOrganization sont les suivantes:
    0:Verifier que l'organisation existe.
    1:Le requester doit être membre de l’organisation.
    2:Le requester doit avoir le rôle ADMINPROJECT ou OWNER dans l’organisation.
    3:l'utilisateur cible doit exister dans la base de données.
    4: il ne doit pas déjà être membre de l’organisation.
    5:Créer un Membership et le sauvegarder.

    */
    @Override
    public void addMemberToOrganization(Long organizationId, String email, RoleInOrganization role, User requester) {

        //0: Vérifier que l'organisation existe
        var organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new NotFoundException("Organisation introuvable !!"));

        //1: Vérifier que le requester est membre de l'organisation
        Membership requesterMembership =membershipRepository.findByUserAndOrganization(requester,organization)
                .orElseThrow(() -> new IllegalArgumentException("Vous devez être membre de l'organisation pour ajouter des membres."));

        //2: Vérifier que le requester a le rôle ADMINPROJECT ou OWNER
        if (requesterMembership.getRoleInOrganisation() != RoleInOrganization.ADMINPROJECT
                && requesterMembership.getRoleInOrganisation() != RoleInOrganization.OWNER) {
            throw new UnauthorizedException("Seuls les ADMIN ou OWNER peuvent ajouter des membres.");
        }

        //3: Vérifier que l'utilisateur cible existe
        User userToAdd = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Utilisateur avec cet email introuvable."));


        //4: Vérifier que l'utilisateur cible n'est pas déjà membre de l'organisation
        boolean alreadyMember = membershipRepository
                .existsByUserAndOrganization(userToAdd, organization);
        if (alreadyMember) {
            throw new ConflictException("Cet utilisateur est déjà membre de l'organisation.");
        }

        //5: Créer un Membership et le sauvegarder
        Membership membership = Membership.builder()
                .user(userToAdd)
                .organization(organization)
                .roleInOrganisation(role)
                .build();
        membershipRepository.save(membership);

    }

    /*    Les Regles de cette methode removeMemberFromOrganization sont les suivantes:
    0: Vérifier que l'organisation existe.
    1: Le requester doit être membre de l’organisation.
    2: Le requester doit avoir le rôle ADMINPROJECT ou OWNER dans l’organisation.
    3: Vérifier que l'utilisateur cible existe.
    4: Vérifier que l'utilisateur cible est membre de l'organisation.
    5: Supprimer le Membership de l'utilisateur cible.

     */

    @Transactional
    @Override
    public void removeMemberFromOrganization(Long organizationId, Long targetUserId, User requester) {
        //0: Vérifier que l'organisation existe
        var organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new NotFoundException("Organisation introuvable !!"));

        //1: Vérifier que le requester est membre de l'organisation
        Membership requesterMembership = membershipRepository.findByUserAndOrganization(requester, organization)
                .orElseThrow(() -> new IllegalArgumentException("Vous devez être membre de l'organisation pour supprimer des membres."));

        //2: Vérifier que le requester a le rôle ADMINPROJECT ou OWNER
        if (requesterMembership.getRoleInOrganisation() != RoleInOrganization.ADMINPROJECT
                && requesterMembership.getRoleInOrganisation() != RoleInOrganization.OWNER) {
            throw new UnauthorizedException("Seuls les ADMIN ou OWNER peuvent supprimer des membres.");
        }

        //3: Vérifier que l'utilisateur cible existe
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new NotFoundException("Utilisateur introuvable."));

        //4: Vérifier que l'utilisateur cible est membre de l'organisation
        Membership targetMembership = membershipRepository.findByUserAndOrganization(targetUser, organization)
                .orElseThrow(() -> new NotFoundException("L'utilisateur n'est pas membre de cette organisation."));
        // 5. Récupérer le rôle du requester dans l'organisation
        RoleInOrganization requesterRole = requesterMembership.getRoleInOrganisation();

        // 6. Vérifie que le requester a le droit de supprimer ce membre
        boolean isSelf = requester.getId().equals(targetUserId);
        if (isSelf && requesterRole == RoleInOrganization.OWNER) {
            long ownersCount = membershipRepository.countByOrganizationAndRoleInOrganisation(
                    organization, RoleInOrganization.OWNER
            );
            if (ownersCount <= 1) {
                throw new ConflictException("Vous êtes le seul OWNER, vous ne pouvez pas quitter cette organisation.");
            }
        }
        // 7. Un ADMIN ne peut pas supprimer un OWNER
        if (!isSelf && requesterRole == RoleInOrganization.ADMINPROJECT
                && targetMembership.getRoleInOrganisation() == RoleInOrganization.OWNER) {
            throw new UnauthorizedException("Un ADMIN ne peut pas supprimer un OWNER.");
        }


        //9: Supprimer le Membership de l'utilisateur cible
        membershipRepository.deleteByUserAndOrganization(targetUser, organization);
    }
    /*
    Les Regles de cette methode updateMemberRole sont les suivantes:
    0: Vérifier que l'organisation existe.
    1: Le requester doit être membre de l’organisation.
    2: Le requester doit avoir le rôle ADMINPROJECT ou OWNER dans l’organisation.
    3: Vérifier que l'utilisateur cible existe.
    4: Vérifier que l'utilisateur cible est membre de l'organisation.
    5: Vérifier que le nouveau rôle est valide.
    6:Un ADMIN ne peut pas modifier le rôle d’un OWNER
    7:Un OWNER peut modifier n’importe qui
    6: Mettre à jour le rôle de l'utilisateur cible dans l'organisation.

     */
    @Override

    public void updateMemberRole(Long organizationId, Long targetUserId, RoleInOrganization newRole, User requester) {

        // 1. Vérifier que l’organisation existe
        var organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new NotFoundException("Organisation introuvable."));

        // 2. Vérifier que le requester est membre
        Membership requesterMembership = membershipRepository
                .findByUserAndOrganization(requester, organization)
                .orElseThrow(() -> new UnauthorizedException("Vous n'êtes pas membre de cette organisation."));

        RoleInOrganization requesterRole = requesterMembership.getRoleInOrganisation();

        // 3. Vérifier qu’il est autorisé (ADMIN ou OWNER)
        if (!(requesterRole == RoleInOrganization.ADMINPROJECT || requesterRole == RoleInOrganization.OWNER)) {
            throw new UnauthorizedException("Seuls les ADMIN ou OWNER peuvent modifier des rôles.");
        }
        // 4. Vérifier que l’utilisateur cible existe
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new NotFoundException("Utilisateur introuvable."));
        // 4. Vérifier que le membre cible existe
        Membership targetMembership = membershipRepository
                .findByUserAndOrganization(targetUser, organization)
                .orElseThrow(() -> new NotFoundException("Le membre à modifier n’existe pas."));

        // 5. Un ADMINPROJECT ne peut pas modifier un OWNER
        if (requesterRole == RoleInOrganization.ADMINPROJECT &&
                targetMembership.getRoleInOrganisation() == RoleInOrganization.OWNER) {
            throw new UnauthorizedException("Un ADMIN ne peut pas modifier le rôle d’un OWNER.");
        }
        if(requesterRole == RoleInOrganization.ADMINPROJECT && newRole == RoleInOrganization.OWNER) {
            throw new UnauthorizedException("Un ADMIN ne peut pas attribuer le rôle d’OWNER.");
        }

        // 6. Vérifie que le rôle a réellement changé
        if (targetMembership.getRoleInOrganisation() == newRole) {
            throw new ConflictException("Ce membre a déjà ce rôle.");
        }

        // 7. Appliquer le changement
        targetMembership.setRoleInOrganisation(newRole);
        membershipRepository.save(targetMembership);
    }

    /*
    Les Regles de cette methode getMembersByOrganization sont les suivantes:
    0: Vérifier que l'organisation existe.
    1: Le requester doit être membre de l’organisation.
    2: Récupérer tous les membres de l'organisation.

     */

    @Override
    public List<Membership> getMembersByOrganization(Long organizationId, User requester) {
        // 0: Vérifier que l'organisation existe
        var organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new NotFoundException("Organisation introuvable."));

        // 1: Vérifier que le requester est membre de l'organisation
        membershipRepository.findByUserAndOrganization(requester, organization)
                .orElseThrow(() -> new UnauthorizedException("Vous devez être membre de l'organisation pour voir les membres."));

        // 2: Récupérer tous les membres de l'organisation
        List<Membership> members = membershipRepository.findByOrganization(organization);

        if (members.isEmpty()) {
            throw new NotFoundException("Aucun membre trouvé dans cette organisation.");
        }

        return members;
    }

}
