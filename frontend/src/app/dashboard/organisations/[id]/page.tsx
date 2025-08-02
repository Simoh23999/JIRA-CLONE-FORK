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
import { Eye, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DeleteOrganizationButton from "@/components/organisation/Delete-Orga-Button";
import DefaultBanner from "@/components/organisation/ui/DefaultBanner"
import { ResponsiveModal } from "@/components/ResponsiveModal";
import EditOrganizationForm from "@/features/workspaces/components/update-workspace-form";
import { useEffect, useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { ca } from "zod/v4/locales";


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
  const { data: workspace, isLoading: loading, error } = useGetOrganization(id);
  const { data: members, isLoading: loadingM, error: errorM } = useGetOrganizationMembers(id);
  var isAdminOrOwner=false;

  // Trouver l'organisateur (membre avec rôle OWNER)
const organizer = members?.find((m) => m.role === "OWNER") || null;

// Filtrer les autres membres (exclure l'organisateur)
const filteredMembers = members?.filter((m) => m.role !== "OWNER") || [];

  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/auth");
    return null;
  }

if (token && members) {
  const decoded = jwtDecode<JwtPayload>(token) ;

  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.warn("Token expiré");
          localStorage.removeItem("token");
          // Rediriger vers la page de connexion
          router.push("/auth");
        } else {

  const email =decoded.email;
  const member = members.find((m) => m.email === email) || null;
  if( member?.role === "ADMIN" || member?.role === "OWNER" ){
  isAdminOrOwner =true;
  }
 }
}
 
   // State pour modal ouvert/fermé
  
   // State pour modal ouvert/fermé
  const [open, setOpen] = useState(false);
  
  if (loading) return <DashboardLoading />;
  if (error) return <p className="text-red-500">{error}</p>;


 

  
  
   // Ouvrir modal drawer pour édition
  const handleEdit = () => {
    setOpen(true);
  };

  // Fermer modal
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };
  const handleRedirect = () => router.push(`/organizations/${id}/members`);
  return (
    <div className="container mx-auto px-4 py-3 md:px-6 max-w-4xl">
      {/* --- Banner Image --- */}
      <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden shadow-sm">
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
      <Card className="mb-4 shadow-sm rounded-xl">
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
      </Card>



      {/* Suppression */}
      {isAdminOrOwner && (
      <Card className="shadow-sm border-red-200 rounded-xl">
        <CardContent className="p-3 text-center">
          <p className="text-sm mb-3">
            Toutes les informations liées à cette organisation seront supprimées.
          </p>
          <DeleteOrganizationButton workspace={workspace} />
        </CardContent>
      </Card> 
      )}

      
      {/* Modal pour tester les button*/}
     {isAdminOrOwner && ( 
      <div>
      {/* <Button variant="primary">
        Button1  
      </Button>
      <Button variant="secondary">
        Button2
      </Button> */}
      </div>
     )}
{/* 
      <Button variant="ghost">
        Button3
      </Button>
      <Button variant="destructive">
        Button4
      </Button>
      <Button variant="outline">
        Button5
      </Button>
      <Button variant="muted">
        Button6
      </Button>
      <Button variant="tertiary">
        Button7
      </Button> */}
      

      {/* Modal pour édition */}
      <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
        <EditOrganizationForm
          organization={workspace}
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </ResponsiveModal>



    </div>
  );
}
