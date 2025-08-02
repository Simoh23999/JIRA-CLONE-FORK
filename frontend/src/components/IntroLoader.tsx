import Image from "next/image";

export default function IntroLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/logo.svg" 
          alt="Logo"
          width={80}
          height={80}
          className="animate-pulse transition-all duration-700"
        />
        <p className="text-gray-500 animate-bounce">Jira-Clone </p>
      </div>
    </div>
  );
}
