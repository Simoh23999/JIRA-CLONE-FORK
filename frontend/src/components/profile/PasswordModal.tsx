import React, { useState, useEffect } from "react";
import PasswordField from "../auth/ui/PasswordField";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => void;
  validationErrors: { [key: string]: string };

  onPasswordBlur?: () => void;
  // onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onToggleNewPassword: () => void;
  onToggleConfirmPassword: () => void;
  //   errors: {
  //   email?: string;
  //   password?: string;
  // };
  showPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
}

export default function PasswordModal({
  isOpen,
  onClose,
  onSubmit,
  validationErrors,

  // onPasswordBlur,
  // onPasswordChange,
  onTogglePassword,
  onToggleNewPassword,
  onToggleConfirmPassword,
  // errors,
  showPassword,
  showNewPassword,
  showConfirmPassword,
}: PasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength(0);
    }
  }, [isOpen]);

  const checkPasswordStrength = (password: string) => {
    setNewPassword(password);
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = () => {
    onSubmit(currentPassword, newPassword, confirmPassword);
  };

  if (!isOpen) return null;
  const onPasswordBlur = () => {
    //test
    // } ;
  };
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md  bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[20px] font-semibold text-gray-800">
            Modifier le mot de passe
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label="Close modal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              Mot de passe actuel
            </label>
            <PasswordField
              name="password"
              placeholder=""
              value={currentPassword}
              onPasswordBlur={onPasswordBlur}
              style={`w-full h-[49px] bg-gray-50 border rounded-lg px-3 text-[16px] text-gray-800 focus:outline-none focus:ring-2 transition-all duration-200 ${
                validationErrors.currentPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#527fc1] focus:border-transparent"
              }`}
              onChange={(e) => setCurrentPassword(e.target.value)}
              showPassword={showPassword}
              onTogglePassword={onTogglePassword}
              error={validationErrors.currentPassword}
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <PasswordField
              name="password"
              placeholder=""
              value={newPassword}
              onPasswordBlur={onPasswordBlur}
              style={`w-full h-[49px] bg-gray-50 border rounded-lg px-3 text-[16px] text-gray-800 focus:outline-none focus:ring-2 transition-all duration-200 ${
                validationErrors.newPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#527fc1] focus:border-transparent"
              }`}
              onChange={(e) => checkPasswordStrength(e.target.value)}
              showPassword={showNewPassword}
              onTogglePassword={onToggleNewPassword}
              error={validationErrors.newPassword}
            />
            <div className="mt-2">
              <div className="flex gap-1 ">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded transition-all duration-300 ${
                      passwordStrength >= level
                        ? passwordStrength <= 2
                          ? "bg-red-500"
                          : passwordStrength <= 4
                            ? "bg-orange-400"
                            : "bg-emerald-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[12px] text-gray-500 mt-1 block">
                Force:{" "}
                {passwordStrength < 2
                  ? " Tres Faible "
                  : passwordStrength < 3
                    ? "Faible"
                    : passwordStrength < 5
                      ? "Moyenne"
                      : "Forte"}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <PasswordField
              name="password"
              placeholder=""
              value={confirmPassword}
              onPasswordBlur={onPasswordBlur}
              style={`w-full h-[49px] bg-gray-50 border rounded-lg px-3 text-[16px] text-gray-800 focus:outline-none focus:ring-2 transition-all duration-200 ${
                validationErrors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#527fc1] focus:border-transparent"
              }`}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showPassword={showConfirmPassword}
              onTogglePassword={onToggleConfirmPassword}
              error={validationErrors.confirmPassword}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={!currentPassword || !newPassword || !confirmPassword}
              // className="flex-1 py-3 bg-[#527fc1] text-white font-medium rounded-lg hover:bg-[#3b5f8c] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-102 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              className="flex-1 py-3 bg-[#527fc1] text-white font-medium rounded-lg hover:bg-[#3b5f8c] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-102 focus:outline-none focus:ring-offset-2"
            >
              Sauvegarder
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200 hover:scale-102 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
