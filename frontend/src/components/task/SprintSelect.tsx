"use client";

import { useState } from "react";
import { 
  Calendar, 
  CheckCircle, 
  ChevronDown, 
  PlayCircle, 
  XCircle, 
  Clock,
  AlertCircle 
} from "lucide-react";
import { Sprint } from "@/features/sprint/api/use-get-sprints";

interface SprintSelectProps {
  value: string|number ;
  onValueChange: (value: string|number) => void;
  filteredSprints: Sprint[];
}

const SprintSelect: React.FC<SprintSelectProps> = ({ 
  value, 
  onValueChange, 
  filteredSprints 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedSprint = filteredSprints.find((sprint) => sprint.id === Number(value));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <PlayCircle className="w-4 h-4 text-emerald-500" />;
      case "PLANNED":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "PLANNED":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border border-green-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Actif";
      case "PLANNED":
        return "Planifié";
      case "COMPLETED":
        return "Terminé";
      case "CANCELLED":
        return "Annulé";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleSelect = (sprint: Sprint) => {
    onValueChange(sprint.id);
    setIsOpen(false);
  };

  const calculateProgress = (sprint: Sprint) => {
    if (sprint.progress !== undefined) {
      return sprint.progress;
    }
    if (sprint.tasks?.total && sprint.tasks.total > 0) {
      return Math.round((sprint.tasks.completed / sprint.tasks.total) * 100);
    }
    return 0;
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-left shadow-sm hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        {selectedSprint ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(selectedSprint.status)}
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 text-sm truncate">
                  {selectedSprint.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(selectedSprint.startDate)} → {formatDate(selectedSprint.endDate)}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500 text-sm">Sélectionner un sprint</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {filteredSprints.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-1">Aucun sprint disponible</p>
                <p className="text-xs text-gray-400">
                  Créez un sprint actif ou planifié pour ce projet
                </p>
              </div>
            ) : (
              <div className="py-2 max-h-64 overflow-y-auto">
                {filteredSprints.map((sprint) => {
                  const progress = calculateProgress(sprint);
                  
                  return (
                    <button
                      key={sprint.id}
                      type="button"
                      onClick={() => handleSelect(sprint)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                    >
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            {getStatusIcon(sprint.status)}
                            <span className="font-medium text-gray-900 text-sm truncate">
                              {sprint.name}
                            </span>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${getStatusColor(
                              sprint.status
                            )}`}
                          >
                            {getStatusLabel(sprint.status)}
                          </span>
                        </div>

                        {/* Dates */}
                        <div className="flex items-center space-x-2 text-xs text-gray-500 ml-7">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span>
                            {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="ml-7">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span className="font-medium">Progression</span>
                            <span className="font-semibold">{progress}%</span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ease-out ${
                                progress === 100
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                  : progress >= 75
                                  ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                  : progress >= 50
                                  ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                                  : "bg-gradient-to-r from-gray-400 to-gray-500"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          
                          {sprint.tasks && (
                            <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                              <span>
                                {sprint.tasks.completed} / {sprint.tasks.total} tâches
                              </span>
                              {progress > 0 && (
                                <span className="font-medium">
                                  {sprint.tasks.total - sprint.tasks.completed} restantes
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SprintSelect;