package com.jira.jiraclone.exceptions;

public class OrganizationNotFoundException extends RuntimeException {
    public OrganizationNotFoundException(String message){
        super(message);
    }
}
