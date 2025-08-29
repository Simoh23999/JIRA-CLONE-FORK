import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string()
    .nonempty("Le nom est obligatoire")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    ,
    description: z.string().optional(),    
    sprintId: z.number().or(z.string()).optional(), 
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  sprintId: z.number().or(z.string()),
  projectId: z.number().or(z.string()),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

