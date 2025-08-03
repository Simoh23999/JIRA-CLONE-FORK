package com.jira.jiraclone.dtos;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class MyOrganizationDto {
    private Long id; // Utile pour les actions futures
    private String name;
    private String description;
    private String roleInOrganisation;
    private String ownerUsername;
    public MyOrganizationDto(Long id, String name, String description, String ownerUsername, String roleInOrganisation) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ownerUsername = ownerUsername;
        this.roleInOrganisation = roleInOrganisation;
    }


}
