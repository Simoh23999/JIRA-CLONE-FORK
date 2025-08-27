# TaskFlow 

> **Dernière mise à jour :** Août 2025  
> **Version :** 0.1.0  

TaskFlow est un **clone de Jira** construit avec un **frontend Next.js** et un **backend Spring Boot**, conçu pour fournir des fonctionnalités avancées de gestion de projet telles que le suivi des taches, la planification des sprints, la gestion du backlog et la collaboration en équipe.  
Il permet aux équipes d’organiser les tâches, suivre l’avancement et gérer les flux de travail de manière efficace.

---

## Aperçu du projet

**Utilisateurs cibles :**  
- Toute personne ayant un projet et souhaitant le gérer de manière efficace.

**Fonctionnalités principales :**  
- Authentification et rôles utilisateurs  
- Création et gestion de projets  
- gestion des permissions RBAC (Role-based access control) 
- Création, attribution et suivi des tâches/tickets  
- Planification de sprint et gestion du backlog  
- Tableau Kanban pour visualiser les tâches  

---

## Stack technique

### Frontend
- [Next.js](https://nextjs.org/) (v15+)  
- [React](https://reactjs.org/) (v18+)  
- [TypeScript](https://www.typescriptlang.org/)  
- [TailwindCSS](https://tailwindcss.com/) pour le style  
- [Radix UI](https://www.radix-ui.com/) pour les composants UI
### Backend
- [Spring Boot](https://spring.io/projects/spring-boot) (v3+)  
- [Java](https://www.oracle.com/java/) (17+)  
- [Spring Security](https://spring.io/projects/spring-security) pour la sécurité  
- [MySQL](https://www.mysql.com/) via [XAMPP](https://www.apachefriends.org/) comme base de données  
- [Hibernate](https://hibernate.org/) comme ORM  

---

## Prérequis

Avant d’installer et lancer le projet, assurez-vous d’avoir :  

- [Node.js](https://nodejs.org/) (v18+)  
- [npm](https://www.npmjs.com/) (gestionnaire de paquets frontend)  
- [Java JDK 17+](https://adoptium.net/)  
- [Maven](https://maven.apache.org/)  
- [XAMPP](https://www.apachefriends.org/) (inclut MySQL)  
- Git  

---

## Démarrage rapide

Cloner le dépôt :

```bash
git clone https://github.com/your-org/taskflow.git
cd taskflow
```
### Lancer le Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```
L’application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Liens de documentation

- [Guide de développement Frontend](./Docs/FRONTEND_DEVELOPMENT.md)
- [Guide de développement Backend](./Docs/BACKEND_DEVELOPMENT.md)

