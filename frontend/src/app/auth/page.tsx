"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContainer from "../../components/auth/AuthContainer";
import AuthCard from "../../components/auth/AuthCard";
import LoginForm from "../../components/auth/LoginForm";
import SignupForm from "../../components/auth/SignupForm";
import RequireAuth from "@/components/RequireAuth";
import { loginSchema, signupSchema } from "./validations/auth";
import { ZodObject, ZodRawShape } from "zod";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"connexion" | "inscription">("connexion");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [signupErrors, setSignupErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [checking, setChecking] = useState(true);
  const router = useRouter();

  // ✅ Vérification token comme dans le 1er code
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return <RequireAuth> </RequireAuth>; // Ou un loader si tu veux afficher un truc pendant la vérification
  }

  // ✅ Fonction commune de validation de champ (2e code)
  const validateField = (
    schema: ZodObject<ZodRawShape>,
    fieldName: string,
    value: string,
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
  ) => {
    const partialSchema = schema.pick({ [fieldName]: true as const });
    const result = partialSchema.safeParse({ [fieldName]: value });

    setErrors((prev) => {
      const updated = { ...prev };
      if (!result.success) {
        updated[fieldName] = result.error.issues[0].message;
      } else {
        delete updated[fieldName];
      }
      return updated;
    });
  };

  // ✅ Soumission Login
  const LoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formatted: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        formatted[i.path[0] as string] = i.message;
      });
      setLoginErrors(formatted);
      return;
    }
    console.log("Login:", { email, password, rememberMe });
  };

  // ✅ Soumission Signup
  const SignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});
    const result = signupSchema.safeParse({ fullName, email, password, confirmPassword });

    if (!result.success) {
      const formatted: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        formatted[i.path[0] as string] = i.message;
      });
      setSignupErrors(formatted);
      return;
    }
    console.log("Signup:", { fullName, email, password, confirmPassword });
  };

  const GoogleLogin = () => console.log("Google login");
  const ForgotPassword = () => console.log("Forgot password");

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
            onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            onFullNameBlur={() =>
              validateField(signupSchema, "fullName", fullName, setSignupErrors)
            }
            onEmailBlur={() =>
              validateField(signupSchema, "email", email, setSignupErrors)
            }
            onPasswordBlur={() =>
              validateField(signupSchema, "password", password, setSignupErrors)
            }
            onConfirmPasswordBlur={() => {
              const result = signupSchema.safeParse({
                fullName,
                email,
                password,
                confirmPassword,
              });
              setSignupErrors((prev) => {
                const updated = { ...prev };
                if (!result.success) {
                  const issue = result.error.issues.find(
                    (i) => i.path[0] === "confirmPassword"
                  );
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
