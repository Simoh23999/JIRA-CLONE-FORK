"use client";

import { useEffect, useRef } from "react";

type Props = {
  onFinished: () => void;
};

export default function VideoIntro({ onFinished }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play();
      // Ne pas utiliser `ended` si on boucle
      // video.addEventListener("ended", onFinished);
    }

    // Pas besoin de cleanup ici si on ne gère pas l'événement "ended"
  }, []);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center  ">
      <video
        ref={videoRef}
        src="/TaskFlow2.mp4"
        className="w-35 h-20 object-cover"
        muted
        autoPlay
        playsInline
        loop 
      />
    </div>
  );
}
