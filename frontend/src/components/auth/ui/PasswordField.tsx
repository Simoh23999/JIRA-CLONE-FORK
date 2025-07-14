import { Lock, Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = {
  value: string;
  placeholder: string;
  style: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  error?: string;
  name?: string;
  onPasswordBlur: () => void;
};

export default function PasswordField({
  value,
  style,
  onChange,
  showPassword,
  onTogglePassword,
  placeholder,
  error,
  name,
  onPasswordBlur
}: PasswordFieldProps) {
  const borderStyle = error 
    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
    : style;
  return (
    <div className="space-y-1">
    <div className="relative">
      <Lock 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
            error ? 'text-red-500' : 'text-gray-400'
          }`} 
        />
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onPasswordBlur}
        className={`w-full px-4 py-3 pl-12 border  border-gray-200 rounded-lg focus:outline-none focus:ring-2 ${borderStyle} text-gray-900 placeholder-gray-500`}
      />
        <button
          type="button"
          onClick={onTogglePassword}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
            error ? 'text-red-500' : 'text-gray-400'
          } hover:text-gray-600 transition-colors`}
        >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
          {error && (
        <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>
      )}
    </div>
  );
}
