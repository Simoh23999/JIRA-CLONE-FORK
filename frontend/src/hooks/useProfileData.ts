"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/UserContext";
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
  const { refreshUserData } = useAuth();
  type AutoSaveStatus = "idle" | "saving" | "saved";
  const [profileData, setProfileData] = useState(initialData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  useEffect(() => {
    setProfileData(initialData);
  }, [initialData]);
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string) => {
    console.log("Validating name:", name);
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

  // const updateName = (name: string) => {
  //   const errors: ValidationErrors = {};

  //   if (!validateName(name)) {
  //     errors.name = "Le nom doit contenir au moins 2 caractères";
  //     setValidationErrors(errors);
  //     return false;
  //   }

  //   setValidationErrors({});
  //   setProfileData((prev) => ({ ...prev, name }));
  //   showSaveAnimation();
  //   return true;
  // };
  const updateName = async (name: string) => {
    console.log("updateName called with:", name);
    const errors: ValidationErrors = {};

    if (!validateName(name)) {
      errors.name = "Le nom doit contenir au moins 2 caractères";
      setValidationErrors(errors);
      return false;
    }

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:9090/api/me",
        {
          username: name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setValidationErrors({});
      setProfileData((prev) => ({ ...prev, name }));
      await refreshUserData();
      showSaveAnimation();

      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom:", error);

      let errorMessage = "Erreur lors de la sauvegarde du nom";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setValidationErrors({ name: errorMessage });
      // showToast("error", errorMessage);

      return false;
    }
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
