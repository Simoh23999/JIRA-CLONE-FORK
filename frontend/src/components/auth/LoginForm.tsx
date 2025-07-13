import React from "react";
import GoogleButton from "../../components/auth/ui/SocialButton";
import InputField from "../../components/auth/ui/InputField";
import PasswordField from "../../components/auth/ui/PasswordField";
import FormDivider from "../../components/auth/ui/FormDivider";
import AuthButton from "../../components/auth/ui/AuthButton";
import styles from "./styles/LoginForm.module.css";

import { Mail } from "lucide-react";

type LoginFormProps = {
  email: string;
  password: string;
  rememberMe: boolean;
  showPassword: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRememberMeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin?: () => void;
  onForgotPassword?: () => void;
};

export default function LoginForm({
  email,
  password,
  rememberMe,
  showPassword,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onTogglePassword,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {/* Email input */}
      <InputField
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={onEmailChange}
        style={styles.border_inputField_blue}
        Icon={Mail}
      ></InputField>

      {/* Password input */}
      <PasswordField
        placeholder="Mot de passe"
        value={password}
        style={styles.border_inputField_blue}
        onChange={onPasswordChange}
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
      />

      {/* remember me & forgot password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={onRememberMeChange}
            className={`w-4 h-4 ${styles.text_login_blue} border-gray-300 rounded `}
          />
          <span className="ml-2 text-gray-600">Se souvenir de moi</span>
        </label>
        <button
          onClick={onForgotPassword}
          className={`${styles.text_login_blue} font-medium`}
        >
          Mot de passe oublié ?
        </button>
      </div>

      {/* login button */}
      <AuthButton value="Se connecter" style={styles.bg_loginButton_blue} />

      {/* divider */}
      <FormDivider />

      {/* google login */}
      <GoogleButton />
    </form>
  );
}
