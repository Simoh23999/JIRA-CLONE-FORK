"use client";
import { useState } from "react";
import AuthContainer from "../../components/auth/AuthContainer";
import AuthCard from "../../components/auth/AuthCard";
import LoginForm from "../../components/auth/LoginForm";
import SignupForm from "../../components/auth/SignupForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"connexion" | "inscription">(
    "connexion",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const LoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique a faire
    console.log("Login:", { email, password, rememberMe });
  };

  const SignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique a faire
    console.log("Signup:", { fullName, email, password, confirmPassword });
  };

  const GoogleLogin = () => {
    // Logique a faire
    console.log("Google login");
  };

  const ForgotPassword = () => {
    // Logique a faire
    console.log("Forgot password");
  };

  return (
    <AuthContainer>
      <AuthCard activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "connexion" ? (
          <LoginForm
            email={email}
            password={password}
            rememberMe={rememberMe}
            showPassword={showPassword}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onRememberMeChange={(e) => setRememberMe(e.target.checked)}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={LoginSubmit}
            onGoogleLogin={GoogleLogin}
            onForgotPassword={ForgotPassword}
          />
        ) : (
          <SignupForm
            fullName={fullName}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onFullNameChange={(e) => setFullName(e.target.value)}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            onSubmit={SignupSubmit}
          />
        )}
      </AuthCard>
    </AuthContainer>
  );
}
