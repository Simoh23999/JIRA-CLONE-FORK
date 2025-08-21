"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button"; // bouton shadcn/ui

interface ButtonBackProps {
  label?: string;
}

const ButtonBack = ({ label = "Back" }: ButtonBackProps) => {
  const router = useRouter();

  return (
    <Button variant={"backbutton"} onClick={() => router.back()}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
};

export default ButtonBack;
