"use client";
import React, { useState } from "react";

interface ProfilePhotoProps {
  imageUrl: string;
  alt: string;
  onChangePhoto?: () => void;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  imageUrl,
  alt,
  onChangePhoto,
}) => {
  const [photoHover, setPhotoHover] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 transition-transform duration-200 hover:scale-105"
      onMouseEnter={() => setPhotoHover(true)}
      onMouseLeave={() => setPhotoHover(false)}
    >
      <img
        src={imageUrl}
        alt={alt}
        className="w-[120px] h-[120px] max-sm:w-[100px] max-sm:h-[100px] rounded-full border-4 border-gray-200 object-cover transition-all duration-300"
      />
      {photoHover && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 animate-fade-in"
          onClick={onChangePhoto}
        >
          <span className="text-white text-sm max-sm:text-xs font-medium text-center px-2">
            Change Photo
          </span>
        </div>
      )}
    </div>
  );
};
