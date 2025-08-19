"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { addMemberSchema } from "@/features/Membership/schemas";
import { useAddMemberToOrganization } from "@/features/Membership/api/use-add-member";
import { Crown, Shield, User } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface Props {
   onCancel?: () => void;
  onSuccess?: () => void;
  orgId:number;
}


const AddMemeberForm =  ({orgId,onCancel,onSuccess }: Props) => {
  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
      organizationId: orgId
    },
  });
  const { mutate: addMember } = useAddMemberToOrganization();
  const onSubmit = async (values: z.infer<typeof addMemberSchema>) => {
    try {
      form.reset();
      onSuccess?.();
      onCancel?.();
      addMember(values);
    } catch (error) {
      console.error(error);
      onCancel?.();
	    toast.error("Erreur lors de la ajoute du membre");
    }
  };

  return (
   <Card className="w-full h-full border-none shadow-none">
  <CardHeader className="flex justify-center">
    <CardTitle className="text-xl font-bold justify-center">
      Ajouter un nouveau membre
    </CardTitle>
  </CardHeader>
  <div className="px-10">
    <Separator />
  </div>
  <CardContent>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-4 p-2 pl-5">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input placeholder="exemple@Task.flow" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-y-4 p-2 pl-5">

        <FormField
          name="role"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2"
                >
                  {/* Membre */}
                  <label
                    htmlFor="role-member"
                    className={`flex cursor-pointer items-center rounded-md border p-3 transition
                      ${
                        field.value === "MEMBER"
                          ? "border-[#769fcd] bg-[#d6e6f2]"
                          : "border-[#b9d7ea] bg-[#f7fbfc]"
                      }
                      hover:border-[#769fcd] hover:bg-[#d6e6f2]
                    `}
                  >
                    <RadioGroupItem
                      value="MEMBER"
                      id="role-member"
                      className="sr-only"
                    />
                    <User
                      className={`mr-2 w-4 h-4 ${
                        field.value === "MEMBER"
                          ? "text-[#769fcd]"
                          : "text-[#b9d7ea]"
                      }`}
                    />
                    <div>
                      <div className="text-sm font-medium">Membre</div>
                      <div className="text-xs text-muted-foreground">
                        Accès collaboratif
                      </div>
                    </div>
                  </label>

                  {/* Admin Projet */}
                  <label
                    htmlFor="role-admin"
                    className={`flex cursor-pointer items-center rounded-md border p-3 transition
                      ${
                        field.value === "ADMINPROJECT"
                          ? "border-[#769fcd] bg-[#d6e6f2]"
                          : "border-[#b9d7ea] bg-[#f7fbfc]"
                      }
                      hover:border-[#769fcd] hover:bg-[#d6e6f2]
                    `}
                  >
                    <RadioGroupItem
                      value="ADMINPROJECT"
                      id="role-admin"
                      className="sr-only"
                    />
                    <Shield
                      className={`mr-2 w-4 h-4 ${
                        field.value === "ADMINPROJECT"
                          ? "text-[#769fcd]"
                          : "text-[#b9d7ea]"
                      }`}
                    />
                    <div>
                      <div className="text-sm font-medium">Admin Projet</div>
                      <div className="text-xs text-muted-foreground">
                        Gestion complète
                      </div>
                    </div>
                  </label>

                  {/* Propriétaire */}
                  {/* <label
                    htmlFor="role-owner"
                    className={`flex cursor-pointer items-center rounded-md border p-3 transition
                      ${
                        field.value === "OWNER"
                          ? "border-[#769fcd] bg-[#d6e6f2]"
                          : "border-[#b9d7ea] bg-[#f7fbfc]"
                      }
                      hover:border-[#769fcd] hover:bg-[#d6e6f2]
                    `}
                  >
                    <RadioGroupItem
                      value="OWNER"
                      id="role-owner"
                      className="sr-only"
                    />
                    <Crown
                      className={`mr-2 w-4 h-4 ${
                        field.value === "OWNER"
                          ? "text-[#769fcd]"
                          : "text-[#b9d7ea]"
                      }`}
                    />
                    <div>
                      <div className="text-sm font-medium">Propriétaire</div>
                      <div className="text-xs text-muted-foreground">
                        Accès illimité
                      </div>
                    </div>
                  </label> */}

                  
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
  )}
          />
        </div>

        <div className="flex items-center justify-between mt-7">
          <Button type="submit" size="lg">
            Ajouter le membre
          </Button>

          <Button
            type="button"
            size="lg"
            variant="ghost"
            onClick={onCancel}
          >
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  </CardContent>
</Card>
  );
};

export default AddMemeberForm;
