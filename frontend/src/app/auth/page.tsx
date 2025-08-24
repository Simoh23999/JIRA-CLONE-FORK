"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AuthContainer from "../../components/auth/AuthContainer";
import AuthCard from "../../components/auth/AuthCard";
import LoginForm from "../../components/auth/LoginForm";
import SignupForm from "../../components/auth/SignupForm";
import RequireAuth from "@/components/RequireAuth";
import { loginSchema, signupSchema } from "./validations/auth";
import { ZodObject, ZodRawShape } from "zod";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../../types/jwt";
import {
  ServerErrorDisplay,
  translateErrorMessage,
  SimpleErrorText,
} from "@/components/ErrorDisplay";
import { useToast } from "../../hooks/useToast";
import { Toast } from "../../components/ui/Toast";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";
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

  const [isPending, startTransition] = useTransition();
  const [loginServerError, setloginServerError] = useState<string | null>(null);
  const [signUpServerError, setsignUpServerError] = useState<string | null>(
    null,
  );
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

  const [checking, setChecking] = useState(true);
  const router = useRouter();

  const [isLoginSubmitting, setisLoginSubmitting] = useState(false);
  const [isSignUpSubmitting, setisSignUpSubmitting] = useState(false);
  const { toast, showToast } = useToast();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return <RequireAuth> </RequireAuth>;
  }
  const validateField = (
    schema: ZodObject<ZodRawShape>,
    fieldName: string,
    value: string,
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
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

  const LoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    setloginServerError(null);
    setisLoginSubmitting(true);
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formatted: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        formatted[i.path[0] as string] = i.message;
      });
      setLoginErrors(formatted);
      setisLoginSubmitting(false);
      return;
    }

    startTransition(async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/auth/authenticate`,
          { email, password },
          {
            headers: { "Content-Type": "application/json" },
          },
        );

        const { token, refreshToken } = response.data;
        if (token && refreshToken) {
          if (rememberMe) {
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refreshToken);
          } else {
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("refreshToken", refreshToken);
          }
        }

        router.push("/dashboard"); // Rediriger vers dashboard
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Une erreur est survenue. Veuillez réessayer.";
        const Message = translateErrorMessage(message);
        setloginServerError(Message);
        console.log("message: ", message);
        console.log("message: ", Message);
      } finally {
        setisLoginSubmitting(false);
        //    showToast(
        //    "error",
        //  "Erreur de validation du nom"
        //   );
      }
    });

    console.log("Login:", { email, password, rememberMe });
  };

  const SignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});
    setsignUpServerError(null);
    setisSignUpSubmitting(true);
    const result = signupSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const formatted: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        formatted[i.path[0] as string] = i.message;
      });
      setSignupErrors(formatted);
      setisSignUpSubmitting(false);
      return;
    }
    startTransition(async () => {
      try {
        const response = await axios.post(
          "http://localhost:9090/api/auth/register",
          { username: fullName, email, password },
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        showToast("success", "Compte créé avec succès");

        setFullName("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        setTimeout(() => {
          setActiveTab("connexion");
        }, 500);
        // router.push("/auth"); // // Rediriger vers login page (a discuter)
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Une erreur est survenue. Veuillez réessayer.";
        const Message = translateErrorMessage(message);
        setsignUpServerError(Message);
      } finally {
        setisSignUpSubmitting(false);
      }
    });
    console.log("Signup:", { fullName, email, password, confirmPassword });
  };

  const GoogleLogin = () => console.log("Google login");
  const ForgotPassword = () => console.log("Forgot password");

  const onTabChange = (tab: "connexion" | "inscription") => {
    setActiveTab(tab);
    setLoginErrors({});
    setSignupErrors({});
    setloginServerError(null);
    setsignUpServerError(null);
  };

  return (
    <AuthContainer>
      <AuthCard activeTab={activeTab} onTabChange={onTabChange}>
        {toast && (
          <Toast type={toast.type} message={toast.message} onClose={() => {}} />
        )}
        {activeTab === "connexion" ? (
          <LoginForm
            email={email}
            password={password}
            rememberMe={rememberMe}
            showPassword={showPassword}
            errors={loginErrors}
            serverError={loginServerError}
            submitButtonState={isLoginSubmitting}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onRememberMeChange={(e) => setRememberMe(e.target.checked)}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={LoginSubmit}
            onGoogleLogin={GoogleLogin}
            onForgotPassword={ForgotPassword}
            onEmailBlur={() =>
              validateField(loginSchema, "email", email, setLoginErrors)
            }
            onPasswordBlur={() =>
              validateField(loginSchema, "password", password, setLoginErrors)
            }
            onDismiss={() => setloginServerError(null)}
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
            serverError={signUpServerError}
            submitButtonState={isSignUpSubmitting}
            onFullNameChange={(e) => setFullName(e.target.value)}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
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
                    (i) => i.path[0] === "confirmPassword",
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
            onDismiss={() => setsignUpServerError(null)}
          />
        )}
      </AuthCard>
    </AuthContainer>
  );
}
