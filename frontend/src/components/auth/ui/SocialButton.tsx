import Image from "next/image";

export default function GoogleButton() {
  return (
    <div className="flex items-center justify-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
      <button
        type="button"
        className="flex items-center justify-center w-[161px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-4 px-4 rounded-[32px] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2  gap-3"
      >
        <Image
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        Google
      </button>
    </div>
  );
}
