import { TriangleAlert } from "lucide-react";

const translateErrorMessage = (message: string): string => {
  const errorTranslations: Record<string, string> = {
    "Invalid email or password": "Email ou mot de passe incorrect",
    "User already exists": "Un utilisateur avec cet email existe déjà",
    "Email already exists": "Cet email est déjà utilisé",
    "Password too weak": "Le mot de passe est trop faible",
    "Invalid email format": "Format d'email invalide",
    "User not found": "Utilisateur non trouvé",
    "Account not verified": "Compte non vérifié",
    "Too many attempts": "Trop de tentatives, veuillez réessayer plus tard",
    "Server error": "Erreur serveur, veuillez réessayer",
    "Network error": "Erreur réseau, vérifiez votre connexion",
    "Username already taken": "Ce nom d'utilisateur est déjà pris",
    "Invalid credentials": "Identifiants invalides",
    "Account locked": "Compte verrouillé",
    "Session expired": "Session expirée, veuillez vous reconnecter",
  };

  return (
    errorTranslations[message] ||
    message ||
    "Une erreur est survenue. Veuillez réessayer."
  );
};

// const ServerErrorDisplay = ({ error }: { error: string | null }) => {
//   if (!error) return null;

//   return (
//     <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//       <div className="flex items-center">
//         <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//         </svg>
//         <p className="text-sm text-red-600 font-medium">{error}</p>
//       </div>
//     </div>
//   );
// };

const SimpleErrorText = ({ error }: { error: string | null }) => {
  if (!error) return null;

  return (
    <p className="text-red-600 text-sm font-medium mb-4 p-2 bg-red-50 border-l-4 border-red-400 rounded">
      {error}
    </p>
  );
};

const ServerErrorDisplay = ({
  error,
  onDismiss,
}: {
  error: string | null;
  onDismiss?: () => void;
}) => {
  if (!error) return null;

  return (
    <div className="mb-6 relative">
      {/* Container principal avec animation fade-in */}
      <div className="animate-in fade-in duration-200 slide-in-from-top-1">
        {/* <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm"> */}
        <div className="bg-red-50  border-red-500  shadow-sm">
          <div className="flex items-start justify-between p-4">
            {/* Icône et message */}
            <div className="flex items-start space-x-3">
              {/* Icône d'erreur moderne */}
              <div className="flex-shrink-0 mt-0.5">
                {/* <svg 
                  className="w-5 h-5 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
                  />
                </svg> */}
                <TriangleAlert className="w-5 h-5 text-red-500" />
              </div>

              {/* Contenu du message */}
              <div className="flex-1 min-w-0">
                {/* <div className="text-sm font-medium text-red-800 mb-1">
                  Erreur d'authentification
                </div> */}
                <div className="text-sm text-red-700 leading-relaxed">
                  {error}
                </div>
              </div>
            </div>

            {/* Bouton de fermeture optionnel */}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-shrink-0 ml-4 text-red-400 hover:text-red-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 focus:ring-offset-red-50 rounded-sm p-1"
                aria-label="Fermer l'alerte"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ServerErrorDisplay, translateErrorMessage, SimpleErrorText };
