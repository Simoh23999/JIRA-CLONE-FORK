type FormDividerProps = {
  text?: string;
};

export default function FormDivider({
  text = "Ou se connecter avec",
}: FormDividerProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="text-gray-400 text-sm whitespace-nowrap">{text}</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
}
