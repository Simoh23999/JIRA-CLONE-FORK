"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { createTaskSchema } from "@/features/tasks/schemas";
import { useCreateTask } from "@/features/tasks/api/use-create-task";
import SprintSelect from "./SprintSelect";
import { Sprint, useGetSprintsByProjectId } from "@/features/sprint/api/use-get-sprints";

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface Props {
  projectId: number | string;
  onCancel: () => void;
}

const mockSprints: Sprint[] = [
  {
    id: "1",
    name: "Sprint 1 - Fondation",
    status: "ACTIVE",
    startDate: "2024-01-15",
    endDate: "2024-01-29",
    progress: 65,
    tasks: { completed: 13, total: 20 },
  },
  {
    id: "2",
    name: "Sprint 2 - Fonctionnalités principales",
    status : "PLANNED",
    startDate: "2024-01-30",
    endDate: "2024-02-13",
    progress: 0,
    tasks: { completed: 0, total: 25 },
  },
];

const CreateTaskForm = ({ projectId, onCancel }: Props) => {
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      sprintId: undefined,
    },
  });

  const createTaskMutation = useCreateTask(projectId);

  const onSubmit = (values: CreateTaskFormData) => {
    createTaskMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Tâche créée avec succès");
        form.reset();
        onCancel?.();
      },
      onError: (err: any) => {
        toast.error(err.message);
      },
    });
    onCancel?.();
  };


   // Utilisation du hook pour récupérer les sprints du projet
    const { data: sprints, isLoading: sprintsLoading, error: sprintsError } =
      useGetSprintsByProjectId(projectId);

    // On vérifie que c'est bien un tableau
    const sprintList: Sprint[] = Array.isArray(sprints) ? sprints : [];

    const filteredSprints: Sprint[] = sprintList.filter(
      (s) => s.status === "ACTIVE" || s.status === "PLANNED"
    );

  const filteredSprints1 = mockSprints.filter(
    (s) => s.status === "ACTIVE" || s.status === "PLANNED"
  );

  return (
    <Card className="w-full h-full border-none shadow-md">
      <CardHeader className="flex justify-center">
        <CardTitle className="text-xl font-bold justify-center">
          Créer une tâche
        </CardTitle>
      </CardHeader>

      <div className="px-8">
        <Separator />
      </div>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4 p-2 pl-4"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de la tâche" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Décrivez la tâche" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sprint Select */}
            <FormField
              control={form.control}
              name="sprintId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sprint</FormLabel>
                  <FormControl>
                    <SprintSelect
                      value={field.value?.toString() ?? ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                      filteredSprints={filteredSprints}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex items-center justify-between mt-7">
              <Button
                type="submit"
                size="lg"
                disabled={createTaskMutation.isPending}
              >
                {createTaskMutation.isPending ? "Création..." : "Créer la tâche"}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="ghost"
                onClick={onCancel}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateTaskForm;
