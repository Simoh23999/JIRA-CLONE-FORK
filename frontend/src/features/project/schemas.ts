import { z } from "zod";

export const projectSchema = z.object({
  name: z.string()
	.nonempty("Le nom est obligatoire")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    ,
	description: z.string().nonempty("La description est obligatoire")
    .max(500, "Le descriprtion doit contenir 500 caractères en max").trim(),
  createdAt: z.date().optional(),
  deadline: z.date().optional(),
  status: z.string().optional(),
  imageUrl: z.string().url().optional(),
});
