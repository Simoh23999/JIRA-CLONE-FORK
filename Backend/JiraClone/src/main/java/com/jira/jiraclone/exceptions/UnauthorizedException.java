package com.jira.jiraclone.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Indique à Spring de répondre avec le statut HTTP 401 Unauthorized
@ResponseStatus(HttpStatus.UNAUTHORIZED)// Indicate to Spring to respond with HTTP status 401 Unauthorized
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException() {
        super();
    }

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
