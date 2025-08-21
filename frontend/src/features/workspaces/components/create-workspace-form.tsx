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
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useGetWorkspaces } from "../api/use-get-workspaces"; // ✅ Hook pour récupérer les organisations
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onCancel?: () => void;
}

const CreateWorkspaceForm = ({ onCancel }: Props) => {
  const form = useForm<z.infer<typeof createWorkSpaceSchema>>({
    resolver: zodResolver(createWorkSpaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const createWorkspaceMutation = useCreateWorkspace();
  // const { workspaces } =  useGetWorkspaces();
  const workspaces = useGetWorkspaces(); // Récupérer les organisations existantes

  const onSubmit = async (values: z.infer<typeof createWorkSpaceSchema>) => {
    try {
      // await useCreateWorkspace(values);
      createWorkspaceMutation.mutate(values);
      form.reset();
      handleCancel();
    } catch (error) {
      console.error(error);
      handleCancel();
      toast.error("Erreur lors de la création du workspace");
    }
  };

  const handleCancel = () => {
    if (workspaces) {
      // if(true) {
      onCancel?.(); // Ferme le formulaire si au moins une organisation existe
    } else {
      toast.error(
        `Vous devez créer au moins une organisation avant de fermer.`,
      );
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex justify-center">
        <CardTitle className="text-xl font-bold justify-center">
          Créer une nouvelle organisation
        </CardTitle>
      </CardHeader>
      <div className="px-10">
        <Separator />
      </div>
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
                      <Input
                        placeholder="Entrez le nom de l'organisation"
                        {...field}
                      />
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
                      <Textarea
                        placeholder="Entrez la description de l'organisation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between mt-7">
              <Button type="submit" size="lg" variant="tertiary">
                Créer l'organisation
              </Button>

              <Button
                type="button"
                size="lg"
                variant="ghost"
                onClick={handleCancel}
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

export default CreateWorkspaceForm;
