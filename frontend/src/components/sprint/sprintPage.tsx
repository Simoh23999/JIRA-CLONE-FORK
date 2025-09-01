"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  MoreHorizontal,
  PlayCircle,
  StopCircle,
  Edit3,
  Eye,
  Calendar,
  Target,
  TrendingUp,
  TableOfContents,
  XCircle,
} from "lucide-react";
import SprintForm, {
  Sprint as SprintType,
} from "@/components/sprint/SprintForm";
// import { Button } from "@/components/sprint/sprintButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/sprint/sprintCard";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/sprint/sprintSelect";
import axios from "axios";
import { translateSprintStatus } from "@/components/sprint/statusDisplay";
import { useToast } from "../../hooks/useToast";
import { Toast } from "../../components/ui/Toast";
import { JwtPayload } from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";
import { jwtDecode } from "jwt-decode";
import { queryClient } from "@/app/ReactQueryProvider";

interface Sprint {
  id: string;
  name: string;
  status: "Actif" | "Planification" | "Terminé" | "Fermé";
  startDate: string;
  endDate: string;
  progress: number;
  tasks: {
    completed: number;
    total: number;
  };
}

const mockSprints: Sprint[] = [
  {
    id: "1",
    name: "Sprint 1 - Fondation",
    status: "Actif",
    startDate: "2024-01-15",
    endDate: "2024-01-29",
    progress: 65,
    tasks: { completed: 13, total: 20 },
  },
  {
    id: "2",
    name: "Sprint 2 - Fonctionnalités principales",
    status: "Planification",
    startDate: "2024-01-30",
    endDate: "2024-02-13",
    progress: 0,
    tasks: { completed: 0, total: 25 },
  },
  {
    id: "3",
    name: "Sprint 3 - Autre",
    status: "Terminé",
    startDate: "2024-01-01",
    endDate: "2024-01-14",
    progress: 100,
    tasks: { completed: 18, total: 18 },
  },
  {
    id: "4",
    name: "Sprint 4 - Autre",
    status: "Fermé",
    startDate: "2024-01-01",
    endDate: "2024-01-14",
    progress: 100,
    tasks: { completed: 18, total: 18 },
  },
];

const getStatusBadgeClasses = (status: Sprint["status"]) => {
  switch (status) {
    case "Actif":
      return "bg-green-100 text-green-800 border-green-200 font-semibold";
    case "Planification":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Terminé":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "Fermé":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status: Sprint["status"]) => {
  switch (status) {
    case "Actif":
      return "bg-green-500";
    case "Planification":
      return "bg-blue-500";
    case "Terminé":
      return "bg-blue-600";
    case "Fermé":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

const SprintCard: React.FC<{
  sprint: Sprint;
  isProjectOwner: boolean;
  onEdit: (sprint: Sprint) => void;
  onClose?: (sprint: Sprint) => void;
  onStart?: (sprint: Sprint) => void;
  onFinish?: (sprint: Sprint) => void;
}> = ({ sprint, isProjectOwner, onEdit, onClose, onStart, onFinish }) => {
  const formatDate = (dateString: string) => {
    // return new Date(dateString).toLocaleDateString("en-US", {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(sprint.status)}`}
            />
            <h3 className="font-semibold text-lg text-gray-900">
              {sprint.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClasses(sprint.status)}`}
            >
              {sprint.status}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  // variant="ghost"
                  // size="sm"
                  className="h-4 w-4 p-3 opacity-0 group-hover:opacity-100 bg-white hover:bg-[#B7D1E6] border-0"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-900" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border border-gray-200 shadow-lg"
              >
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir les détails
                </DropdownMenuItem>
                {isProjectOwner && (
                  <>
                    <DropdownMenuItem onClick={() => onEdit(sprint)}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Modifier le sprint
                    </DropdownMenuItem>
                    {sprint.status === "Planification" && (
                      <DropdownMenuItem onClick={() => onStart?.(sprint)}>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Démarrer le sprint
                      </DropdownMenuItem>
                    )}
                    {sprint.status === "Actif" && (
                      <>
                        <DropdownMenuItem onClick={() => onFinish?.(sprint)}>
                          <StopCircle className="mr-2 h-4 w-4" />
                          Terminer le sprint
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onClose?.(sprint)}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Fermer le sprint
                        </DropdownMenuItem>
                      </>
                    )}
                    {sprint.status === "Fermé" && (
                      <DropdownMenuItem onClick={() => onStart?.(sprint)}>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Démarrer le sprint
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progression</span>
            <span className="font-medium text-gray-900">
              {sprint.progress}%
            </span>
          </div>
          <div className="w-full bg-[#B7D1E6] rounded-full h-2">
            <div
              className="bg-[#769ACA] h-2 rounded-full transition-all duration-300"
              style={{ width: `${sprint.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-gray-600" />
            <span className="text-gray-600">Tâches:</span>
          </div>
          {/* <span className="font-medium text-gray-900">
            {sprint.tasks.completed}/{sprint.tasks.total}
          </span> */}
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState: React.FC<{
  // sprint: Sprint;
  onCreate: () => void;
}> = ({ onCreate }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-24 h-24 bg-[#D9E5EE] rounded-full flex items-center justify-center mb-6">
      <Target className="h-12 w-12 text-[#769ACA]" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Aucun sprint pour le moment
    </h3>
    <p className="text-gray-600 mb-6 max-w-md">
      Les sprints vous aident à organiser votre travail en itérations définies
      dans le temps. Créez votre premier sprint pour commencer la gestion de
      projet agile.
    </p>
    <Button
      className="bg-[#769ACA] hover:bg-[#799DCB] text-white"
      onClick={onCreate}
    >
      <Plus className="mr-2 h-4 w-4" />
      Créer votre premier sprint
    </Button>
  </div>
);
interface SprintPageProps {
  title: string;
  isProjectOwner: boolean;
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}
export default function SprintPage({
  title,
  isProjectOwner,
  onTaskClick,
  isFullWidth = false,
}: SprintPageProps) {
  const params = useParams();
  const { toast, showToast } = useToast();
  const projectId = params.projectId as string || params.id as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sprintFormOpen, setSprintFormOpen] = useState(false);
  const [sprintFormMode, setSprintFormMode] = useState<"create" | "edit">(
    "create",
  );
  const [selectedSprint, setSelectedSprint] = useState<Sprint | undefined>();
  //   const [sprints, setSprints] = useState<Sprint[]>(mockSprints);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  //   useEffect(() => {
  //     console.log("====|> State sprints mis à jour:", sprints);
  //     // setSprints(sprints);
  //   }, [sprints]);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        setLoading(true);
        const storedToken =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        let token = storedToken;
        if (token) {
          try {
            const decoded = jwtDecode<JwtPayload>(token);

            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
              token = await refreshToken();
            }
          } catch (error) {
            console.error("Invalid token:", error);
            token = await refreshToken();
          }
        } else {
          token = await refreshToken();
        }

        const response = await axios.get(
          `http://localhost:9090/api/sprints/project/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        //   console.log("raw response ",response);
        console.log("====|> Sprints fetched:", response);
        console.log("response : ", response.data);
        const new_sprints =
          response.data.map((sprint: Sprint) => ({
            ...sprint,
            status: translateSprintStatus(sprint.status),
          })) || [];

        setSprints(new_sprints);
        // setSprints(response.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des sprints:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchSprints();
    }
  }, [projectId]);

  // Fonctions de gestion du SprintForm
  const handleCreateSprint = () => {
    setSprintFormMode("create");
    setSelectedSprint(undefined);
    setSprintFormOpen(true);
  };

  const handleEditSprint = (sprint: Sprint) => {
    setSprintFormMode("edit");
    setSelectedSprint(sprint);
    setSprintFormOpen(true);
  };

  const handleStartSprint = async (sprint: Sprint) => {
    console.log("sprint id", sprint.id);
    try {
      const storedToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      let token = storedToken;
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);

          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            token = await refreshToken();
          }
        } catch (error) {
          console.error("Invalid token:", error);
          token = await refreshToken();
        }
      } else {
        token = await refreshToken();
      }
      await axios.patch(
        `http://localhost:9090/api/sprints/${sprint.id}/start`,
        {},
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      queryClient.invalidateQueries({ queryKey: ["sprints", "project", projectId] });
      setSprints((prevSprints) =>
        prevSprints.map((s) =>
          s.id === sprint.id ? { ...s, status: "Actif" as const } : s,
        ),
      );
    } catch (error: any) {
      console.error("Erreur lors du démarrage du sprint:", error);
      showToast("error", error.message);
      // khas toast hna
    }
  };

  const handleFinishSprint = async (sprint: Sprint) => {
    try {
      const storedToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      let token = storedToken;
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);

          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            token = await refreshToken();
          }
        } catch (error) {
          console.error("Invalid token:", error);
          token = await refreshToken();
        }
      } else {
        token = await refreshToken();
      }
      await axios.patch(
        `http://localhost:9090/api/sprints/${sprint.id}/complete`,
        {},
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSprints((prevSprints) =>
        prevSprints.map((s) =>
          s.id === sprint.id ? { ...s, status: "Terminé" as const } : s,
        ),
      );
      queryClient.invalidateQueries({ queryKey:  ["sprints", "project", projectId] });
      queryClient.invalidateQueries({ queryKey:  ["sprints", "project"] });
    } catch (error: any) {
      console.error("Erreur lors de la finalisation du sprint:", error);
      showToast("error", error.message);
      // ta hna
    }
  };

  const handleCloseSprint = async (sprint: Sprint) => {
    try {
      const storedToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      let token = storedToken;
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);

          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            token = await refreshToken();
          }
        } catch (error) {
          console.error("Invalid token:", error);
          token = await refreshToken();
        }
      } else {
        token = await refreshToken();
      }
      await axios.patch(
        `http://localhost:9090/api/sprints/${sprint.id}/cancel`,
        {},
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSprints((prevSprints) =>
        prevSprints.map((s) =>
          s.id === sprint.id ? { ...s, status: "Fermé" as const } : s,
        ),
      );
      queryClient.invalidateQueries({ queryKey:  ["sprints", "project", projectId] });
      queryClient.invalidateQueries({ queryKey:  ["sprints", "project"] });
    } catch (error: any) {
      console.error("Erreur lors de la fermeture du sprint:", error);
      showToast("error", error.message);
      // ta hnaa
    }
  };

  const handleSprintFormSuccess = (sprintData: SprintType) => {
    console.log("sprintFormMode:", sprintFormMode);
    console.log("sprint data:", sprintData);
    console.log("sprints avant:", sprints);
    if (sprintFormMode === "create") {
      // setSprints((prev) => [...prev, sprintData]);
      setSprints((prev) => {
        const newSprints = [...prev, sprintData];
        console.log("sprints après:", newSprints);
        return newSprints;
      });
      console.log("sprints apres:", sprints);
    } else {
      setSprints((prev) =>
        prev.map((s) => (s.id === sprintData.id ? sprintData : s)),
      );
    }
    console.log("sprints ======:", sprints);
    setSprintFormOpen(false);
    setSelectedSprint(undefined);
  };

  const handleSprintFormCancel = () => {
    setSprintFormOpen(false);
    setSelectedSprint(undefined);
  };

  // const filteredSprints = mockSprints.filter((sprint) => {
  //   const matchesSearch = sprint.name
  //     .toLowerCase()
  //     .includes(searchQuery.toLowerCase());
  //   const matchesStatus =
  //     statusFilter === "all" ||
  //     sprint.status.toLowerCase() === statusFilter.toLowerCase();
  //   return matchesSearch && matchesStatus;
  // });

  const filteredSprints = sprints
    .filter((sprint) => {
      const matchesSearch = sprint.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        sprint.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          // Tri alphabétique par nom
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());

        case "status":
          // Tri par statut avec ordre de priorité logique
          const statusOrder: Record<string, number> = {
            actif: 1, // Sprints en cours
            planification: 2, // Sprints à venir
            terminé: 3, // Sprints finis
            fermé: 4, // Sprints archivés
          };
          const aOrder = statusOrder[a.status.toLowerCase()] || 999;
          const bOrder = statusOrder[b.status.toLowerCase()] || 999;
          return aOrder - bOrder;

        case "progress":
          // Tri par progression (du plus élevé au plus faible)
          return (b.progress || 0) - (a.progress || 0);

        case "date":
        default:
          // Tri par date de début du sprint (du plus récent au plus ancien)
          const dateA = new Date(a.startDate || 0);
          const dateB = new Date(b.startDate || 0);
          return dateB.getTime() - dateA.getTime();
      }
    });

  const activeSprints = sprints.filter((s) => s.status === "Actif").length;
  const completedSprints = sprints.filter((s) => s.status === "Terminé").length;
  const totalSprints = sprints.length;
  //   const totalTasks = sprints.reduce(
  //     (sum, sprint) => sum + sprint.tasks.total,
  //     0,
  //   );

  console.log(">>>>>>>>>>>>> role dans sprint : ", isProjectOwner);
  return (
    <div className="min-h-screen bg-slate-50">
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => {}} />
      )}
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {/* <nav className="text-sm text-gray-600 mb-2">
                <span>Projets</span>
                <span className="mx-2">/</span>
                <span>Application Web</span>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">Sprints</span>
              </nav> */}
              <h1 className="text-3xl font-bold text-gray-900">
                Sprints du projet
              </h1>
            </div>
            {isProjectOwner && (
              <Button
                className="bg-[#769ACA] hover:bg-[#799DCB] text-white font-medium"
                onClick={handleCreateSprint}
              >
                <Plus className="mr-2 h-4 w-4" />
                Créer un sprint
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#65748A] mb-1">
                    Total des sprints
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalSprints}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#D9E5EE] rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-[#769ACA] " />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#65748A] mb-1">Sprints actifs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {activeSprints}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#65748A] mb-1">
                    Sprints terminés
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {completedSprints}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#F1F4F8] rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[#799DCB]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#65748A] mb-1">
                    Total des tâches
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {/* {totalTasks} */}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#F0F6FB] rounded-lg flex items-center justify-center">
                  <TableOfContents className="h-6 w-6 text-[#799DCB]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher des sprints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:ring-[#769ACA] text-gray-900"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white border-gray-200 focus:border-[#B7D1E6] focus:ring-[#769ACA] text-gray-900">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="all" className="hover:bg-[#B7D1E6]">
                Tous les statuts
              </SelectItem>
              <SelectItem value="actif" className="">
                Actif
              </SelectItem>
              <SelectItem value="planification" className="hover:bg-[#B7D1E6]">
                Planification
              </SelectItem>
              <SelectItem value="terminé" className="hover:bg-[#B7D1E6]">
                Terminé
              </SelectItem>
              <SelectItem value="fermé" className="hover:bg-[#B7D1E6]">
                Fermé
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40 bg-white border-gray-200 focus:border-[#B7D1E6] focus:ring-[#769ACA] text-gray-900">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="date" className="hover:bg-[#B7D1E6]">
                Date
              </SelectItem>
              <SelectItem value="name" className="hover:bg-[#B7D1E6]">
                Nom
              </SelectItem>
              <SelectItem value="status" className="hover:bg-[#B7D1E6]">
                Statut
              </SelectItem>
              <SelectItem value="progress" className="hover:bg-[#B7D1E6]">
                Progression
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sprint Cards */}
        {filteredSprints.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                isProjectOwner={isProjectOwner}
                onEdit={handleEditSprint}
                onClose={handleCloseSprint}
                onStart={handleStartSprint}
                onFinish={handleFinishSprint}
              />
            ))}
          </div>
        ) : sprints.length === 0 ? (
          <EmptyState onCreate={handleCreateSprint} />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600">
              Aucun sprint ne correspond à vos filtres actuels.
            </p>
          </div>
        )}
      </div>
      {/* Modal SprintForm */}
      <SprintForm
        mode={sprintFormMode}
        sprint={selectedSprint}
        projectId={projectId}
        open={sprintFormOpen}
        onSuccess={handleSprintFormSuccess}
        onCancel={handleSprintFormCancel}
      />
    </div>
  );
}
