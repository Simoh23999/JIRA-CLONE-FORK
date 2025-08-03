"use client";

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

import { Trash2 } from "lucide-react";
import React from "react";
import { useParams } from "next/navigation";
import { useDeleteOrganization } from "@/features/workspaces/api/use-delete-workspace";
import { Button } from "../ui/button";


export default function DeleteOrganizationButton({ workspace }: { workspace: any }) {
  const params = useParams();
  const id = Number(params.id);

  const { mutate, isPending } = useDeleteOrganization();

  const handleDelete = () => {
    mutate(id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending}>
          <Trash2 className="mr-2 size-4" />
          {isPending ? "Suppression..." : "Supprimer"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Êtes-vous sûr de vouloir supprimer "{workspace.name}" ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Elle supprimera définitivement
            l'organisation ainsi que <strong>toutes les informations associées</strong>{" "}
            (membres, organisateurs et données liées).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            Oui
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
