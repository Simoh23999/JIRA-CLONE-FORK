import { useState } from "react";
import axios from "axios";
import { JwtPayload } from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";
import { jwtDecode } from "jwt-decode";
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

  const handlePasswordSubmit = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    onSuccess: () => void,
    onError: (message?: string) => void,
  ) => {
    const isValid = validatePassword(
      currentPassword,
      newPassword,
      confirmPassword,
    );

    if (isValid) {
      try {
        const storedToken =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        let token = storedToken;
        if (token) {
          try {
            const decoded = jwtDecode<JwtPayload>(token);

            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
              token = await refreshToken();
            }
          } catch (error) {
            console.error("Invalid token:", error);
            token = await refreshToken();
          }
        } else {
          token = await refreshToken();
        }
        const response = await axios.put(
          "http://localhost:9090/api/me/password",
          {
            currentPassword,
            newPassword,
            confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setPasswordValidationErrors({});
        setShowPasswordModal(false);
        onSuccess();

        // showToast("success", response.data.message || "Mot de passe mis à jour avec succès");
      } catch (error) {
        console.error("Erreur lors du changement de mot de passe:", error);

        let errorMessage = "Erreur lors du changement de mot de passe";
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        // showToast("error", errorMessage)
        onError(errorMessage);
      }
    } else {
      onError("Erreurs de validation");
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
