"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useGetOrganizationMembers } from "@/features/workspaces/api/use-get-workspace";
import { Shield, User } from "lucide-react";
import { useAddMemberToProject } from "@/features/MembershipProject/api/use-add-member";
import { Project } from "@/types/project";


interface Props {
  projectId: number|string;
  project:Project,
  onCancel?: () => void;
  onSuccess?: () => void;
}

const AddMemberProjectForm = ({ projectId,project, onCancel, onSuccess }: Props) => {
  const [search, setSearch] = useState("");
  const addMember = useAddMemberToProject();
  const [selectedUser, setSelectedUser] = useState<number |string| null>(null);

  const [role, setRole] = useState("PROJECT_MEMBER");
  const { data: members = [], isLoading } = useGetOrganizationMembers(project.organizationId);

  // Liste filtrée des membres
  const filtered = useMemo(() => {
    return members.filter((m) =>
      `${m.fullName} ${m.email}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [members, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Veuillez sélectionner un utilisateur");
      return;
    }
    const user = members.find((m) => m.userId === selectedUser);
     addMember.mutate(
      {
        projectId,
        membershipId: Number(selectedUser),
        role,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onCancel?.();
        },
      });

    onSuccess?.();
    onCancel?.();
  };


  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex justify-center">
        <CardTitle className="text-xl font-bold justify-center">
          Inviter un membre au projet
        </CardTitle>
      </CardHeader>
      <div className="px-10">
        <Separator />
      </div>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Barre de recherche + Select sur une seule ligne */}
          <div className="flex items-center gap-3">
            <Select
              value={selectedUser?.toString()}
              onValueChange={(val) => setSelectedUser(val)}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder={isLoading ? "Chargement..." : "Rechercher ou sélectionner"} />
              </SelectTrigger>
              <SelectContent>
                {/* Barre de recherche intégrée */}
                <div className="p-2">
                  <Input
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Liste filtrée */}
                {filtered.length > 0 ? (
                  filtered.map((m) => (
                    <SelectItem key={m.memberishipId} value={m.memberishipId.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{m.fullName}</span>
                        <span className="text-xs text-gray-500">{m.email}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-gray-500">
                    Aucun utilisateur trouvé
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Sélecteur de rôle */}
          
            <div className="mt-5">
            <label className="text-sm font-medium">Rôle</label>
            <RadioGroup
  value={role}
  onValueChange={setRole}
  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
>
  {/* Membre */}
  <label
    htmlFor="role-member"
    className={`flex cursor-pointer items-center rounded-md border p-3 transition
      ${
        role === "PROJECT_MEMBER"
          ? "border-[#769fcd] bg-[#d6e6f2]"
          : "border-[#b9d7ea] bg-[#f7fbfc]"
      }
      hover:border-[#769fcd] hover:bg-[#d6e6f2]
    `}
  >
    <RadioGroupItem value="PROJECT_MEMBER" id="role-member" className="sr-only" />
    <User
      className={`mr-2 w-4 h-4 ${
        role === "PROJECT_MEMBER" ? "text-[#769fcd]" : "text-[#b9d7ea]"
      }`}
    />
    <div>
      <div className="text-sm font-medium">Membre</div>
      <div className="text-xs text-muted-foreground">
        Accès collaboratif
      </div>
    </div>
  </label>

  {/* Admin */}
  <label
    htmlFor="role-admin"
    className={`flex cursor-pointer items-center rounded-md border p-3 transition
      ${
        role === "PROJECT_ADMIN"
          ? "border-[#769fcd] bg-[#d6e6f2]"
          : "border-[#b9d7ea] bg-[#f7fbfc]"
      }
      hover:border-[#769fcd] hover:bg-[#d6e6f2]
    `}
  >
    <RadioGroupItem value="PROJECT_ADMIN" id="role-admin" className="sr-only" />
    <Shield
      className={`mr-2 w-4 h-4 ${
        role === "PROJECT_ADMIN" ? "text-[#769fcd]" : "text-[#b9d7ea]"
      }`}
    />
    <div>
      <div className="text-sm font-medium">Admin Projet</div>
      <div className="text-xs text-muted-foreground">
        Gestion complète
      </div>
    </div>
  </label>
  </RadioGroup>

          </div>

          {/* Boutons */}
          <div className="flex items-center justify-between mt-7">
            <Button type="submit" size="lg"  disabled={isLoading}>
              Ajouter le membre
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
      </CardContent>
    </Card>
  );
};

export default AddMemberProjectForm;
