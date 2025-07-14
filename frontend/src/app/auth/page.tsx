"use client";
import { useState } from "react";
import AuthContainer from "../../components/auth/AuthContainer";
import AuthCard from "../../components/auth/AuthCard";
import LoginForm from "../../components/auth/LoginForm";
import SignupForm from "../../components/auth/SignupForm";
import { loginSchema, signupSchema } from "./validations/auth";
import { ZodObject, ZodRawShape } from "zod";

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


  const [loginErrors, setLoginErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  
  const [signupErrors, setSignupErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});


const validateField = (
  schema: ZodObject<ZodRawShape>,
  fieldName: string,
  value: string,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  const partialData = { [fieldName]: value };
  const partialSchema = schema.pick({ [fieldName]: true as const });

  const result = partialSchema.safeParse(partialData);

  setErrors((prev) => {
    const newErrors = { ...prev };
    if (!result.success) {
      newErrors[fieldName] = result.error.issues[0].message;
    } else {
      delete newErrors[fieldName];
    }
    return newErrors;
  });
};



  const LoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    const formatted: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      formatted[issue.path[0] as string] = issue.message;
    });
    setLoginErrors(formatted);
    return;
  }
  console.log("login:", { email, password, rememberMe });
  };

  const SignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({}); 

    const result = signupSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const formatted: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        formatted[issue.path[0] as string] = issue.message;
      });
      setSignupErrors(formatted);
      return;
    }
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

  const onTabChange = (tab: "connexion" | "inscription") => {
    setActiveTab(tab);
    setLoginErrors({});
    setSignupErrors({});
  };

  return (
    <AuthContainer>
      <AuthCard activeTab={activeTab} onTabChange={onTabChange}>
        {activeTab === "connexion" ? (
          <LoginForm
            email={email}
            password={password}
            rememberMe={rememberMe}
            showPassword={showPassword}
            errors={loginErrors}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onRememberMeChange={(e) => setRememberMe(e.target.checked)}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={LoginSubmit}
            onGoogleLogin={GoogleLogin}
            onForgotPassword={ForgotPassword}
            onEmailBlur={() => validateField(loginSchema, "email", email, setLoginErrors)}
            onPasswordBlur={() => validateField(loginSchema, "password", password, setLoginErrors)}
          />
        ) : (
          <SignupForm
            fullName={fullName}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            errors={signupErrors}
            onFullNameChange={(e) => setFullName(e.target.value)}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }

            onFullNameBlur={() => validateField(signupSchema, "fullName", fullName, setSignupErrors)}
            onEmailBlur={() => validateField(signupSchema, "email", email, setSignupErrors)}
            onPasswordBlur={() => validateField(signupSchema, "password", password, setSignupErrors)}
            onConfirmPasswordBlur={() => {
    // Pour onConfirmPasswordBlur on fait validation globale
    const result = signupSchema.safeParse({ fullName, email, password, confirmPassword });
    setSignupErrors((prev) => {
      const updated = { ...prev };
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === "confirmPassword");
        if (issue) updated.confirmPassword = issue.message;
        else delete updated.confirmPassword;
      } else {
        delete updated.confirmPassword;
      }
      return updated;
    });
  }}
            onSubmit={SignupSubmit}
          />
        )}
      </AuthCard>
    </AuthContainer>
  );
}
