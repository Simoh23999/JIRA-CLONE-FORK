package com.jira.jiraclone.services.IntrefacesServices;

import com.jira.jiraclone.dtos.MyOrganizationDto;

import java.util.List;

public interface IUserService {
    void updateUsername(String username);

    void updatePassword(String CurrentPassword, String NewPassword);

    void deleteProfile(String password);

    List<MyOrganizationDto> getMyOrganizations();
}