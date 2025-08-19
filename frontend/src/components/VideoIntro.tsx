"use client";

import { useEffect, useRef } from "react";

type Props = {
  onFinished: () => void;
};

export default function VideoIntro({  }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Lecture OK
          })
          .catch((error) => {
            console.warn("Erreur lors de la lecture automatique :", error);
          });
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      <video
        ref={videoRef}
        src="/TaskFlow2.mp4"
        className="w-35 h-20 object-cover"
        muted
        autoPlay
        playsInline
        loop
        preload="auto"
      />
    </div>
  );
}
