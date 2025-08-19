"use client";

import { Fragment, useState } from "react";
import { MoreVerticalIcon, Trash2, User, UserCog, UserMinus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

import { useGetOrganizationMembers } from "@/features/workspaces/api/use-get-workspace";
import { useDeleteMemberFromOrganization } from "@/features/Membership/api/use-delete-member";
import { useUpdateMemberRole } from "@/features/Membership/api/use-update-role";

export default function OrganizationMembersList({
  organizationId,
  isAdminOrOwner,
}: {
  organizationId: number;
  isAdminOrOwner?: boolean;
}) {
  const { data: members } = useGetOrganizationMembers(organizationId);
  const { mutate: deleteMember, isLoading: isPending } = useDeleteMemberFromOrganization();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const filtered = members?.filter((m) => m.role !== "OWNER") || [];

  const openDeleteDialog = (memberId: string) => {
    setSelectedMemberId(memberId);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedMemberId) return;
    deleteMember({ organizationId, targetUserId: selectedMemberId });
    setDialogOpen(false);
    setSelectedMemberId(null);
  };
  const updateMemberRole = useUpdateMemberRole();
  // Simulations des fonctions setAsAdmin/setAsMember
  const handleSetAsAdmin = (memberId: string) => {
    updateMemberRole.mutate({
    organizationId: organizationId,
    targetUserId: memberId,
    newRole: "ADMINPROJECT",
  });

  }
  const handleSetAsMember = (memberId: string|number) => {
    updateMemberRole.mutate({
    organizationId: organizationId,
    targetUserId: memberId,
    newRole: "MEMBER",
  });
}

  return (
    <>
      {filtered.map((member, index) => (
        <Fragment key={member.userId}>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatarUrl} />
              <AvatarFallback>{member.fullName?.[0] || "M"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{member.fullName}</p>
              <p className="text-muted-foreground text-xs">{member.role || "Membre"}</p>
            </div>
            {isAdminOrOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="secondary" size="icon">
                    <MoreVerticalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  {member.role === "MEMBER" && (
                    <DropdownMenuItem onClick={() => handleSetAsAdmin(member.userId)}>
                     <UserCog className="w-4 h-4 mr-2" />
                      Définir comme Admin
                    </DropdownMenuItem>
                  )}
                  {member.role === "ADMINPROJECT" && (
                    <DropdownMenuItem onClick={() => handleSetAsMember(member.userId)}>
                       <User className="w-4 h-4 mr-2" />
                      Définir comme Membre
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => openDeleteDialog(member.userId)}
                    disabled={isPending}
                    className="cursor-pointer hover:bg-red-100 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4  text-red-600" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {index < filtered.length - 1 && <Separator className="my-2.5" />}
        </Fragment>
      ))}

      {/* AlertDialog pour confirmation suppression */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isPending}>
              {isPending ? "Suppression..." : "Oui, supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
