# 🚀 Jira Clone - Backend API

Un système de gestion de projets complet inspiré de Jira, développé avec Spring Boot. Cette API REST fournit toutes les fonctionnalités nécessaires pour gérer des organisations, projets, sprints et tâches avec un système de rôles et permissions robuste.

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies Utilisées](#-technologies-utilisées)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Endpoints](#-api-endpoints)
- [Système de Rôles](#-système-de-rôles)
- [Structure du Projet](#-structure-du-projet)

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- Authentification JWT avec refresh tokens
- Système de logout sécurisé
- Gestion des mots de passe avec validation
- Protection CORS et CSRF

### 👤 Gestion des Utilisateurs
- Inscription et authentification
- Gestion du profil utilisateur
- Changement de mot de passe
- Suppression de compte
- Consultation des organisations de l'utilisateur

### 🏢 Gestion des Organisations
- Création et gestion d'organisations
- Système de membership avec rôles hiérarchiques
- Invitation et gestion des membres
- Contrôle d'accès basé sur les rôles

### 📁 Gestion des Projets
- Création de projets au sein des organisations
- Assignation de membres aux projets avec rôles spécifiques
- Gestion des permissions au niveau projet
- Vue d'ensemble des projets par organisation

### 🏃‍♂️ Gestion des Sprints
- Cycle de vie complet des sprints (PLANNED → ACTIVE → COMPLETED/CANCELLED)
- Validation des dates et contraintes métier
- Un seul sprint actif par projet
- Gestion des transitions d'état avec vérifications

### ✅ Gestion des Tâches
- Création et assignation de tâches
- États des tâches avec workflow défini
- Dates d'échéance et organisation par colonnes
- Déplacement de tâches entre sprints

## 🏗️ Architecture

Le projet suit une architecture en couches avec séparation claire des responsabilités :

```
📁 Backend Architecture
├── 🎮 Controllers Layer      # API REST endpoints
├── 🔒 Security Layer         # JWT, authentification, autorisations
├── 💼 Services Layer         # Logique métier et règles business
├── 🗃️ Repository Layer       # Accès aux données (JPA)
├── 📊 Entities Layer         # Modèles de données
├── 📦 DTOs Layer            # Transfert de données
└── 🚨 Exception Handling     # Gestion centralisée des erreurs
```

### Principes de Conception
- **Clean Architecture** : Séparation claire des couches
- **Domain Driven Design** : Logique métier centralisée
- **Repository Pattern** : Abstraction de l'accès aux données
- **DTO Pattern** : Sécurisation des échanges de données
- **Exception Handling** : Gestion centralisée des erreurs

## 🛠️ Technologies Utilisées

### Core Framework
- **Spring Boot 3.5.3** - Framework principal
- **Spring Security** - Authentification et autorisation
- **Spring Data JPA** - Accès aux données
- **Spring Validation** - Validation des données

### Base de Données
- **MySQL 8.0** - Base de données relationnelle
- **Spring Data JPA** - ORM (Object-Relational Mapping)
- **MySQL Connector/J** - Driver JDBC

### Sécurité
- **JWT (JSON Web Tokens)** - Authentification stateless
- **jjwt 0.12.6** - Bibliothèque JWT pour Java
- **BCrypt** - Hachage sécurisé des mots de passe

### Outils de Développement
- **Lombok** - Réduction du code boilerplate
- **Spring Boot DevTools** - Rechargement automatique
- **Maven Wrapper** - Gestion des dépendances

## 🚀 Installation

### Prérequis
- **Java 17** ou version supérieure
- **MySQL 8.0** ou version supérieure
- **Git** pour cloner le repository

### Étapes d'Installation

1. **Cloner le repository**
```bash
git clone https://github.com/Simoh23999/JIRA-CLONE.git
cd JIRA-CLONE/Backend/JiraClone
```

2. **Configurer MySQL**
```sql
-- Créer la base de données
CREATE DATABASE jira_db;
```

3. **Configurer application.properties**
```properties
# Modifier si nécessaire
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

4. **Installer les dépendances et lancer l'application**
```bash
# Installer les dépendances
.\mvnw.cmd install

# Lancer l'application
.\mvnw.cmd spring-boot:run
```

L'application sera disponible sur **http://localhost:9090**

## ⚙️ Configuration

### application.properties

```properties
spring.application.name=JiraClone

# Configuration Base de Données
spring.datasource.url=jdbc:mysql://localhost:3306/jira_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configuration Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Configuration Serveur
server.port=9090
server.address=
```

## 🔗 API Endpoints

### 🔐 Authentication (AuthController)

```http
POST   /api/auth/register       # Inscription utilisateur
POST   /api/auth/authenticate   # Connexion utilisateur  
POST   /api/auth/refresh        # Rafraîchir le token JWT
POST   /api/auth/logout         # Déconnexion sécurisée
```

### 👤 User Management (UserController)

```http
PUT    /api/me                  # Mettr à jour mon profil
PUT    /api/me/password         # Changer mon mot de passe
DELETE /api/me                  # Supprimer Mon compte
GET    /api/me/organizations    # Mes organisations
```

### 🏢 Organizations (OrganizationController)

```http
POST   /organizations           # Créer une organisation
GET    /organizations/{id}      # Détails d'une organisation
PUT    /organizations/{id}      # Modifier une organisation
DELETE /organizations/{id}      # Supprimer une organisation
```

### 👥 Organization Memberships (MembershipController)

```http
POST   /api/memberships/add                                    # Ajouter un membre
DELETE /api/organizations/{organizationId}/members/{targetUserId}  # Retirer un membre
PUT    /api/organizations/{organizationId}/members/{targetUserId}/role  # Changer le rôle
GET    /api/organizations/{organizationId}/members             # Lister les membres
```

### 📁 Projects (ProjectController)

```http
POST   /api/projects/organizations/{organizationId}/projects   # Créer un projet
GET    /api/projects/{projectId}                              # Détails d'un projet
PUT    /api/projects/{projectId}                              # Modifier un projet
DELETE /api/projects/{projectId}                              # Supprimer un projet
GET    /api/projects/organizations/{organizationId}/projects  # Projets d'une organisation
```

### 👥 Project Memberships (ProjectMembershipController)

```http
POST   /api/projects/{projectId}/members                      # Ajouter un membre au projet
DELETE /api/projects/members/{projectMembershipId}            # Retirer un membre du projet
PUT    /api/projects/members/{projectMembershipId}/role       # Changer le rôle dans le projet
GET    /api/projects/{projectId}/members                      # Membres du projet
```

### 🏃‍♂️ Sprints (SprintController)

```http
POST   /api/sprints                        # Créer un sprint
PUT    /api/sprints/{sprintId}             # Modifier un sprint
PATCH  /api/sprints/{sprintId}/start       # Démarrer un sprint
PATCH  /api/sprints/{sprintId}/complete    # Terminer un sprint
PATCH  /api/sprints/{sprintId}/cancel      # Annuler un sprint
GET    /api/sprints/project/{projectId}    # Sprints d'un projet
GET    /api/sprints/{sprintId}             # Détails d'un sprint
```

### ✅ Tasks (TaskController)

```http
POST   /api/projects/{projectId}/tasks     # Créer une tâche
POST   /api/tasks/{taskId}/assign          # Assigner une tâche
PUT    /api/tasks/{taskId}/status          # Changer le statut
GET    /api/tasks/{taskId}                 # Détails d'une tâche
GET    /api/projects/{projectId}/tasks     # Tâches d'un projet
PUT    /api/tasks/{taskId}                 # Modifier une tâche
DELETE /api/tasks/{taskId}                 # Supprimer une tâche
```


## 🔒 Système de Rôles

### Hiérarchie des Permissions

#### Niveau Global (UserRole)
- **ADMIN** : Accès administrateur complet
- **MEMBER** : Utilisateur standard

#### Niveau Organisation (RoleInOrganization)
- **OWNER** : Propriétaire de l'organisation
- **ADMIN_PROJECT** : Peut créer et gérer des projets
- **MEMBER** : Membre standard de l'organisation

#### Niveau Projet (ProjectRole)
- **PROJECT_OWNER** : Propriétaire du projet (contrôle total)
- **PROJECT_MEMBER** : Membre du projet (participation)

### Matrice des Permissions

| Action | ORG_OWNER | ORG_ADMIN_PROJECT | ORG_MEMBER | PROJECT_OWNER | PROJECT_MEMBER |
|--------|------|-----------------|----------|---------------|--------------|
| Gérer Organisation | ✅ | ❌ | ❌ | ❌ | ❌ |
| Créer Projet | ✅ | ✅ | ❌ | ❌ | ❌ |
| Gérer Projet | ✅ | ✅ | ❌ | ✅ | ❌ |
| Créer Sprint | ❌ | ✅ | ❌ | ✅ | ❌ |
| Gérer Sprint | ❌ | ✅ | ❌ | ✅ | ❌ |
| Voir Sprints | ✅ | ✅ | ✅ | ✅ | ✅ |
| Créer Tâches | ❌ | ✅❌| ❌| ✅ | ❌ |
| Assigner Tâches | ❌| ❌ | ❌ | ✅ | ✅ |

## 🚀 Installation

### Prérequis
- **Java 17** ou version supérieure
- **MySQL 8.0** ou version supérieure
- **Git** pour cloner le repository

### Étapes d'Installation

1. **Cloner le repository**
```bash
git clone https://github.com/Simoh23999/JIRA-CLONE.git
cd JIRA-CLONE/Backend/JiraClone
```

2. **Configurer MySQL**
```sql
-- Créer la base de données
CREATE DATABASE jira_db;

```

3. **Configurer application.properties**

Modifiez le fichier `src/main/resources/application.properties` :

```properties
# Configuration Base de Données (ajustez selon vos credentials)
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe_mysql

# Optionnel: Changer le port si 9090 est occupé
server.port=9090
```

4. **Installer et lancer l'application**

```bash
# Installer les dépendances
.\mvnw.cmd install

# Lancer l'application
.\mvnw.cmd spring-boot:run
```

### 🎉 Vérification de l'Installation

L'application sera disponible sur : **http://localhost:9090**

Testez avec un simple endpoint :
```bash
curl http://localhost:9090/api/auth/register
```

## 📁 Structure du Projet

```
src/
├── main/
│   ├── java/com/jira/jiraclone/
│   │   ├── 📁 controllers/              # Contrôleurs REST API
│   │   │   ├── AuthController.java
│   │   │   ├── UserController.java
│   │   │   ├── OrganizationController.java
│   │   │   ├── MembershipController.java
│   │   │   ├── ProjectController.java
│   │   │   ├── ProjectMembershipController.java
|   |   |   ├── TaskController.java
│   │   │   ├── SprintController.java
│   │   │   └── TestController.java
│   │   │
│   │   ├── 📁 dtos/                     # Data Transfer Objects
│   │   │   ├── AuthRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── RefreshTokenRequest.java
│   │   │   ├── OrganizationDto.java
│   │   │   ├── ProjectDto.java
│   │   │   ├── SprintRequestDTO.java
│   │   │   └── ...
│   │   │
│   │   ├── 📁 entities/                 # Entités JPA
│   │   │   ├── User.java
│   │   │   ├── UserRole.java
│   │   │   ├── Organization.java
│   │   │   ├── Membership.java
│   │   │   ├── Project.java
│   │   │   ├── ProjectMembership.java
│   │   │   ├── Sprint.java
│   │   │   ├── Task.java
│   │   │   ├── RefreshToken.java
│   │   │   └── enums/
│   │   │       ├── RoleInOrganization.java
│   │   │       ├── ProjectRole.java
│   │   │       └── SprintStatus.java
│   │   │       └── TaskStatus.java
│   │   │
│   │   ├── 📁 repositories/             # Repositories JPA
│   │   │   ├── UserRepository.java
│   │   │   ├── OrganizationRepository.java
│   │   │   ├── MembershipRepository.java
│   │   │   ├── ProjectRepository.java
│   │   │   ├── ProjectMembershipRepository.java
│   │   │   ├── SprintRepository.java
│   │   │   ├── TaskRepository.java
│   │   │   └── RefreshTokenRepository.java
│   │   │
│   │   ├── 📁 services/                 # Services métier
│   │   │   ├── AuthService.java
│   │   │   ├── JwtService.java
│   │   │   ├── RefreshTokenService.java
│   │   │   ├── CustomUserDetailsService.java
│   │   │   ├── OrganizationSecurityService.java
│   │   │   ├── ImplServices/            # Implémentations
│   │   │   │   ├── UserServiceImpl.java
│   │   │   │   ├── OrganizationServiceImpl.java
│   │   │   │   ├── MembershipServiceImpl.java
│   │   │   │   ├── ProjectServiceImpl.java
│   │   │   │   ├── ProjectMembershipServiceImpl.java
│   │   │   │   └── SprintServiceImpl.java
│   │   │   │   └── TaskServiceImpl.java
│   │   │   └── IntrefacesServices/      # Interfaces
│   │   │       ├── IUserService.java
│   │   │       ├── IOrganizationService.java
│   │   │       ├── IMembershipService.java
│   │   │       ├── IProjectService.java
│   │   │       ├── IProjectMembershipService.java
│   │   │       └── ISprintService.java
│   │   │       └── ITaskService.java
│   │   │
│   │   ├── 📁 security/                 # Configuration sécurité
│   │   │   ├── SecurityConfig.java
│   │   │   ├── JwtFilter.java
│   │   │   └── UserPrincipal.java
│   │   │
│   │   ├── 📁 exceptions/               # Gestion des exceptions
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── NotFoundException.java
│   │   │   ├── UnauthorizedException.java
│   │   │   ├── BadRequestException.java
│   │   │   └── ConflictException.java
│   │   │
│   │   └── JiraCloneApplication.java    # Classe principale
│   │
│   └── resources/
│       └── application.properties       # Configuration application
└── test/
    └── java/com/jira/jiraclone/
        └── JiraCloneApplicationTests.java
```

## 🧪 Tests avec Postman

2. **Headers globaux** :
```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

### Scénarios de Test Recommandés

#### 1. Flux d'Authentification
```http
# 1. Inscription
POST /api/auth/register
{
    "username": "testuser",
    "email": "testuser@gmail.com", 
    "password": "password123"
}

# 2. Connexion
POST /api/auth/authenticate
{
    "email": "testuser@gmail.com",
    "password": "password123"
}

# 3. Utiliser le token retourné pour les requêtes suivantes
```

#### 2. Cycle de Vie Complet

**Étape 1 : Créer une organisation**
```http
POST /organizations
{
    "name": "Mon Entreprise",
    "description": "Description de mon entreprise"
}
```
#### la meme chose pour les autres les requêtes.


### Tests de Sécurité (exemple)

#### Test avec Utilisateur Non-Autorisé
1. Se connecter avec un PROJECT_MEMBER
2. Tenter de créer un sprint → **Attendu** : 403 Forbidden
3. Consulter les sprints → **Attendu** : 200 OK

#### Test de Validation (exemple)
```http
# Sprint avec dates invalides
POST /api/sprints
{
    "name": "Sprint Test",
    "startDate": "2024-09-15",
    "endDate": "2024-09-10"  // Date de fin avant début
}
# Attendu: 400 Bad Request
```

## 🔧 Développement

### Commandes Utiles

```bash
# Nettoyer et rebuilder
.\mvnw.cmd clean install

# Lancer en mode développement
.\mvnw.cmd spring-boot:run
```

### Logs de Débogage

Les logs SQL sont activés par défaut en développement. Consultez la console pour voir :
- Requêtes SQL générées
- Temps d'exécution
- Erreurs de validation

## 🚧 Statut du Projet

### ✅ Fonctionnalités Implémentées
- [x] Authentification JWT complète
- [x] Gestion des utilisateurs et profils
- [x] Système d'organisations avec rôles
- [x] Gestion des projets
- [x] Membership management (organisations et projets)
- [x] Gestion complète des sprints
- [x] Gestion des tâches (Task entity)
- [x] Sécurité et contrôle d'accès


### 🔄 En Cours de Développement
- [ ] Système de commentaires
- [ ] Notifications
- [ ] API de rapports

### 🎯 Prochaines Étapes
- [ ] Dockerisation
- [ ] Déploiement CI/CD

## 📚 Ressources Additionnelles

### Documentation des Dépendances
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Spring Data JPA Guide](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [JWT.io](https://jwt.io/) - Comprendre les JSON Web Tokens

### Outils Recommandés
- **Postman** - Tests API
- **MySQL Workbench** - Gestion base de données
- **IntelliJ IDEA** - IDE recommandé
- **Git** - Contrôle de version

## 🤝 Contribution

### Comment Contribuer

1. **Fork** le repository
2. Créer une **branche feature** (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une **Pull Request**

### Standards de Code

- Respecter les conventions Java
- Utiliser Lombok pour réduire le boilerplate
- Documenter les méthodes publiques
- Valider toutes les entrées utilisateur
- Gérer les exceptions appropriément
- Écrire des tests pour les nouvelles fonctionnalités


## 📞 Support

Pour toute question ou problème :

- **Issues GitHub** : [Créer une issue](https://github.com/votre-username/jira-clone/issues)
- **Documentation** : Consultez ce README et les commentaires dans le code
- **Email** : 

---

⭐ **Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile !** ⭐

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)