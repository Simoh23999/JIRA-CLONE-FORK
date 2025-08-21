import { number, z } from "zod";

export const addMemberSchema = z.object({
  email: z
    .string()
    .nonempty("L'email est obligatoire")
    .email("Format d'email invalide"),
  organizationId: z.union([z.string(), z.number()]),
  role: z.enum(["ADMINPROJECT", "MEMBER", "OWNER"]),
});
