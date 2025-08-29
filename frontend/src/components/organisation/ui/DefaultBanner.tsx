import Image from "next/image";

export default function DefaultBanner() {
  return (
    <div className="w-full rounded-lg mb-6 p-6 bg-gradient-to-r from-[#1B365D] to-[#3B82F6] text-white relative overflow-hidden shadow-lg h-40 flex items-center">
      {/* Motifs de fond TaskFlow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-lg bg-white transform translate-x-16 -translate-y-16 rotate-12"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-lg bg-white transform -translate-x-12 translate-y-12 rotate-45"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded bg-white transform rotate-12 opacity-5"></div>
      </div>

      {/* Contenu central */}
      <div className="relative z-10 flex-1 flex items-center">
        <div>
          <div className="text-sm text-blue-100 mb-1">
            Bienvenue sur TaskFlow
          </div>
          <div className="text-2xl md:text-3xl font-semibold">
            Gérez vos projets efficacement
          </div>
          <div className="text-blue-100 mt-1 text-sm">
            Simplifiez la gestion de vos équipes et tâches
          </div>
        </div>
      </div>

      {/* Logo TaskFlow à droite */}
      <div className="relative z-10 hidden md:flex items-center justify-center w-28 h-28 bg-white/20 rounded-lg backdrop-blur-sm">
        <Image
          src="/TaskFlowIcon.png"
          alt="TaskFlow Logo"
          width={60}
          height={60}
          className="object-contain"
        />
      </div>
    </div>
  );
}
