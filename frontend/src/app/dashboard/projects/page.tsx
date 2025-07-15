export default async function TasksPage() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return <h1 className="text-xl font-semibold">Welcome to projects</h1>;
}
