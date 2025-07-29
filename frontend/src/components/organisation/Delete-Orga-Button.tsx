"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteOrganization } from "@/features/workspaces/api/use-delete-workspace";
import React from "react";
import { useParams } from "next/navigation";
 

export default function DeleteOrganizationButton({ workspace }: { workspace: any }) {
  const params = useParams();
  const id = Number(params.id);

  const handleDelete = async () => {
    const  success= await deleteOrganization(id);
    if (success.status === 200) {
      toast.success(success.data.message );
    }
    else {
      // toast.error(`Erreur lors de la suppression de l'organisation "${workspace.name},${success}".`);
      if (success.data && success.data.message) {
        toast.error(success.data.message );
      } else {
        // Provide a generic error message if data.message is not available
        toast.error(success || "Erreur lors de la suppression de l'organisation");
      }
    }

  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 size-4" />
          Supprimer
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Êtes-vous sûr de vouloir supprimer "{workspace.name}" ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Elle supprimera définitivement 
            l'organisation ainsi que <strong>toutes les informations associées</strong> 
            (membres, organisateurs et données liées).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Oui
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
