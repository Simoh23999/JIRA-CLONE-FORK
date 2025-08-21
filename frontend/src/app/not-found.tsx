// app/not-found.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/404_2.svg"
            alt="Page introuvable"
            width={400}
            height={400}
            className="animate-accordion-down"
          />
        </div>

        <div className="md:w-1/2 flex flex-col items-center md:items-start">
          <h1 className="text-7xl font-extrabold text-[#1D71B8]">404</h1>
          <h2 className="text-2xl font-semibold text-[#142D5C] mt-4">
            Oops, cette page est introuvable
          </h2>
          <p className="mt-4 text-[#1D71B8] max-w-md">
            Le lien est peut-être expiré ou la page a été déplacée. Vérifiez
            l’URL ou revenez à l’accueil.
          </p>

          <div className="mt-6 flex space-x-4">
            <Link
              href="/"
              className="px-6 py-3 bg-[#1D71B8] text-white rounded-lg shadow hover:bg-[#142D5C] transition"
            >
              Retour à l’accueil
            </Link>
            <Link
              href="#"
              className="px-6 py-3 bg-white border border-[#1D71B8] text-[#1D71B8] rounded-lg hover:bg-[#E6F0FA] transition"
            >
              Page précédente
            </Link>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-6 w-full flex flex-col items-center text-sm text-gray-500">
        <Image src="/TaskFlow.png" alt="TaskFlow Logo" width={60} height={60} />
        <p className="mt-2">
          © {new Date().getFullYear()} TaskFlow – Tous droits réservés
        </p>
      </footer>
    </div>
  );
}
