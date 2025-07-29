"use client";

import { useState, useEffect } from "react";
import { Organization,Member,Organizer } from "@/components/organisation/types";
export const useGetWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<Organization[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simule un appel API avec délai
    const timer = setTimeout(() => {
      try {
        // Exemple de données simulées
        const data: Organization[] = [
          { id: 12, name: "Workspace 1", description: "Description 1" ,organizer: { id:2,fullName: "user 1", avatarUrl: "https://i.pravatar.cc/100?u=1" }},
          { id: 2, name: "Workspace 2", description: "Description 2" ,organizer: { id:3,fullName: "User 2", avatarUrl: "https://i.pravatar.cc/100?u=2" }},
          { id: 3, name: "Workspace 3", description: "Description 3" ,avatarUrl:"https://i.pravatar.cc/100?u=5",organizer: { id: 5,fullName: "user 3", avatarUrl: "https://i.pravatar.cc/100?u=3" }},
          {id:4 ,name:"Workspace 4" ,description:"Description 4" ,organizer:{id:7,fullName:"ismail nid"}},
          { id: 5, name: "Workspace 5", description: "Description 5" ,organizer: { id:2,fullName: "user 4", avatarUrl: "https://i.pravatar.cc/100?u=1" }},
          { id: 6, name: "Workspace 6", description: "Description 6" ,organizer: { id:3,fullName: "user 5", avatarUrl: "https://i.pravatar.cc/100?u=2" }},
          { id: 7, name: "Workspace 7", description: "Description 7" ,avatarUrl:"https://i.pravatar.cc/100?u=5",organizer: { id: 5,fullName: "user 6", avatarUrl: "https://i.pravatar.cc/100?u=3" }},
          {id:8,name:"Workspace 8" ,description:"Description 8" ,organizer:{id:7,fullName:"ismail nid"}}
        
        ];

        setWorkspaces(data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des organisations");
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { workspaces, loading, error };
};
