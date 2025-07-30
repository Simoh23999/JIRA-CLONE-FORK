"use client";
import React, { useState, useEffect } from "react";
import { ProfileHeader } from "../../../components/profile/Header";
import { PersonalInfoCard } from "../../../components/profile/PersonalInfoCard";
import { SecurityCard } from "../../../components/profile/securityCard";
import PasswordModal from "../../../components/profile/PasswordModal";
import { usePasswordModal } from "../../../hooks/usePasswordModal";

import { AutoSaveIndicator } from "../../../components/ui/AutoSaveIndicator";
import { Toast } from "../../../components/ui/Toast";
import { useProfileData } from "../../../hooks/useProfileData";
import { useToast } from "../../../hooks/useToast";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../../../types/jwt";

export default function ProfilePage() {
  const {
    showPasswordModal,
    passwordValidationErrors,
    openPasswordModal,
    closePasswordModal,
    handlePasswordSubmit,
  } = usePasswordModal();

  const [profileDataLoaded, setProfileDataLoaded] = useState(false);
  const [profileInit, setProfileInit] = useState(false);
  const [initialProfileData, setInitialProfileData] = useState({
    name: "Simo Tlili",
    email: "Simo.Tlili@company.com",
    description: "",
    photoUrl: "https://placehold.co/120x120/E5E7EB/6B7280?text=ST",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      console.log("Token récupéré :", token);
      if (!token) {
        console.warn("Token manquant.");
        return;
      }

      const decoded = jwtDecode<JwtPayload>(token);
      console.log("Token récupéré :", decoded.email);
      console.log("Token récupéré :", decoded.username);
      setInitialProfileData({
        name: decoded.username || "Nom inconnu",
        email: decoded.email || "Email inconnu",
        description: "",
        // photoUrl: decoded.picture || `https://placehold.co/120x120/E5E7EB/6B7280?text=${(decoded.username || "U")[0]}`,
        photoUrl: `https://placehold.co/120x120/E5E7EB/6B7280?text=${(decoded.username || "U")[0]}`,
      });

      setProfileDataLoaded(true);
    } catch (err) {
      console.error("Erreur de décodage du token :", err);
    }
  }, []);

  type AutoSaveStatus = "idle" | "saving" | "saved";
  const {
    profileData,
    validationErrors,
    autoSaveStatus,
    updateName,
    updateEmail,
    updateDescription,
  } = profileInit
    ? useProfileData(initialProfileData)
    : {
        profileData: initialProfileData,
        validationErrors: {},
        autoSaveStatus: "idle" as AutoSaveStatus,
        updateName: () => false,
        updateEmail: () => false,
        updateDescription: () => false,
      };

  const { toast, showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!profileDataLoaded) {
    return <p>Chargement du profil...</p>;
  }

  const handleNameChange = (name: string) => {
    const success = updateName(name);
    showToast(
      success ? "success" : "error",
      success ? "Nom sauvegardé avec succès" : "Erreur de validation du nom",
    );
  };

  const handleEmailChange = (email: string) => {
    const success = updateEmail(email);
    showToast(
      success ? "success" : "error",
      success
        ? "Email sauvegardé avec succès"
        : "Erreur de validation de l'email",
    );
  };

  const handleDescriptionChange = (description: string) => {
    const success = updateDescription(description);
    showToast(
      success ? "success" : "error",
      success
        ? "Description sauvegardée avec succès"
        : "La description ne peut pas dépasser 500 caractères",
    );
  };

  const handlePhotoChange = () => {
    // Implement photo change logic
    console.log("Photo change clicked");
  };
  //   const openPasswordModal = () => {
  //     // setShowPasswordModal(true);
  //   };

  const handlePasswordChange = (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    handlePasswordSubmit(
      currentPassword,
      newPassword,
      confirmPassword,
      () => {
        // Success callback
        showToast("success", "Mot de passe modifié avec succès");
      },
      () => {
        // Error callback
        showToast("error", "Erreur de validation du mot de passe");
      },
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans relative">
      <AutoSaveIndicator status={autoSaveStatus} />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => {}} />
      )}

      <div className="max-w-[1200px] mx-auto px-4 max-sm:px-3 py-8 max-sm:py-4">
        <ProfileHeader
          name={profileData.name}
          email={profileData.email}
          description={profileData.description}
          photoUrl={profileData.photoUrl}
          onNameChange={handleNameChange}
          onEmailChange={handleEmailChange}
          onDescriptionChange={handleDescriptionChange}
          onPhotoChange={handlePhotoChange}
          validationErrors={validationErrors}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-sm:gap-4 items-start">
        <PersonalInfoCard
          nameValue={profileData.name}
          setNameValue={handleNameChange}
          emailValue={profileData.email}
          setEmailValue={handleEmailChange}
          descriptionValue={profileData.description}
          setDescriptionValue={handleDescriptionChange}
        />

        <SecurityCard onOpenPasswordModal={openPasswordModal} />
      </div>
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={closePasswordModal}
        onSubmit={handlePasswordChange}
        showPassword={showPassword}
        showNewPassword={showNewPassword}
        showConfirmPassword={showConfirmPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onToggleNewPassword={() => setShowNewPassword(!showNewPassword)}
        onToggleConfirmPassword={() =>
          setShowConfirmPassword(!showConfirmPassword)
        }
        validationErrors={passwordValidationErrors as { [key: string]: string }}
      />
    </div>
  );
}
