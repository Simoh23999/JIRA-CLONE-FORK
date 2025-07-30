"use client";
import React from "react";
import { ProfilePhoto } from "./ProfilePhoto";
import { EditableField } from "./EditableField";
import { SquarePen } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  description: string;
  photoUrl: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onDescriptionChange: (description: string) => void;
  onPhotoChange?: () => void;
  validationErrors: { [key: string]: string };
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  description,
  photoUrl,
  onNameChange,
  onEmailChange,
  onDescriptionChange,
  onPhotoChange,
  validationErrors,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-sm:p-4 mb-6">
      <div className="flex flex-col max-lg:flex-col gap-6 max-sm:gap-4">
        <div className="flex flex-row max-sm:flex-col items-start max-sm:items-center gap-6 max-sm:gap-4 w-full">
          <ProfilePhoto
            imageUrl={photoUrl}
            alt="Profile Photo"
            onChangePhoto={onPhotoChange}
          />

          <div className="flex-1 min-w-0 max-sm:w-full max-sm:text-center">
            {/* Name Section */}
            <div className="mb-4">
              <EditableField
                value={name}
                onSave={onNameChange}
                validationError={validationErrors.name}
                className="flex flex-col max-sm:items-center gap-3 mb-4"
                inputClassName="text-[30px] max-sm:text-[24px] font-bold text-gray-800 leading-[36px] max-sm:leading-[28px] max-sm:text-center"
                renderContent={(value) => (
                  <h1 className="text-[30px] max-sm:text-[24px] font-bold text-gray-800 leading-[36px] max-sm:leading-[28px] break-words">
                    {value}
                  </h1>
                )}
              />
            </div>

            {/* Email Section */}
            <div className="mb-4">
              <EditableField
                value={email}
                onSave={onEmailChange}
                validationError={validationErrors.email}
                className="flex flex-col max-sm:items-center gap-3 mb-4"
                inputClassName="text-[16px] max-sm:text-[14px] text-gray-500 leading-[24px] max-sm:text-center"
                renderContent={(value) => (
                  <div className="flex items-center max-sm:flex-col max-sm:items-center gap-3 max-sm:gap-2">
                    <span className="text-[16px] max-sm:text-[14px] text-gray-500 leading-[24px] break-all max-sm:text-center">
                      {value}
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded-full flex-shrink-0 transition-all duration-200 hover:bg-emerald-200">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.0002 10.8C7.27323 10.8 8.49413 10.2943 9.39431 9.39411C10.2945 8.49394 10.8002 7.27304 10.8002 6C10.8002 4.72696 10.2945 3.50606 9.39431 2.60588C8.49413 1.70571 7.27323 1.2 6.0002 1.2C4.72716 1.2 3.50626 1.70571 2.60608 2.60588C1.70591 3.50606 1.2002 4.72696 1.2002 6C1.2002 7.27304 1.70591 8.49394 2.60608 9.39411C3.50626 10.2943 4.72716 10.8 6.0002 10.8ZM8.2244 5.2242C8.33369 5.11104 8.39417 4.95947 8.3928 4.80216C8.39143 4.64484 8.32833 4.49435 8.21709 4.38311C8.10584 4.27186 7.95535 4.20876 7.79804 4.20739C7.64072 4.20603 7.48916 4.2665 7.376 4.3758L5.4002 6.3516L4.6244 5.5758C4.51123 5.4665 4.35967 5.40603 4.20235 5.40739C4.04504 5.40876 3.89455 5.47186 3.7833 5.58311C3.67206 5.69435 3.60896 5.84484 3.60759 6.00216C3.60622 6.15947 3.6667 6.31104 3.776 6.4242L4.976 7.6242C5.08851 7.73668 5.2411 7.79987 5.4002 7.79987C5.55929 7.79987 5.71188 7.73668 5.8244 7.6242L8.2244 5.2242Z"
                          fill="#166534"
                        />
                      </svg>
                      <span className="text-[12px] text-emerald-800 font-medium">
                        Vérifié
                      </span>
                    </div>
                  </div>
                )}
                renderEditButton={(onClick) => (
                  <button
                    onClick={onClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0 animate-fade-in hover:cursor-pointer"
                  >
                    <SquarePen size={16} className="text-[#6B7280]" />
                  </button>
                )}
              />
            </div>

            {/* Description Section */}
            <div>
              <EditableField
                value={description}
                onSave={onDescriptionChange}
                validationError={validationErrors.description}
                className="flex items-start gap-3 max-sm:flex-col max-sm:items-center max-sm:gap-3"
                inputClassName="w-full h-[120px] max-sm:h-[100px] text-[18px] max-sm:text-[16px] text-gray-500 leading-[29.25px] max-sm:leading-[24px]"
                multiline={true}
                maxLength={500}
                showCharacterCount={true}
                renderContent={(value) => (
                  <div className="flex-1 max-sm:w-full">
                    <p className="text-[18px] max-sm:text-[16px] text-gray-500 leading-[29.25px] max-sm:leading-[24px] mb-2 max-sm:text-center">
                      {value}
                    </p>
                  </div>
                )}
                renderEditButton={(onClick) => (
                  <button
                    onClick={onClick}
                    className="text-[14px] text-[#527FC1] font-medium hover:underline transition-all duration-200 animate-fade-in hover:cursor-pointer"
                  >
                    Modifier la description
                  </button>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
