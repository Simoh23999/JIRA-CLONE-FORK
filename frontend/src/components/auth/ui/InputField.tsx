import { LucideIcon } from "lucide-react";

type InputFieldProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon: LucideIcon;
  style: string;
};

export default function InputField({
  type,
  placeholder,
  value,
  onChange,
  Icon,
  style,
}: InputFieldProps) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-12 pr-4 py-4 border ${style} border-gray-200 rounded-lg focus:outline-none border-inputField-blue text-gray-900 placeholder-gray-500`}
      />
    </div>
  );
}
