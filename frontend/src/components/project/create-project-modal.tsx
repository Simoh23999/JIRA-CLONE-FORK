"use client";

import React from "react";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import CreateProjectForm from "./create-project-form";

type CreateprojectModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  canClose: boolean; 
  orgid:string|number
};

const CreatProjectModal: React.FC<CreateprojectModalProps> = ({
  open,
  onOpenChange,
  canClose,
  orgid,
}) => {
  const handleOpenChange = (value: boolean) => {
    if (!canClose && !value) return;
    onOpenChange(value);
  };

  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
      <CreateProjectForm
       orgId={orgid}
        onCancel={() => {
          if (canClose) onOpenChange(false);
        }}
      />
    </ResponsiveModal>
  );
};

export default CreatProjectModal;
