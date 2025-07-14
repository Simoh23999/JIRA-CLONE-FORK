import React from "react";
import BackgroundDecorations from "./ui/Decorations";
import styles from "./styles/AuthContainer.module.css";

type AuthContainerProps = {
  children: React.ReactNode;
};

export default function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div
      className={`min-h-screen ${styles.bg_login_gradient} relative overflow-hidden`}
    >
      <BackgroundDecorations />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row lg:items-center lg:justify-center px-0 sm:px-6 lg:px-9">
        <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-0 lg:gap-20 h-full lg:h-auto">
          {/* left side */}

          <div className="flex-1 text-center lg:text-left px-4 lg:px-0 pt-8 pb-4 lg:py-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Connectez-vous à<br />
              votre espace
            </h1>
            <p className="text-lg sm:text-xl text-white/90 font-light">
              Accédez à vos projets et gérez vos tâches en
              <br />
              toute simplicité
            </p>
          </div>

          {/* right side */}
          <div className="w-full sm:max-w-md lg:max-w-md flex-1 lg:flex-initial flex flex-col justify-end lg:justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
