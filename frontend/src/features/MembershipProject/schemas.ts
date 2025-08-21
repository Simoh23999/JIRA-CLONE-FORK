// src/features/ProjectMembership/schemas.ts
import { z } from "zod";

// Schéma de validation des données envoyées
export const addProjectMemberSchema = z.object({
  projectId: z.union([z.string(), z.number()]),
  membershipId: z.union([z.string(), z.number()]),
  role: z.union([z.string(), z.enum(["PROJECT_MEMBER", "PROJECT_OWNER"])]),
});

export const UpdateMemberRolePayload = z.object({
  projectMembershipId: z.union([z.string(), z.number()]), // ID de l'organisation
  newRole: z.union([z.string(), z.enum(["PROJECT_MEMBER", "PROJECT_OWNER"])]),
});
