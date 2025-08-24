export const translateSprintStatus = (status: string): string => {
  const statusTranslations: Record<string, string> = {
    PLANNED: "Planification",
    ACTIVE: "Actif",
    COMPLETED: "Terminé",
    CANCELLED: "Fermé",
  };

  return statusTranslations[status] || status || "autre";
};
