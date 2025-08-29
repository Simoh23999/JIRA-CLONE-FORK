"use client";
import {
  useGetOrganization,
  useGetOrganizationMembers
} from "@/features/workspaces/api/use-get-workspace";

import { useParams, useRouter } from "next/navigation";
import DashboardLoading from "../../loading";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, LogOut, Plus, PlusCircleIcon, Settings, UserPlus, UserPlusIcon} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DeleteOrganizationButton from "@/components/organisation/Delete-Orga-Button";
import DefaultBanner from "@/components/organisation/ui/DefaultBanner"
import { ResponsiveModal } from "@/components/ResponsiveModal";
import EditOrganizationForm from "@/features/workspaces/components/update-workspace-form";
import {useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import OrganizationMembersList from "@/components/Members/MembersList";
import AddMemeberForm from "@/components/Members/add-member-form";
import { Toaster } from "@/components/ui/sonner";
import { useDeleteMemberFromOrganization } from "@/features/Membership/api/use-delete-member";
import CreatProjectModal from "@/components/project/create-project-modal";
import { ProjectCard } from "@/components/project/CardProject";
import { Project } from "@/types/project";
import { useGetProjects } from "@/features/project/api/use-get-project";
import { useAuthRole } from "@/hooks/useAuthRole";


type JwtPayload = {
  roles:string;
  username: string;
  email: string;
  exp: number;
  sub:string;
  iat: number;
};

export default function OrganizationDetail() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const { data: projects, isLoading} = useGetProjects(id);
  const { data: workspace, isLoading: loading ,error} = useGetOrganization(id);
  const { data: members} = useGetOrganizationMembers(id);
   const { mutate: deleteMember } = useDeleteMemberFromOrganization();

  // Trouver l'organisateur (membre avec rôle OWNER)
const organizer = members?.find((m) => m.role === "OWNER") || null;

// Filtrer les autres membres (exclure l'organisateur)
const filteredMembers = members?.filter((m) => m.role !== "OWNER") || [];

  const { isAdminOrOwner, isMember, userId } = useAuthRole(members);

 
    // --- Fonction de sortie de l'organisation ---
  function leaveOrganization() {
    if (!userId) {
       console.log("Impossible de récupérer l'identifiant utilisateur.");
      return;
    }
    const organizationId = id;
    // alert(`Vous avez quitté l'organisation ${id}.
    // - Votre ID utilisateur : ${userId}
    // (simulation)`);

      deleteMember({ organizationId, targetUserId: userId });
      router.push("/dashboard/organisations");
      }

  
   // State pour modal ouvert/fermé
  const [openadd, setOpenadd] = useState(false);
  const [open, setOpen] = useState(false);
  const [openFP, setOpenFP] = useState(false);
  const data =useGetOrganizationMembers(id);
  console.log("data=====",data);
  if (loading) return <DashboardLoading />;
  if (error||data.isError) return <p className="text-red-500">Aucun organisateur trouvé</p>;

  
  
   // Ouvrir modal drawer pour édition
  const handleEdit = () => {
    setOpen(true);
  };

  const handleAddMember = (isOpen: boolean) => {
    setOpenadd(isOpen);
  };

  // Fermer modal
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };
  const hanldleOpenProjectForm = (isOpen: boolean) => {
    setOpenFP(isOpen);
  }

  const handleRedirect = () => router.push(`/organizations/${id}/members`);
  return (
    <div className="container mx-auto px-4 py-3 md:px-6 max-w-4xl">
      {/* --- Banner Image --- */}
      <div className="">
        {workspace?.bannerUrl ? (
        <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden shadow-sm">
          <img
            src={workspace.bannerUrl}
            alt="Workspace Banner"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="mb-6">
          <DefaultBanner />
        </div>
      )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{workspace?.name}</h1>
          <p className="text-muted-foreground text-sm">
            {workspace?.description || "Aucune description disponible"}
          </p>
        </div>


  
{isAdminOrOwner && (
           <Button variant="outline" size="sm" onClick={handleEdit} className="rounded-full">
          <Settings className="size-4 mr-1" />
          Modifier
        </Button>

    )}

      </div>

     {/* Organisateur */}
        <Card className="mb-4 shadow-sm rounded-xl">
          <CardContent className="p-3 flex items-center justify-between">
            {organizer ? (
              <Link href={`/dashboard/people/${organizer.userId}`}>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={organizer.avatarUrl} />
                    <AvatarFallback>{organizer.fullName?.[0] || "O"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold">{organizer.fullName}</p>
                    <p className="text-muted-foreground text-sm">Organisateur</p>
                  </div>
                </div>
              </Link>
            ) : (
              <p className="text-muted-foreground">Aucun organisateur trouvé</p>
            )}
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Organisation active
            </Badge>
          </CardContent>
        </Card>

      {/* Membres */}
      {/* <Card className="mb-4 shadow-sm rounded-xl">
        <CardContent className="p-6 pt-0 pb-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Membres de l'organisation</h2>
            <Button variant="outline" size="xs" onClick={handleRedirect}>
              <Eye className="mr-1 size-4" /> Voir
            </Button>
          </div>
          {filteredMembers.length ? (
            <div className="space-y-3">
              {filteredMembers.map((member: any) => (
                <div key={member.userId} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{member.fullName?.[0] || "M"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.fullName}</p>
                      <p className="text-muted-foreground text-xs">{member.role || "Membre"}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-50 text-green-700" variant="outline">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Aucun membre n'est enregistré pour cette organisation.
            </p>
          )}

        </CardContent>
      </Card> */}


          


            <Card className="mb-4 shadow-sm rounded-xl">
        <CardContent className="p-6 pt-0 pb-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Membres de l'organisation</h2>
  
           
          </div>
          <OrganizationMembersList organizationId={id} isAdminOrOwner={isAdminOrOwner} />
        </CardContent>
      </Card>


   {/* carde de les projets */}
   <div>
      {isAdminOrOwner&&(  
       
         <div className="flex flex-row justify-between gap-4">
  
              {/* Texte "Project :" */}
              <div className="flex items-center font-bold text-xl">
                 Project :
              </div>

              {/* Boutons */}
              <div className="flex items-center gap-3">
                <Button variant={"outline"} onClick={() => handleAddMember(true)}>
                  <UserPlus className="size-4 mr-1" />
                  Invite
                </Button>
               {projects && projects.length > 0 && (
                 <Button onClick={()=> hanldleOpenProjectForm(true)}>
                  <Plus className="size-4 mr-1" />
                  Create Project
                </Button>)}
              </div>

            </div>

            )}
            
   <div className="p-4">
  {projects && projects.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          workspaceId={id}
          progress={20}
        />
      ))}
    </div>
  ) : (
   

    <div className="flex flex-col items-center justify-center h-64 border-2 border-[#1D71B8] rounded-xl  p-6 shadow-md">
      <svg
        className="w-110 h-10 text-[#1D71B8] mb-4 animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </svg>
      <h3 className="text-2xl font-bold text-[#142D5C] mb-2 animate-pulse">Aucun projet</h3>
      <p className="text-sm text-[#1D71B8] text-center mb-4">
        Vous n'avez encore aucun projet dans cet espace de travail.
      </p>
      
       {isAdminOrOwner&&( <Button onClick={()=> hanldleOpenProjectForm(true)}>
                  <Plus className="size-4 mr-1" />
                  Create Project
      </Button>)}

    </div>


  )}
</div>


      </div>
      {/* Suppression */}
      {isAdminOrOwner && (
      <Card className="shadow-sm border-[#d6e6f2] rounded-xl">
        <CardContent className="p-3 text-center">
          <p className="text-sm mb-3">
            Toutes les informations liées à cette organisation seront supprimées.
          </p>
          <DeleteOrganizationButton workspace={workspace} />
        </CardContent>
      </Card> 
      )}
 
  {/* --- Quitter organisation (non-admin) --- */}
      {/* {!isAdminOrOwner && (
        <Card className="shadow-sm border-[#d6e6f2] rounded-xl">
          <CardContent className="p-1 text-center">
            <p className="text-sm mb-1 text-muted-foreground">
              En quittant cette organisation, vous perdrez l'accès à ses projets, espaces de
              travail et ressources partagées.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => leaveOrganization()}
            >
              <LogOut className="size-4 mr-1" />
              Quitter l'organisation
            </Button>
            
          </CardContent>
        </Card>
      )} */}
      

      {/* Modal pour édition */}
      <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
        <EditOrganizationForm
          organization={workspace}
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </ResponsiveModal>

       {/* Modal pour Ajout un member */}
      <ResponsiveModal open={openadd} onOpenChange={handleAddMember}>
        <AddMemeberForm
          orgId={id}
          onCancel={() => setOpenadd(false)}
          onSuccess={() => setOpenadd(false)}

        />
      </ResponsiveModal>


       {/* Modal pour creation de projet */}

      <ResponsiveModal open={openFP} onOpenChange={hanldleOpenProjectForm}>
            {/* //remplecer par le id de orgnization !!!!!!!!!!!!! */}
            <CreatProjectModal open={openFP} onOpenChange={setOpenFP} canClose={true} orgid={id} />
      </ResponsiveModal>


    </div>
  );
}
