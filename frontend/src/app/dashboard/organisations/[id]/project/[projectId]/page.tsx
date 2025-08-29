// app/organisations/[organisationId]/project/[projectId]/page.tsx
"use client"

import BackButton from "@/components/back-button";
import AddMemeberForm from "@/components/Members/add-member-form";
import { WorkspaceHeader } from "@/components/organisation/Organization-header";
import CreatProjectModal from "@/components/project/create-project-modal";
import ProjectDetails from "@/components/project/ProjectDetails";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Separator } from "@/components/ui/separator";
import { useGetProjectById } from "@/features/project/api/use-get-project";
import { useGetProjectMembers } from "@/features/project/api/use-get-project-members";
import { useGetOrganization, useGetOrganizationMembers} from "@/features/workspaces/api/use-get-workspace";
import { useParams } from "next/navigation";
import { useState } from "react";



export default function ProjectPage() {
     const params =useParams();
     const organisationId=Number(params.id);
     const projectId = params.projectId as string | number;
     const { data: project } = useGetProjectById(projectId);
     
     const { data: workspace, isLoading: loading ,error} = useGetOrganization(organisationId);
     const { data: members} = useGetProjectMembers(projectId);
     const { data: memberORG} = useGetOrganizationMembers(organisationId);
     const [openFP, setOpenFP] = useState(false);
     const [openadd, setOpenadd] = useState(false);

  const hanldleOpenProjectForm = (isOpen: boolean) => {
    setOpenFP(isOpen);
  }

   const handleAddMember = (isOpen: boolean) => {
    setOpenadd(isOpen);
  };

  return (
    

     <div className="space-y-8">
      <BackButton />
      {workspace && (
        <WorkspaceHeader
          workspace={workspace as any}
          members={(memberORG || []).map(member => ({
            ...member,
            userId: typeof member.userId === 'string' ? parseInt(member.userId, 10) : member.userId
          }))}
          onCreateProject={()=>{hanldleOpenProjectForm(true)}}
          onInviteMember={()=>{handleAddMember(true)} }        />
      )}
      {/* <Separator className="p-2"></Separator> */}
      {project ? (
      <ProjectDetails project={project} member={members ?? []} />
    ) : 
    

    (
  <div className="flex flex-col items-center justify-center h-64 border-2 border-[#1D71B8] rounded-lg  p-6">
  <svg
    className="w-12 h-12 text-[#1D71B8] mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
    />
  </svg>
  <h2 className="text-xl font-semibold text-[#142D5C] mb-2">Accès refusé</h2>
  <p className="text-sm text-[#1D71B8] text-center">
    Vous n'êtes pas membre de ce projet et ne pouvez pas voir son contenu.
  </p>
</div>

)
    
    }


     {/* Modal pour Ajout un member */}
      <ResponsiveModal open={openadd} onOpenChange={handleAddMember}>
        <AddMemeberForm
          orgId={organisationId}
          onCancel={() => setOpenadd(false)}
          onSuccess={() => setOpenadd(false)}

        />
      </ResponsiveModal>
      
    {/* Modal pour creation de projet */}
   <ResponsiveModal open={openFP} onOpenChange={hanldleOpenProjectForm}>
          
            <CreatProjectModal open={openFP} onOpenChange={setOpenFP} canClose={true} orgid={organisationId} />
      </ResponsiveModal>
    </div>
  );
}
