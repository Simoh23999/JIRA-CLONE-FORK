import React from "react";
import { Lock } from "lucide-react";

interface SecurityCardProps {
  onOpenPasswordModal: () => void;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({
  onOpenPasswordModal,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-sm:p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-3 mb-6 max-sm:mb-4">
        <Lock size={20} className="text-gray-600" />
        <h2 className="text-[20px] max-sm:text-[18px] font-semibold text-gray-800 leading-[28px]">
          Sécurité
        </h2>
      </div>
      <div className="space-y-6 max-sm:space-y-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[16px] max-sm:text-[14px] font-medium text-gray-800">
              Mot de passe
            </span>
            <button
              onClick={onOpenPasswordModal}
              className="px-4 py-2 bg-[#527FC1] text-white text-[14px] font-medium rounded-lg hover:bg-[#46699C] transition-all duration-200 hover:scale-102 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Changer le mot de passe
            </button>
          </div>
          <div className="text-[14px] text-gray-500 mb-3">
            Dernière modification : 15 mars 2024
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
            <span className="text-[14px] text-gray-600 ml-2">
              Mot de passe fort
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
