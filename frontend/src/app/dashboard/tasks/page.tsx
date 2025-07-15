import RequireAuth from "@/components/RequireAuth";

export default async function TasksPage() {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  
  return (
  <div>
   <RequireAuth>
  <h2 className="text-xl font-semibold">Welcome to My Tasks</h2>
  </RequireAuth></div> );
}
