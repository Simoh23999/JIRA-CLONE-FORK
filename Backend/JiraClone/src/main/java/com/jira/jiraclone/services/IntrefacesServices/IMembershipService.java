package com.jira.jiraclone.services.IntrefacesServices;

import com.jira.jiraclone.entities.Membership;
import com.jira.jiraclone.entities.User;
import com.jira.jiraclone.entities.enums.RoleInOrganization;

import java.util.List;

public interface IMembershipService {
    //  Ajouter un membre à une organisation et assigner un rôle
    void addMemberToOrganization(Long organizationId, String email, RoleInOrganization role, User requester);
    //  Supprimer un membre d’une organisation
    void removeMemberFromOrganization(Long organizationId, Long targetUserId, User requester);
    //  Mettre à jour le rôle d’un membre dans une organisation
    void updateMemberRole(Long organizationId, Long targetUserId, RoleInOrganization newRole, User requester);

    //  Récupérer tous les membres d’une organisation chaque fois qu’un utilisateur envoie une requête
    List<Membership> getMembersByOrganization(Long organizationId, User requester);
}
