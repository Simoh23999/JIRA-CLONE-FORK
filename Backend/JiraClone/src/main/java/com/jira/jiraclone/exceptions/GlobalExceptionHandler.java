package com.jira.jiraclone.exceptions;

import com.jira.jiraclone.entities.enums.RoleInOrganization;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // Cette annotation indique que cette classe gère les exceptions pour tous les contrôleurs REST
public class GlobalExceptionHandler {
    /*
    ------------------------Exceptions personnalisées----------------------
    1. Enum invalide dans une URL
    2. Entité non trouvée
    3. Conflit métier
    4. Non autorisé
    5. Requête mal formée (ex: validation Spring)
    6. Par défaut : toute autre exception non capturée

    * */
    // 1.Enum invalide dans une URL
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidEnum(MethodArgumentTypeMismatchException ex) {
        Map<String, Object> response = new HashMap<>();

        if (ex.getRequiredType() == RoleInOrganization.class) {
            response.put("status", 400);
            response.put("error", "Invalid Role");
            response.put("message", "Le rôle '" + ex.getValue() + "' est invalide. Valeurs autorisées : " +
                    Arrays.toString(RoleInOrganization.values()));
            return ResponseEntity.badRequest().body(response);
        }

        response.put("status", 400);
        response.put("error", "Bad Request");
        response.put("message", "Paramètre invalide");
        return ResponseEntity.badRequest().body(response);
    }

    // 2. Entité non trouvée
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException ex) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Non trouvé", ex.getMessage());
    }

    // 3. Conflit métier
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(ConflictException ex) {
        return buildErrorResponse(HttpStatus.CONFLICT, "Conflit", ex.getMessage());
    }


    //4.  Non autorisé
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorized(UnauthorizedException ex) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Non autorisé", ex.getMessage());
    }

    // 5. Requête mal formée (ex: validation Spring)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 400);
        response.put("error", "Validation error");
        response.put("message", ex.getBindingResult().getFieldError().getDefaultMessage());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Accès refusé");
        error.put("message", "Vous n'avez pas les permissions pour faire cette action");
        error.put("status", 403);

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<String> handleInvalidPasswordException(InvalidPasswordException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }


    // 6. Par défaut : toute autre exception non capturée
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur interne", ex.getMessage());
    }
    @ExceptionHandler(OrganizationNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleOrganizationNotFound(OrganizationNotFoundException ex) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Non trouvé", ex.getMessage());
    }

    @ExceptionHandler({JwtException.class, SignatureException.class, BadCredentialsException.class})
    public ResponseEntity<Map<String, String>> handleJwtException(Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Token invalide ou signature incorrecte");
        response.put("details", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    //  Méthode utilitaire pour construire les réponses
    private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpStatus status, String error, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", status.value());
        response.put("error", error);
        response.put("message", message);
        return ResponseEntity.status(status).body(response);
    }
}
