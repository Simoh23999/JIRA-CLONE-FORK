"use client";

import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { CheckCircle, CircleAlert, Clock, PlusCircle } from "lucide-react";
import React from "react";
import {
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface ProjectSummaryProps {
  tasks: Task[];
}

export default function ProjectSummary({ tasks }: ProjectSummaryProps) {
  const now = new Date();
  const last7Days = (dateStr: string) =>
    new Date(dateStr).getTime() > now.getTime() - 7 * 24 * 60 * 60 * 1000;

  const completed = tasks.filter(
    (t) => t.status === "DONE" && last7Days(t.updatedAt),
  ).length;
  const updated = tasks.filter((t) => last7Days(t.updatedAt)).length;
  const created = tasks.filter((t) => last7Days(t.createdAt)).length;
  const dueSoon = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    return due > now && due.getTime() < now.getTime() + 7 * 24 * 60 * 60 * 1000;
  }).length;

  const tasksByStatus = (["DONE", "INPROGRESS"] as TaskStatus[]).map(
    (status: TaskStatus) => ({
      name: status === "DONE" ? "Terminées" : "En cours",
      value: tasks.filter((t) => t.status === status).length,
    }),
  );

  // Couleurs modernes avec dégradés
  const statusColors = [
    "#10B981", // Emerald pour terminées
    "#3B82F6", // Blue pour en cours
  ];

  // Fonction pour le rendu personnalisé des labels
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value} tâche{payload[0].value > 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Cartes Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl shadow flex items-center space-x-4">
          <CheckCircle className="text-green-500 text-3xl" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{completed}</span>
            <span className="text-sm text-gray-500">
              Complétées 
            </span>
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow flex items-center space-x-4">
          <Clock className="text-blue-500 text-3xl" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{updated}</span>
            <span className="text-sm text-gray-500">
              Mises à jour 
            </span>
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow flex items-center space-x-4">
          <PlusCircle className="text-yellow-500 text-3xl" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{created}</span>
            <span className="text-sm text-gray-500">
              Créées 
            </span>
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow flex items-center space-x-4">
          <CircleAlert className="text-red-500 text-3xl" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{dueSoon}</span>
            <span className="text-sm text-gray-500">À échéance bientôt</span>
          </div>
        </div>
      </div>

      {/* Diagramme Statut Moderne */}
      <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Statut des tâches</h3>
          <p className="text-sm text-gray-600">
            Répartition visuelle de vos tâches par statut
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Graphique */}
          <div className="flex-1" style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={tasksByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={3}
                >
                  {tasksByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[index % statusColors.length]}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Légende personnalisée */}
          <div className="flex flex-col space-y-3 lg:w-48">
            {tasksByStatus.map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: statusColors[index] }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{entry.name}</p>
                  <p className="text-xs text-gray-500">
                    {entry.value} tâche{entry.value > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">
                    {entry.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques supplémentaires */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total des tâches</span>
            <span className="font-medium text-gray-900">
              {tasksByStatus.reduce((acc, curr) => acc + curr.value, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}