import { LucideIcon } from "lucide-react";

type InputFieldProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon: LucideIcon;
  style: string;
  error?: string;
  name?: string;
  onInputBlur: () => void;
};

export default function InputField({
  type,
  placeholder,
  value,
  onChange,
  Icon,
  style,
  error,
  name,
  onInputBlur
}: InputFieldProps) {
  const borderStyle = error 
  ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
  : style;

  return (
    <div className="space-y-1">
    <div className="relative">
      <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              error ? 'text-red-500' : 'text-gray-400'
            }`} />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onInputBlur}
        className={`w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-colors ${borderStyle} placeholder-gray-500 text-gray-900`}
      />
    </div>
          {error && (
        <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>
      )}
    </div>
  );
}
