import { useState } from "react";

interface PasswordValidationErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const usePasswordModal = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordValidationErrors, setPasswordValidationErrors] =
    useState<PasswordValidationErrors>({});

  const openPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordValidationErrors({});
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordValidationErrors({});
  };

  const validatePassword = (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    const errors: PasswordValidationErrors = {};

    if (!currentPassword) {
      errors.currentPassword = "Mot de passe actuel requis";
    }

    // Check password strength
    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (/[A-Z]/.test(newPassword)) strength++;
    if (/[a-z]/.test(newPassword)) strength++;
    if (/[0-9]/.test(newPassword)) strength++;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength++;

    if (strength < 4) {
      errors.newPassword = "Le mot de passe doit être plus fort";
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setPasswordValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    onSuccess: () => void,
    onError: () => void,
  ) => {
    const isValid = validatePassword(
      currentPassword,
      newPassword,
      confirmPassword,
    );

    if (isValid) {
      setPasswordValidationErrors({});
      setShowPasswordModal(false);
      onSuccess();
    } else {
      onError();
    }
  };

  return {
    showPasswordModal,
    passwordValidationErrors,
    openPasswordModal,
    closePasswordModal,
    handlePasswordSubmit,
  };
};
