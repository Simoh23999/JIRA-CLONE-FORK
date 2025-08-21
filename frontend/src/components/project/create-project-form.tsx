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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, CheckCircle, Clock } from "lucide-react";

import { projectSchema } from "@/features/project/schemas";
import { ProjectStatus } from "@/types/ProjectStatus";
import { useCreateProject } from "@/features/project/api/use-create-project";

type CreateProjectFormData = z.infer<typeof projectSchema>;

interface Props {
  onCancel?: () => void;
  orgId: number | string;
}

const palette = {
  lightBg: "#f7fbfc",
  hoverBg: "#d6e6f2",
  border: "#b9d7ea",
  active: "#769fcd",
};

const CreateProjectForm = ({ orgId, onCancel }: Props) => {
  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createProjectMutation = useCreateProject(orgId);
  const onSubmit = (values: CreateProjectFormData) => {
    createProjectMutation.mutate(values);
    form.reset();
    onCancel?.();
  };

  return (
    <Card className="w-full h-full border-none shadow-md">
      <CardHeader className="flex justify-center">
        <CardTitle className="text-xl font-bold justify-center">
          Créer un nouveau projet
        </CardTitle>
      </CardHeader>

      <div className="px-8">
        <Separator />
      </div>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4 p-2 pl-4">
              {/* Nom */}
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Titre du projet
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom du projet"
                        {...field}
                        className="rounded-lg border px-3 py-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez le projet"
                        {...field}
                        className="rounded-lg border px-3 py-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Statut en style Jira */}
              <FormField
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Statut du projet
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2"
                      >
                        {/* Pending */}
                        <label
                          htmlFor="status-pending"
                          className={`flex cursor-pointer items-center rounded-md border p-3 transition ${
                            field.value === ProjectStatus.EN_COURS
                              ? `border-[${palette.active}] bg-[${palette.hoverBg}]`
                              : `border-[${palette.border}] bg-[${palette.lightBg}]`
                          } hover:border-[${palette.active}] hover:bg-[${palette.hoverBg}]`}
                        >
                          <RadioGroupItem
                            value={ProjectStatus.EN_COURS}
                            id="status-pending"
                            className="sr-only"
                          />
                          <Clock
                            className={`mr-2 w-4 h-4 ${
                              field.value === ProjectStatus.EN_COURS
                                ? `text-[${palette.active}]`
                                : `text-[${palette.border}]`
                            }`}
                          />
                          En attente
                        </label>

                        {/* In Progress */}
                        <label
                          htmlFor="status-inprogress"
                          className={`flex cursor-pointer items-center rounded-md border p-3 transition ${
                            field.value === ProjectStatus.EN_ATTENTE
                              ? `border-[${palette.active}] bg-[${palette.hoverBg}]`
                              : `border-[${palette.border}] bg-[${palette.lightBg}]`
                          } hover:border-[${palette.active}] hover:bg-[${palette.hoverBg}]`}
                        >
                          <RadioGroupItem
                            value={ProjectStatus.EN_ATTENTE}
                            id="status-inprogress"
                            className="sr-only"
                          />
                          <Calendar
                            className={`mr-2 w-4 h-4 ${
                              field.value === ProjectStatus.EN_ATTENTE
                                ? `text-[${palette.active}]`
                                : `text-[${palette.border}]`
                            }`}
                          />
                          En cours
                        </label>

                        {/* Done */}
                        <label
                          htmlFor="status-done"
                          className={`flex cursor-pointer items-center rounded-md border p-3 transition ${
                            field.value === ProjectStatus.TERMINE
                              ? `border-[${palette.active}] bg-[${palette.hoverBg}]`
                              : `border-[${palette.border}] bg-[${palette.lightBg}]`
                          } hover:border-[${palette.active}] hover:bg-[${palette.hoverBg}]`}
                        >
                          <RadioGroupItem
                            value={ProjectStatus.TERMINE}
                            id="status-done"
                            className="sr-only"
                          />
                          <CheckCircle
                            className={`mr-2 w-4 h-4 ${
                              field.value === ProjectStatus.TERMINE
                                ? `text-[${palette.active}]`
                                : `text-[${palette.border}]`
                            }`}
                          />
                          Terminé
                        </label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dates */}
              <FormField
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Date de début
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="rounded-lg border px-3 py-2"
                        style={{ borderColor: palette.border }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Date de fin
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="rounded-lg border px-3 py-2"
                        style={{ borderColor: palette.border }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Boutons */}
            <div className="flex items-center justify-between mt-7">
              <Button type="submit" size="lg">
                Créer le projet
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

export default CreateProjectForm;
