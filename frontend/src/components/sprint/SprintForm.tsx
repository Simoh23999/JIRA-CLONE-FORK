import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/sprint/sprintButton";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/sprint/sprintSelect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";
// Interface pour les données du sprint
export interface Sprint {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  objective?: string;
  status: "Actif" | "Planification" | "Terminé" | "Fermé";
  progress: number;
  tasks: {
    completed: number;
    total: number;
  };
}
import { translateSprintStatus } from "@/components/sprint/statusDisplay";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";
export type CreateSprintData = Omit<Sprint, "id" | "progress" | "tasks"> & {
  status?: Sprint["status"];
};

export type UpdateSprintData = Pick<Sprint, "id"> &
  Partial<Omit<Sprint, "id" | "progress" | "tasks">>;

// Props du composant
export interface SprintFormProps {
  mode: "create" | "edit";
  sprint?: Sprint;
  projectId: string;
  open: boolean;
  onSuccess: (sprint: Sprint) => void;
  onCancel: () => void;
}

interface ValidationErrors {
  name?: string;
  startDate?: string;
  period?: string;
  general?: string;
}

const defaultFormData = {
  name: "",
  description: "",
  startDate: "",
  period: "2 semaines",
  endDate: "",
};

const periodOptions = [
  { value: "1 semaine", label: "1 semaine", weeks: 1 },
  { value: "2 semaines", label: "2 semaines", weeks: 2 },
  { value: "3 semaines", label: "3 semaines", weeks: 3 },
  { value: "4 semaines", label: "4 semaines", weeks: 4 },
];

// Fonction pour calculer la date de fin
const calculateEndDate = (startDate: string, period: string): string => {
  if (!startDate || !period) return "";

  const start = new Date(startDate);
  const periodOption = periodOptions.find((p) => p.value === period);
  if (!periodOption) return "";

  const endDate = new Date(start);
  endDate.setDate(start.getDate() + periodOption.weeks * 7);

  return endDate.toISOString().split("T")[0];
};

export const SprintForm: React.FC<SprintFormProps> = ({
  mode,
  sprint,
  projectId,
  open,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // fonction de reset propre et isolée
  const resetFormState = useCallback(() => {
    setFormData(defaultFormData);
    setErrors({});
    setHasUnsavedChanges(false);
    setIsLoading(false);
  }, []);

  // Initialiser UNIQUEMENT à l'ouverture
  useEffect(() => {
    if (open) {
      resetFormState();

      if (mode === "edit" && sprint) {
        // calc period
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);
        const diffInDays = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        const weeks = Math.ceil(diffInDays / 7);
        const matchingPeriod = periodOptions.find((p) => p.weeks === weeks);

        setFormData({
          name: sprint.name,
          description: sprint.description || "",
          startDate: sprint.startDate,
          period: matchingPeriod ? matchingPeriod.value : "2 semaines",
          endDate: sprint.endDate,
        });
      }
    }
  }, [open, mode, sprint, resetFormState]);

  // gerer les changements de champs de manière isole
  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      setFormData((prevData) => {
        const newFormData = { ...prevData, [field]: value };

        // Calculer automatiquement la date de fin si date de debut ou periode change
        if (field === "startDate" || field === "period") {
          const endDate = calculateEndDate(
            field === "startDate" ? value : newFormData.startDate,
            field === "period" ? value : newFormData.period,
          );
          newFormData.endDate = endDate;
        }

        return newFormData;
      });

      setHasUnsavedChanges(true);

      // effacer l'erreur du champ modifie
      if (errors[field as keyof ValidationErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  // Validation des champs
  const validateForm = useCallback((): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Validation du nom
    if (!formData.name.trim()) {
      newErrors.name = "Le nom du sprint est requis";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Le nom ne peut pas dépasser 50 caractères";
    }

    // Validation de la date de début
    if (!formData.startDate) {
      newErrors.startDate = "La date de début est requise";
    } else {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (mode === "create" && startDate < today) {
        newErrors.startDate =
          "La date de début ne peut pas être antérieure à aujourd'hui";
      }
    }

    // Validation de la période
    if (!formData.period) {
      newErrors.period = "La période du sprint est requise";
    }

    return newErrors;
  }, [formData, mode]);

  // Formatage de la date pour l'input
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // soumission du formulaire avec gestion d'erreur
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        // const sprintData: UpdateSprintData = {
        //   // id: sprint?.id || `sprint-${Date.now()}`,
        //   name: formData.name.trim(),
        //   description: formData.description.trim() || undefined,
        //   startDate: formData.startDate,
        //   endDate: formData.endDate,
        //   status: sprint?.status || "Planification",
        //   progress: sprint?.progress || 0,
        //   tasks: sprint?.tasks || { completed: 0, total: 0 },
        // };
        console.log("==========> mode : ", isEditMode);
        let result;

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

        // if (isEditMode && sprint?.id) {
        if (isEditMode && sprint?.id) {
          // Modifier sprint existant
          const response = await axios.put(
            `http://localhost:9090/api/sprints/${sprint.id}`,
            {
              name: formData.name.trim(),
              description: formData.description.trim() || undefined,
              projectId: projectId,
              startDate: formData.startDate,
              endDate: formData.endDate,
              status: sprint.status,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          result = response.data;
        } else {
          // Creer nouveau sprint
          console.log("description > ", formData.description.trim());
          const response = await axios.post(
            "http://localhost:9090/api/sprints",
            {
              name: formData.name.trim(),
              description: formData.description.trim() || undefined,
              projectId: projectId,
              startDate: formData.startDate,
              endDate: formData.endDate,
            },
            {
              headers: {
                // Authorization: `Bearer ${token}`,
                Authorization: `Bearer ${token}`,
              },
            },
          );
          result = response.data;
        }
        console.log("==========> resultat : ", result);

        // reset avant succes pour eviter les conflits
        const new_result = {
          ...result,
          status: translateSprintStatus(result.status),
        };

        resetFormState();
        console.log("==========> resultat2 : ", result);
        onSuccess(new_result);
      } catch (error: any) {
        console.warn(error);
        const message =
          error.response?.data?.message ||
          error.message ||
          "Une erreur s'est produite, veuillez réessayer";
        setErrors({
          general: message,
        });
        setIsLoading(false);
      }
    },
    [formData, validateForm, sprint, onSuccess, resetFormState],
  );

  // gestion d'annulation
  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "Êtes-vous sûr de vouloir annuler ? Les modifications seront perdues.",
      );
      if (!confirmed) return;
    }

    // reset et fermeture
    resetFormState();
    onCancel();
  }, [hasUnsavedChanges, onCancel, resetFormState]);

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Modifier le Sprint" : "Créer un Sprint";
  const submitButtonText = isEditMode
    ? "Sauvegarder les modifications"
    : "Créer Sprint";

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#f7fbfc" }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditMode
              ? "Modifiez les informations de votre sprint."
              : "Créez un nouveau sprint pour organiser votre travail en itérations."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message d'erreur général */}
          {errors.general && (
            <div
              className="flex items-center gap-2 p-3 rounded-md text-sm text-red-700"
              style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}
            >
              <AlertCircle className="h-4 w-4" />
              {errors.general}
            </div>
          )}

          {/* Nom du sprint */}
          <div className="space-y-2">
            <Label htmlFor="sprint-name" className="text-gray-700">
              Nom du sprint <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sprint-name"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="Ex: Sprint 1 - Fonctionnalités principales"
              className={`${errors.name ? "border-red-500 focus:ring-red-500" : ""} text-gray-900`}
              // style={{ borderColor: errors.name ? "#ef4444" : "#d6e6f2" }}
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="sprint-description" className="text-gray-700">
              Description
            </Label>
            <Textarea
              id="sprint-description"
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Décrivez les objectifs et le contexte de ce sprint..."
              rows={3}
              style={{ borderColor: "#d6e6f2" }}
            />
          </div>

          {/* **SOLUTION LAYOUT**: Grid parfaitement équilibré pour les 3 champs */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 w-full">
              {/* Date de début */}
              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-gray-700 text-sm">
                  Date de début <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="start-date"
                    type="date"
                    value={formatDateForInput(formData.startDate)}
                    onChange={(e) =>
                      handleFieldChange("startDate", e.target.value)
                    }
                    className={`w-full ${errors.startDate ? "border-red-500" : ""} text-gray-500
                            [&::-webkit-calendar-picker-indicator]:opacity-0 
                            [&::-webkit-calendar-picker-indicator]:absolute 
                            [&::-webkit-calendar-picker-indicator]:right-0 
                            [&::-webkit-calendar-picker-indicator]:w-6 
                            [&::-webkit-calendar-picker-indicator]:h-full 
                            [&::-webkit-calendar-picker-indicator]:cursor-pointer
                    `}
                    style={{
                      borderColor: errors.startDate ? "#ef4444" : "#d6e6f2",
                    }}
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.startDate && (
                  <p className="text-xs text-red-600">{errors.startDate}</p>
                )}
              </div>

              {/* Période du sprint */}
              <div className="space-y-2">
                <Label
                  htmlFor="sprint-period"
                  className="text-gray-700 text-sm"
                >
                  Période <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.period}
                  onValueChange={(value) => handleFieldChange("period", value)}
                >
                  <SelectTrigger
                    className={`w-full ${errors.period ? "border-red-500" : ""} text-gray-500`}
                    style={{
                      borderColor: errors.period ? "#ef4444" : "#d6e6f2",
                    }}
                  >
                    <SelectValue placeholder="Durée" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {periodOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="hover:bg-gray-50"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.period && (
                  <p className="text-xs text-red-600">{errors.period}</p>
                )}
              </div>

              {/* Date de fin (calculée) */}
              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-gray-700 text-sm">
                  Date de fin
                </Label>
                <Input
                  id="end-date"
                  type="text"
                  value={
                    formData.endDate
                      ? new Date(formData.endDate).toLocaleDateString("fr-FR")
                      : ""
                  }
                  readOnly
                  disabled
                  className="w-full bg-gray-50 text-gray-600 cursor-not-allowed"
                  style={{ borderColor: "#d6e6f2", backgroundColor: "#f9fafb" }}
                  placeholder="Calculée auto"
                />
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2 pt-4">
          <Button
            type="button"
            // variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            // className="border-gray-300 hover:bg-gray-50"
            className="border border-gray-200 bg-white hover:bg-gray-100 !text-gray-900"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="text-white border-0"
            style={{ backgroundColor: "#769fcd" }}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* CSS pour masquer les icônes calendrier natives */}
      {/* <style jsx>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          width: 40px;
          height: 100%;
          cursor: pointer;
          z-index: 1;
        }

        input[type="date"]::-moz-calendar-picker {
          opacity: 0;
        }
      `}</style> */}
    </Dialog>
  );
};

export default SprintForm;
