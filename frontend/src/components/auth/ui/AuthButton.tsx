type AuthButtonProps = {
  value: string;
  style: string;
  isLoading?: boolean;
  loadingValue?: string;
  disabled?: boolean;
};

// export default function AuthButton({ value, style }: AuthButtonProps) {
//   return (
//     <button
//       type="submit"
//       className={`w-full ${style} text-white font-medium py-4 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-login-blue focus:ring-offset-2`}
//     >
//       {value}
//     </button>
//   );
// }
export default function AuthButton({
  value,
  style,
  isLoading = false,
  disabled = false,
  loadingValue,
}: AuthButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={`w-full ${style} text-white font-medium py-4 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-login-blue focus:ring-offset-2 
        ${
          disabled || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:cursor-pointer hover:opacity-90 hover:transform hover:scale-[1.02]"
        }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingValue}
        </div>
      ) : (
        value
      )}
    </button>
  );
}
