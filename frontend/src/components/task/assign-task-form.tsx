"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useAssignTask } from "@/features/tasks/api/use-assign-task"
import { Member } from "../organisation/types"
import { ProjectMember } from "@/types/PRojectMember"

const schema = z.object({
  assignee: z.number({}),
})

interface AssignTaskFormProps {
  taskId: number | string
  members: ProjectMember[]
  onSuccess?: () => void
  oncancel: () => void
}

export function AssignTaskForm({ taskId, members, onSuccess ,oncancel}: AssignTaskFormProps) {
  const [search, setSearch] = useState("")
  const assignTask = useAssignTask()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { assignee: undefined },
  })

  const filteredMembers = useMemo(() => {
    return members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [members, search])

  function onSubmit(values: z.infer<typeof schema>) {
    assignTask.mutate(
      { taskId, assigneeProjectMembershipId: values.assignee },
      {
        onSuccess: () => {
          form.reset()
          onSuccess?.()
            oncancel();
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-4 border rounded-lg bg-white shadow-sm"
      >
        <FormField
          control={form.control}
          name="assignee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigner à</FormLabel>
              <FormControl>
                <Select
                  value={field.value ? field.value.toString() : ""}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Sélectionner un membre" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Barre de recherche */}
                    <div className="p-2">
                      <Input
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Liste filtrée */}
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{m.fullName}</span>
                            <span className="text-xs text-gray-500">{m.email}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        Aucun utilisateur trouvé
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={assignTask.isPending}>
          {assignTask.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Assigner
        </Button>
      </form>
    </Form>
  )
}
