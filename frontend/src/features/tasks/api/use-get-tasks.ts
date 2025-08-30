// import { Task } from "@/types/task";
// import { useState, useEffect } from "react";

// export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
// export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

// export const useGetTasks = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const mockTasks: Task[] = [
//         {
//           id: 1,
//           title: "Créer la page login",
//           description: "Créer la page login avec validation des champs",
//           projectId: 1,
//           sprintId: 1,
//           assignedToProjectMembershipId: 2,
//           createdByProjectMembershipId: 1,
//           status: "INPROGRESS",
//           priority: "HIGH",
//           dueDate: new Date().toISOString(),
//           orderInColumn: 0,
//           storyPoints: 3,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           comments: [
//             {
//               id: 1,
//               taskId: 1,
//               projectMembershipId: 2,
//               content: "N'oubliez pas la validation côté frontend",
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             },
//           ],
//         },
//         {
//           id: 2,
//           title: "Configurer l'API Jira",
//           description: "Mettre en place le backend pour récupérer les projets",
//           projectId: 1,
//           sprintId: 1,
//           createdByProjectMembershipId: 1,
//           status: "TODO",
//           priority: "MEDIUM",
//           orderInColumn: 1,
//           storyPoints: 5,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         },
//         {
//           id: 3,
//           title: "Écrire les tests unitaires",
//           description: "Créer des tests pour les composants React",
//           projectId: 1,
//           sprintId: 1,
//           createdByProjectMembershipId: 2,
//           status: "DONE",
//           priority: "LOW",
//           orderInColumn: 2,
//           storyPoints: 2,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         },
//         {
//           id: 4,
//           title: "Déployer l'application sur staging",
//           description:
//             "Préparer le déploiement pour l'environnement de staging",
//           projectId: 1,
//           sprintId: 2,
//           assignedToProjectMembershipId: 3,
//           createdByProjectMembershipId: 1,
//           status: "INPROGRESS",
//           priority: "CRITICAL",
//           orderInColumn: 0,
//           storyPoints: 8,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         },
//         {
//           id: 5,
//           title: "Revoir le design des cartes",
//           description: "Mettre à jour le design selon le feedback UX",
//           projectId: 1,
//           sprintId: 2,
//           assignedToProjectMembershipId: 2,
//           createdByProjectMembershipId: 1,
//           status: "TODO",
//           priority: "MEDIUM",
//           orderInColumn: 1,
//           storyPoints: 3,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         },
//         {
//           id: 6,
//           title: "Optimiser les requêtes SQL",
//           description: "Réduire le temps de réponse des endpoints",
//           projectId: 1,
//           sprintId: 2,
//           assignedToProjectMembershipId: 3,
//           createdByProjectMembershipId: 2,
//           status: "DONE",
//           priority: "HIGH",
//           orderInColumn: 2,
//           storyPoints: 5,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         },
//       ];

//       setTasks(mockTasks);
//       setLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   return { tasks, loading };
// };
