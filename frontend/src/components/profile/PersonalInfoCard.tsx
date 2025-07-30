import React from "react";
// import { validateName, validateEmail } from './utils/validation';
import { UserRound } from "lucide-react";

interface PersonalInfoCardProps {
  nameValue: string;
  setNameValue: (value: string) => void;
  emailValue: string;
  setEmailValue: (value: string) => void;
  descriptionValue: string;
  setDescriptionValue: (value: string) => void;
}

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name: string) => {
  return name.trim().length >= 2;
};

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  nameValue,
  setNameValue,
  emailValue,
  setEmailValue,
  descriptionValue,
  setDescriptionValue,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-sm:p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-3 mb-6 max-sm:mb-4">
        <UserRound size={20} className="text-gray-600" />
        <h2 className="text-[20px] max-sm:text-[18px] font-semibold text-gray-800 leading-[28px]">
          Informations personnelles
        </h2>
      </div>
      <div className="space-y-6 max-sm:space-y-4">
        <div>
          <label className="block text-[14px] max-sm:text-[13px] font-medium text-gray-700 leading-[20px] mb-2">
            Nom complet
          </label>
          <div className="relative">
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              disabled={true}
              className="w-full h-[49px] max-sm:h-[44px] bg-gray-50 border border-gray-300 rounded-lg px-3 text-[16px] max-sm:text-[14px] text-gray-800 leading-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {validateName(nameValue) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {/* <CheckIcon className="text-emerald-600" /> */}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-[14px] max-sm:text-[13px] font-medium text-gray-700 leading-[20px] mb-2">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={emailValue}
              disabled={true}
              onChange={(e) => setEmailValue(e.target.value)}
              className="w-full h-[49px] max-sm:h-[44px] bg-gray-50 border border-gray-300 rounded-lg px-3 text-[16px] max-sm:text-[14px] text-gray-800 leading-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {validateEmail(emailValue) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {/* <CheckIcon className="text-emerald-600" /> */}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-[14px] max-sm:text-[13px] font-medium text-gray-700 leading-[20px] mb-2">
            Description
          </label>
          <div className="relative">
            <textarea
              value={descriptionValue}
              disabled={true}
              onChange={(e) => setDescriptionValue(e.target.value)}
              className="w-full h-[120px] bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-[16px] max-sm:text-[14px] text-gray-800 leading-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
