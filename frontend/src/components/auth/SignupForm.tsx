import React from "react";
import { Mail, User } from "lucide-react";
import InputField from "./ui/InputField";
import PasswordField from "./ui/PasswordField";
import AuthButton from "./ui/AuthButton";
import styles from "./styles/LoginForm.module.css";

type SignupFormProps = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  errors: {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  onFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFullNameBlur: () => void;
  onEmailBlur: () => void;
  onPasswordBlur: () => void;
  onConfirmPasswordBlur: () => void;
};

export default function SignupForm({
  fullName,
  email,
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  errors,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onSubmit,
  onFullNameBlur,
  onEmailBlur,
  onPasswordBlur,
  onConfirmPasswordBlur,
}: SignupFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {/* full name input */}
      <InputField
        type="text"
        placeholder="Nom complet"
        value={fullName}
        onChange={onFullNameChange}
        style={styles.border_inputField_blue}
        Icon={User}
        error={errors.fullName}
        onInputBlur={onFullNameBlur}
      ></InputField>

      {/* email input */}
      <InputField
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={onEmailChange}
        style={styles.border_inputField_blue}
        Icon={Mail}
        error={errors.email}
        onInputBlur={onEmailBlur}
      ></InputField>
      {/* password input */}
      <div>
        <PasswordField
          placeholder="Mot de passe"
          value={password}
          style={styles.border_inputField_blue}
          onChange={onPasswordChange}
          showPassword={showPassword}
          error={errors.password}
          onTogglePassword={onTogglePassword}
          onPasswordBlur={onPasswordBlur}
        ></PasswordField>
      </div>

      {/* confirm password Field */}
      <div>
        <PasswordField
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          error={errors.confirmPassword}
          style={styles.border_inputField_blue}
          onChange={onConfirmPasswordChange}
          showPassword={showConfirmPassword}
          onTogglePassword={onToggleConfirmPassword}
          onPasswordBlur={onConfirmPasswordBlur}
        ></PasswordField>
      </div>

      {/* signup button */}
      <AuthButton value="Registrer" style={styles.bg_loginButton_blue} />
    </form>
  );
}
