import { Lock, Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = {
  value: string;
  placeholder: string;
  style: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
};

export default function PasswordField({
  value,
  style,
  onChange,
  showPassword,
  onTogglePassword,
  placeholder,
}: PasswordFieldProps) {
  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-12 pr-12 py-4 border ${style} border-gray-200 rounded-lg focus:outline-none border-inputField-blue text-gray-900 placeholder-gray-500`}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
