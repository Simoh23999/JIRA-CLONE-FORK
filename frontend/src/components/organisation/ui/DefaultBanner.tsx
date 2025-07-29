import React from "react";

export default function DefaultBanner() {
  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-32 h-32 bg-white/10 rounded-full blur-md"></div>
        <div className="absolute top-60 right-10 w-24 h-24 bg-white/10 rounded-full blur-md"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-md"></div>
        <div className="absolute bottom-40 right-32 w-20 h-20 bg-white/10 rounded-full blur-md"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
      </div>
    </div>
  );
}

