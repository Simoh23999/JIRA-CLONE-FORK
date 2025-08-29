"use client";

import Image from "next/image";
import RequireAuth from "@/components/RequireAuth";
import { useEffect, useState, useMemo } from "react";
import { useGetProjects } from "@/features/project/api/use-get-project";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useGetOrganizationMembers } from "@/features/workspaces/api/use-get-workspace";
import { useOrganization } from "../context/OrganizationContext";
import { useGetTasksByProject, useGetTotalTasksByProjects } from "@/features/tasks/api/use-get-tasks2";

const dashboardFeatures = [
  {
    title: "Vue d'ensemble des projets",
    description: "Accédez rapidement à tous vos projets et visualisez leur progression.",
    icon: "/icon/project.png",
    color: "bg-[#1B365D]", // Bleu foncé du logo
    hoverColor: "hover:bg-[#2B4A6D]"
  },
  {
    title: "Gestion des membres",
    description: "Ajoutez, supprimez ou gérez les membres de votre organisation.",
    icon: "/icon/team.png",
    color: "bg-[#2563EB]", // Bleu moyen du logo
    hoverColor: "hover:bg-[#3B73FB]"
  },
  {
    title: "Tâches et sprints",
    description: "Créez, assignez et suivez les tâches de chaque projet.",
    icon: "/icon/task&sprint.png",
    color: "bg-[#1E40AF]", // Bleu intermédiaire du logo
    hoverColor: "hover:bg-[#2E50BF]"
  },
  {
    title: "Gestion des organisations",
    description: "Créez, gérez et configurez vos organisations et espaces de travail.",
    icon: "/icon/workspace.png",
    color: "bg-[#3B82F6]", // Bleu clair du logo
    hoverColor: "hover:bg-[#4B92F6]"
  },
];

function getUserNameFromToken() {
  if (typeof window === "undefined") return "";
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username || "";
  } catch {
    return "";
  }
}

function formatDateFr(date: Date) {
  return date.toLocaleDateString("fr-FR", { 
    weekday: "long", 
    day: "numeric", 
    month: "long",
    year: "numeric"
  });
}

function DashboardHelloBanner() {
  const [username, setUsername] = useState("");
  const [today, setToday] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setUsername(getUserNameFromToken());
    const now = new Date();
    setToday(formatDateFr(now));
    setCurrentTime(now.toLocaleTimeString("fr-FR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    }));
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    // if (hour < 12) return "Bonjour";
    // if (hour < 17) return "Bon après-midi";
    return "Bonjour";
  };

  return (
    <div className="w-full rounded-lg mb-6 p-6 bg-gradient-to-r from-[#1B365D] to-[#3B82F6] text-white relative overflow-hidden shadow-lg">
      {/* Motif de fond TaskFlow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-lg bg-white transform translate-x-16 -translate-y-16 rotate-12"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-lg bg-white transform -translate-x-12 translate-y-12 rotate-45"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded bg-white transform rotate-12 opacity-5"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-sm text-blue-100 mb-1">
            {today} • {currentTime}
          </div>
          <div className="text-2xl md:text-3xl font-semibold">
            {getGreeting()}, {username || "Utilisateur"}
          </div>
          <div className="text-blue-100 mt-1 text-sm">
            Bienvenue dans votre espace de travail TaskFlow
          </div>
        </div>
        
        <div className="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 rounded-lg backdrop-blur-sm">
          <Image 
            src="/TaskFlowIcon.png" 
            alt="TaskFlow Logo" 
            width={50} 
            height={50}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { organization } = useOrganization();
  const workspaceId = organization?.id;
  
  const { data: projects } = useGetProjects(workspaceId || "");
  const { data: members } = useGetOrganizationMembers(workspaceId || "");
  const { data: workspaces } = useGetWorkspaces();

  // Récupérer le nombre total de tâches pour tous les projets de l'organisation
  const projectIds = projects?.map((p) => p.id) || [];
  const { data: totalTasks, isLoading: loadingTasks } = useGetTotalTasksByProjects(projectIds);

  const stats = [
    { 
      label: "Projets", 
      value: projects?.length || 0, 
      icon: "/icon/project.png",
      color: "text-[#1B365D]", // Bleu foncé du logo
      bgColor: "bg-[#1B365D]/10",
      description: "projets actifs"
    },
    { 
      label: "Membres", 
      value: members?.length || 0, 
      icon: "/icon/team.png",
      color: "text-[#2563EB]", // Bleu moyen du logo
      bgColor: "bg-[#2563EB]/10",
      description: "membres dans l'organisation"
    },
    { 
      label: "Tâches en cours", 
      value: loadingTasks ? "..." : totalTasks ?? 0, 
      icon: "/icon/task&sprint.png",
      color: "text-[#1E40AF]", // Bleu intermédiaire du logo
      bgColor: "bg-[#1E40AF]/10",
      description: "tâches en progression"
    },
    { 
      label: "Organisations", 
      value: workspaces?.length || 0, 
      icon: "/icon/workspace.png",
      color: "text-[#3B82F6]", // Bleu clair du logo
      bgColor: "bg-[#3B82F6]/10",
      description: "espaces de travail"
    },
  ];

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <DashboardHelloBanner />
          
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {stat.description}
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Image 
                      src={stat.icon} 
                      alt={stat.label} 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fonctionnalités principales */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-1 h-6 bg-[#3B82F6] rounded mr-3"></div>
              Fonctionnalités principales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-[#3B82F6] hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform`}>
                      <Image 
                        src={feature.icon} 
                        alt={feature.title} 
                        width={24} 
                        height={24}
                        className="object-contain filter brightness-0 invert"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#1B365D] transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-6 h-6 text-gray-400 group-hover:text-[#3B82F6] transition-colors">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section récente activité */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-1 h-6 bg-[#3B82F6] rounded mr-3"></div>
              Activité récente
            </h3>
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 bg-[#3B82F6]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm">Aucune activité récente à afficher</p>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}