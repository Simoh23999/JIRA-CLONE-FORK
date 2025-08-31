import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar, Plus, Search, Filter, MoreHorizontal } from "lucide-react";

// Utilise l'interface Sprint de l'API
export interface Sprint {
  id: string | number;
  name: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  startDate: string;
  endDate: string;
  progress?: number;
  tasks?: {
    completed: number;
    total: number;
  };
}

export function SprintTimeline({ sprints = [] }: { sprints?: Sprint[] }) {
  const [currentView, setCurrentView] = useState<'Today' | 'Weeks' | 'Months' | 'Quarters'>('Months');
  const [currentDate, setCurrentDate] = useState(new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Générer les colonnes de dates selon la vue
  const generateDateColumns = () => {
    const columns = [];
    const startDate = new Date(currentDate);

    if (currentView === 'Months') {
      startDate.setDate(1); // Premier jour du mois
      for (let i = 0; i < 90; i++) { // 3 mois de colonnes
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        columns.push({
          date: date.toISOString().split('T')[0],
          day: date.getDate(),
          month: date.toLocaleDateString('fr-FR', { month: 'short' }),
          isFirstOfMonth: date.getDate() === 1,
          isToday: date.toDateString() === new Date().toDateString()
        });
      }
    }
    return columns;
  };

  const dateColumns = generateDateColumns();

  // Calculer la position et largeur d'un sprint
  const getSprintPosition = (sprint: Sprint) => {
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const firstColumnDate = new Date(dateColumns[0]?.date || '');

    const startIndex = Math.max(0, Math.floor((startDate.getTime() - firstColumnDate.getTime()) / (1000 * 60 * 60 * 24)));
    const endIndex = Math.floor((endDate.getTime() - firstColumnDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const width = Math.max(endIndex - startIndex, 1) * 40; // 40px par jour
    const left = startIndex * 40;

    return { left, width };
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (currentView === 'Months') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getSprintColor = (sprint: Sprint) => {
    const progress = sprint.progress ?? (
      sprint.tasks && sprint.tasks.total > 0
        ? (sprint.tasks.completed / sprint.tasks.total) * 100
        : 0
    );
    if (progress === 100) return 'bg-emerald-500';
    if (progress > 50) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      {/* Header avec contrôles */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search timeline..."
              className="border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded text-sm hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Status category
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation temporelle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {(['Today', 'Weeks', 'Months', 'Quarters'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                  currentView === view
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {/* Navigation dates */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-1.5 hover:bg-slate-100 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="p-1.5 hover:bg-slate-100 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline principale */}
      <div className="relative">
        {/* Navigation scroll */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 hover:bg-slate-50 transition-colors border border-slate-200"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 hover:bg-slate-50 transition-colors border border-slate-200"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>

        {/* Conteneur scrollable */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="relative" style={{ minWidth: `${dateColumns.length * 40}px` }}>
            {/* Header calendrier */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
              {/* Ligne des mois */}
              <div className="flex h-10 items-center bg-slate-50">
                <div className="w-48 flex-shrink-0 px-4 text-sm font-medium text-slate-700 border-r border-slate-200">
                  Work
                </div>
                <div className="flex">
                  {dateColumns.map((col, idx) => (
                    col.isFirstOfMonth && (
                      <div
                        key={`month-${idx}`}
                        className="px-4 py-2 text-sm font-medium text-slate-700 border-r border-slate-200"
                        style={{
                          width: `${dateColumns.slice(idx).findIndex((c, i) => i > 0 && c.isFirstOfMonth) * 40 || (dateColumns.length - idx) * 40}px`,
                          minWidth: '80px'
                        }}
                      >
                        {col.month}
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Ligne des jours */}
              <div className="flex h-8 items-center">
                <div className="w-48 flex-shrink-0 px-4 border-r border-slate-200" />
                <div className="flex">
                  {dateColumns.map((col, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-8 flex items-center justify-center text-xs border-r border-slate-100 transition-colors ${
                        col.isToday
                          ? 'bg-blue-100 text-blue-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {col.day}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Sprints */}
            <div className="relative">
              {/* Label Sprints */}
              <div className="flex h-12 items-center bg-slate-25 border-b border-slate-200">
                <div className="w-48 flex-shrink-0 px-4 text-sm font-semibold text-slate-700 border-r border-slate-200 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-slate-400 hover:text-blue-500 cursor-pointer" />
                  Sprints
                </div>
              </div>

              {/* Ligne des sprints */}
              <div className="relative min-h-24 border-b border-slate-200">
                <div className="absolute inset-0 flex">
                  <div className="w-48 flex-shrink-0 border-r border-slate-200" />
                  {/* Grille de fond */}
                  <div className="flex flex-1">
                    {dateColumns.map((_, idx) => (
                      <div key={idx} className="w-10 border-r border-slate-100 h-full" />
                    ))}
                  </div>
                </div>

                {/* Sprints positionnés */}
                <div className="absolute inset-0 flex">
                  <div className="w-48 flex-shrink-0" />
                  <div className="relative flex-1">
                    {sprints.length === 0 ? (
                      <div className="flex items-center justify-center h-20 text-slate-400 text-sm">
                        Aucun sprint disponible
                      </div>
                    ) : (
                      sprints.map((sprint) => {
                        const { left, width } = getSprintPosition(sprint);
                        const progress = sprint.progress ?? (
                          sprint.tasks && sprint.tasks.total > 0
                            ? (sprint.tasks.completed / sprint.tasks.total) * 100
                            : 0
                        );

                        return (
                          <div
                            key={sprint.id}
                            className={`absolute top-2 h-8 rounded-md shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 group ${getSprintColor(sprint)}`}
                            style={{ left: `${left}px`, width: `${width}px`, minWidth: '120px' }}
                            title={`${sprint.name} (${formatDateRange(sprint.startDate, sprint.endDate)})`}
                          >
                            {/* Barre de progression */}
                            <div
                              className="absolute inset-0 bg-white/20 rounded-md transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />

                            {/* Contenu du sprint */}
                            <div className="relative h-full flex items-center px-3 text-white">
                              <span className="text-xs font-medium truncate">
                                {sprint.name}
                              </span>
                              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-3 h-3" />
                              </div>
                            </div>

                            {/* Tooltip au hover */}
                            <div className="absolute top-10 left-0 bg-slate-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                              {sprint.name}<br />
                              {formatDateRange(sprint.startDate, sprint.endDate)}<br />
                              {sprint.tasks?.total || 0} tâche{(sprint.tasks?.total || 0) !== 1 ? 's' : ''} • {Math.round(progress)}% terminé
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Bouton Create Epic */}
              <div className="flex h-12 items-center bg-slate-25">
                <div className="w-48 flex-shrink-0 px-4 border-r border-slate-200">
                  <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                    <Plus className="w-4 h-4" />
                    Create Epic
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline controls en bas */}
      <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-4">
          <button
            onClick={scrollLeft}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </button>

          <div className="text-sm text-slate-600">
            {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </div>

          <button
            onClick={scrollRight}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Vue :</span>
          <div className="flex items-center gap-1 bg-white rounded-md border border-slate-200 p-1">
            {(['Today', 'Weeks', 'Months', 'Quarters'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                  currentView === view
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Fonction utilitaire pour formater les plages de dates
function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return `${start.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}`;
}