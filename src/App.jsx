import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [todoText, setTodoText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleCreate(event) {
    event.preventDefault();
    const trimmedText = todoText.trim();
    if (!trimmedText) {
      toast.error("Task cannot be empty!");
      return;
    }
    const newTodos = [
      ...todos,
      { id: Date.now(), text: trimmedText, completed: false },
    ];
    setTodos(newTodos);
    setTodoText("");
    toast.success("Task added successfully!");
  }

  function handleDelete(id) {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
    toast.success("Task deleted successfully!");
  }

  async function handleEdit(id) {
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    const selectedTodo = todos[todoIndex];

    const { value: newText } = await Swal.fire({
      title: "Edit Task",
      input: "text",
      inputLabel: "Update your task:",
      inputValue: selectedTodo.text,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    });

    if (newText && newText.trim()) {
      const updatedTodos = [...todos];
      updatedTodos[todoIndex] = { ...selectedTodo, text: newText.trim() };
      setTodos(updatedTodos);
      toast.success("Task updated successfully!");
    } else {
      toast.error("Task cannot be empty!");
    }
  }

  function toggleComplete(id) {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    const currenTodo = todos.filter((todo) => todo.id === id)
    if(currenTodo[0].completed === true){
      toast.warning("Task uncompleted!");
    } else {
      toast.success(`Task completed successfully!`)
    }
    
    setTodos(updatedTodos);
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "pending") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="w-[100vw] h-[100vh] grid place-items-center">
      <div className="main-container grid place-items-center shadow p-3">
        <div className="input-container grid place-items-center">
          <form
            className="input-container grid grid-cols-8 gap-3"
            onSubmit={handleCreate}
          >
            <input
              type="text"
              className="border border-solid col-span-5"
              value={todoText}
              onChange={(event) => setTodoText(event.target.value)}
            />
            <button
              className="border border-solid col-span-3"
              type="submit"
              disabled={todoText.trim() === ""}
            >
              Add
            </button>
          </form>
        </div>
        <div className="filter-buttons mt-3">
          <button
            className={`border border-solid p-2 mx-1 ${
              filter === "all" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`border border-solid p-2 mx-1 ${
              filter === "pending" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`border border-solid p-2 mx-1 ${
              filter === "completed" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
        <div className="todo-container m-5">
          <ul>
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className={`flex justify-between items-center mb-2 ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                  />
                  <strong className="ml-3">{todo.text}</strong>
                </div>
                <div>
                  <button
                    className="ml-3 border border-solid p-1 text-red-500"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="ml-3 border border-solid p-1 border-green-500"
                    onClick={() => handleEdit(todo.id)}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
