"use client";

import { useState } from "react";
import { Calendar, CheckCircle, ChevronDown, PlayCircle, XCircle } from "lucide-react";

export interface Sprint {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: number;
  tasks: { completed: number; total: number };
}

interface SprintSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  filteredSprints: Sprint[];
}

const SprintSelect: React.FC<SprintSelectProps> = ({ value, onValueChange, filteredSprints }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedSprint = filteredSprints.find((sprint) => sprint.id === value);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Actif":
        return <PlayCircle className="w-4 h-4 text-emerald-500" />;
      case "Planification":
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case "Terminé":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Fermé":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Planification":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Terminé":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Fermé":
        return "bg-gray-50 text-gray-700 border border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    });
  };

  const handleSelect = (sprint: Sprint) => {
    onValueChange(sprint.id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-left shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        {selectedSprint ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(selectedSprint.status)}
              <div>
                <div className="font-medium text-gray-900 text-sm">{selectedSprint.name}</div>
                <div className="text-xs text-gray-500">
                  {formatDate(selectedSprint.startDate)} → {formatDate(selectedSprint.endDate)}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Choisir un sprint</span>
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
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="py-2">
            {filteredSprints.map((sprint) => (
              <button
                key={sprint.id}
                type="button"
                onClick={() => handleSelect(sprint)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
              >
                <div className="space-y-2">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(sprint.status)}
                      <span className="font-medium text-gray-900 text-sm">{sprint.name}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                        sprint.status
                      )}`}
                    >
                      {sprint.status}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center space-x-2 text-xs text-gray-500 ml-7">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="ml-7">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progression</span>
                      <span className="font-medium">{sprint.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          sprint.progress === 100
                            ? "bg-emerald-500"
                            : sprint.progress > 50
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${sprint.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                      <span>
                        {sprint.tasks.completed}/{sprint.tasks.total} tâches
                      </span>
                      <span>
                        {Math.round((sprint.tasks.completed / sprint.tasks.total) * 100)}% terminé
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintSelect;
