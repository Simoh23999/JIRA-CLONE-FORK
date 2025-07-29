"use client";

import React from "react";
import CreateWorkspaceForm from "./create-workspace-form";
import { ResponsiveModal } from "@/components/ResponsiveModal";

type CreateWorkspaceModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  canClose: boolean; 
};

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  open,
  onOpenChange,
  canClose,
}) => {
  const handleOpenChange = (value: boolean) => {
    if (!canClose && !value) return;
    onOpenChange(value);
  };

  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
      <CreateWorkspaceForm
        onCancel={() => {
          if (canClose) onOpenChange(false);
        }}
      />
    </ResponsiveModal>
  );
};

export default CreateWorkspaceModal;
