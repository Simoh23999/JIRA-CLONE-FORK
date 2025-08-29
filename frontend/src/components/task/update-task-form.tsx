"use client";

import React, { useState } from "react";
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
import { 
  Calendar, 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  ChevronDown 
} from "lucide-react";

import { Task } from "@/types/task";
import {  UpdateTaskInput, updateTaskSchema } from "@/features/tasks/schemas";
import { useUpdateTask } from "@/features/tasks/api/use-updtae-task";
import z from "zod";
import SprintSelect, { Sprint } from "./SprintSelect";


interface Props {
  task: Task;
  onCancel?: () => void;
}

const mockSprints: Sprint[] = [
  {
    id: "1",
    name: "Sprint 1 - Fondation",
    status: "Actif",
    startDate: "2024-01-15",
    endDate: "2024-01-29",
    progress: 65,
    tasks: { completed: 13, total: 20 },
  },
  {
    id: "2",
    name: "Sprint 2 - Fonctionnalités principales",
    status: "Planification",
    startDate: "2024-01-30",
    endDate: "2024-02-13",
    progress: 0,
    tasks: { completed: 0, total: 25 },
  },
];

const UpdateTaskForm = ({ task, onCancel }: Props) => {
  const form = useForm<UpdateTaskInput>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      sprintId: task.sprintId,
      projectId: task.projectId,
    },
  });

  const updateTaskMutation = useUpdateTask();

  const onSubmit = (values: z.infer<typeof updateTaskSchema>) => {

    updateTaskMutation.mutate(
      { taskId: task.id, values },
      {
        onSuccess: () => {
          toast.success("Tâche mise à jour avec succès");
          onCancel?.();
        },
        onError: (err: any) => {
          toast.error(err.message);
        },
      }
    );
  };


 const filteredSprints = mockSprints.filter(
    (s) => s.status === "Actif" || s.status === "Planification"
  );
  
  return (
    <Card className="w-full h-full border-none shadow-md">
      <CardHeader className="flex justify-center">
        <CardTitle className="text-xl font-bold justify-center">
          Modifier la tâche
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
                disabled={updateTaskMutation.isPending}
              >
                {updateTaskMutation.isPending
                  ? "Mise à jour..."
                  : "Mettre à jour"}
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

export default UpdateTaskForm;