import type { Member, Organization } from "@/types/organization";
import { WorkspaceAvatar } from "./workspace-avatar";
import { Button } from "../ui/button";
import { Plus, UserPlus, Settings, MoreHorizontal, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthRole } from "@/hooks/useAuthRole";

interface WorkspaceHeaderProps {
  workspace: Organization;
  members: Member[];
  onCreateProject: (isOpen:boolean) => void;
  onInviteMember: (isOpen :boolean) => void;
}

export const WorkspaceHeader = ({
  workspace,
  members,
  onCreateProject,
  onInviteMember,
}: WorkspaceHeaderProps) => {
  const { isAdminOrOwner, isMember, userId } = useAuthRole(members);
  return (
    <div className="border-b bg-white">
      <div className="px-6 py-4">
        {/* Main Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {workspace && (
              <WorkspaceAvatar name={workspace.name} />
            )}
            
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                {workspace.name}
              </h1>
              {workspace.description && (
                <p className="text-sm text-gray-600 mt-1 max-w-md">
                  {workspace.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
           {isAdminOrOwner&&(<> <Button variant="outline" size="sm" onClick={()=>onInviteMember(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite people
            </Button>
            
            <Button size="sm"  onClick={()=>{onCreateProject(true)}}>
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
            </>
            )}
            
          </div>
        </div>

        {/* Members and Stats Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Members */}
            {members.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                 
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#f4f5f7] text-sm text-gray-700">
                    <User className="h-4 w-4 text-[#0052CC]" />
                    <span>
                      {members.length} membre{members.length > 1 ? 's' : ''}
                    </span>
                  </div>

                </span>
                
                <div className="flex -space-x-2">
                  {members.slice(0, 8).map((member, index) => (
                    <Avatar
                      key={member.userId}
                      className="h-9 w-9 border-2 border-white ring-1 ring-gray-200 hover:z-10 hover:ring-2 hover:ring-[#417fc5] transition-all duration-200 cursor-pointer"
                      title={member.fullName}
                      style={{ zIndex: members.length - index }}
                    >
                      <AvatarImage
                        src={member.avatarUrl}
                        alt={member.fullName}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-[#4684b3] to-[#417fc5] text-white hover:  ">
                        {member.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  
                  {members.length > 8 && (
                    <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white ring-1 ring-gray-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        +{members.length - 8}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
      </div>
    </div>
  );
};