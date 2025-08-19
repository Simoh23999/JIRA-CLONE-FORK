interface Task {
  id: string;
  title: string;
  status: string;
}

const TaskCard = ({ task }: { task: Task }) => {
  return (
    <div className="bg-white p-3 rounded shadow hover:bg-gray-50 transition">
      <p className="text-sm text-gray-800">{task.title}</p>
    </div>
  );
};

export default TaskCard;
