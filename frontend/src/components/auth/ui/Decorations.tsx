export default function BackgroundDecorations() {
  return (
    <div className="absolute inset-0">
      <div className="absolute top-10 left-20 w-32 h-32 bg-white/10 rounded-full blur-sm"></div>
      <div className="absolute top-60 right-10 w-24 h-24 bg-white/10 rounded-full blur-sm"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-sm"></div>
      <div className="absolute bottom-40 right-32 w-20 h-20 bg-white/10 rounded-full blur-sm"></div>
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-sm"></div>
    </div>
  );
}
