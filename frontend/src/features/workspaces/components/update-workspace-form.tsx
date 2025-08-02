"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkSpaceSchema } from "../schemas";
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
import { toast } from "sonner";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { Loader, Save, User } from "lucide-react";
import { useParams } from "next/navigation";

interface Organization {
  id: number;
  name: string;
  description?: string;
}

interface Props {
  organization: Organization;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const EditOrganizationForm = ({ organization, onCancel, onSuccess }: Props) => {
  const { data: workspaces, isLoading, isError, error } = useGetWorkspaces();
  const safeWorkspaces = workspaces ?? [];
  const { mutateAsync: updateWorkspace, isPending: loadingUpdate } = useUpdateWorkspace();

  // const { updateWorkspace, loading: loadingUpdate, error: errorUpdate } =
    // useUpdateWorkspace(safeWorkspaces);
  const params = useParams();
  const id = Number(params.id);
  
  const form = useForm<z.infer<typeof createWorkSpaceSchema>>({
    resolver: zodResolver(createWorkSpaceSchema),
    defaultValues: {
      name: organization.name || "",
      description: organization.description || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createWorkSpaceSchema>) => {
    try {
      await updateWorkspace({ workspaceId: id, updatedData: values });
      onCancel?.();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      onCancel?.();
      // toast.error("Erreur lors de la mise à jour de l'organisation");
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex justify-center">
        <CardTitle className="text-xl font-bold justify-center">
          Modifier l'organisation {organization.id}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4 p-2 pl-5">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'organisation</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-y-4 p-2 pl-5">
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description de l'organisation</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full pr-5 border-2"
                        placeholder="Entrez la description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between mt-7">
              <Button
                type="submit"
                size="lg"
                variant="ghost"
                disabled={loadingUpdate}
              >
                 {loadingUpdate ? <Loader></Loader>: ""}
                {loadingUpdate ? "Enregistrement..." : "Enregistrer"}
                
              </Button>

              <Button
                type="button"
                size="lg"
                variant="destructive"
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

export default EditOrganizationForm;
