type AuthButtonProps = {
  value: string;
  style: string;
};

export default function AuthButton({ value, style }: AuthButtonProps) {
  return (
    <button
      type="submit"
      className={`w-full ${style} text-white font-medium py-4 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-login-blue focus:ring-offset-2`}
    >
      {value}
    </button>
  );
}
