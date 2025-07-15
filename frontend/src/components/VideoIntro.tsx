"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onFinished: () => void;
};

export default function VideoIntro({ onFinished }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play();
      video.addEventListener("ended", onFinished);
    }

    return () => {
      video?.removeEventListener("ended", onFinished);
    };
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src="/introLogo.mp4" // place ta vidéo ici dans public/
        className="w-full h-full object-cover"
        muted
        autoPlay
        playsInline
      />
    </div>
  );
}
