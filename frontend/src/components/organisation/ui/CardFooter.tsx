"use client";

import React from "react";

export default function CardFooter() {
  return (
    <div className="border-t border-gray-200 mt-3 pt-2 text-xs text-gray-600 flex justify-between items-center">
      <span>Public Organization</span>
      <span className="cursor-pointer">▼</span>
    </div>
  );
}
