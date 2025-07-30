"use client";
import { useState } from "react";

interface ProfileData {
  name: string;
  email: string;
  description: string;
  photoUrl: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useProfileData = (initialData: ProfileData) => {
  type AutoSaveStatus = "idle" | "saving" | "saved";
  const [profileData, setProfileData] = useState(initialData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string) => {
    return name.trim().length >= 2;
  };

  const showSaveAnimation = () => {
    setAutoSaveStatus("saving");
    setTimeout(() => {
      setAutoSaveStatus("saved");
      setTimeout(() => {
        setAutoSaveStatus("idle");
      }, 2000);
    }, 500);
  };

  const updateName = (name: string) => {
    const errors: ValidationErrors = {};

    if (!validateName(name)) {
      errors.name = "Le nom doit contenir au moins 2 caractères";
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    setProfileData((prev) => ({ ...prev, name }));
    showSaveAnimation();
    return true;
  };

  const updateEmail = (email: string) => {
    const errors: ValidationErrors = {};

    if (!validateEmail(email)) {
      errors.email = "Veuillez entrer une adresse email valide";
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    setProfileData((prev) => ({ ...prev, email }));
    showSaveAnimation();
    return true;
  };

  const updateDescription = (description: string) => {
    if (description.length > 500) {
      return false;
    }

    setValidationErrors({});
    setProfileData((prev) => ({ ...prev, description }));
    showSaveAnimation();
    return true;
  };

  return {
    profileData,
    validationErrors,
    autoSaveStatus,
    updateName,
    updateEmail,
    updateDescription,
    setValidationErrors,
  };
};
