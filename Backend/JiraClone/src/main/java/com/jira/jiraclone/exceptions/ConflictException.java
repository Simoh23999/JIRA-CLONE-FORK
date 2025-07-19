package com.jira.jiraclone.exceptions;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)  // 409
public class ConflictException extends RuntimeException {
    public ConflictException() {
        super();
    }
    public ConflictException(String message) {
        super(message);
    }
    public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}