"use client";

import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Todo = {
  id: number;
  text: string;
  editing: boolean;
  completed: boolean;
  priority: number;
  createdAt: number;
};

type SortOption = "priority" | "createdAt";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo.trim(),
          editing: false,
          completed: false,
          priority: 1,
          createdAt: Date.now(),
        },
      ]);
      setNewTodo("");
    }
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  const toggleEdit = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, editing: !todo.editing } : todo
      )
    );
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const changePriority = (id: number, priority: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, priority } : todo))
    );
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortBy === "priority") {
      return b.priority - a.priority;
    } else {
      return b.createdAt - a.createdAt;
    }
  });

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">To-Do List</h1>

        <div className="flex mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow p-2 border rounded-l text-black placeholder-black mr-2"
            placeholder="Add a new task"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
          >
            Add
          </button>
        </div>

        <div className="mb-4">
          <label className="mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="p-2 border rounded text-black"
          >
            <option value="createdAt">Time Created</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <AnimatePresence>
          <motion.ul className="space-y-2">
            {sortedTodos.map((todo) => (
              <motion.li
                key={todo.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.9 }}
                className="flex items-center justify-between bg-gray-100 p-2 rounded text-black"
              >
                <div className="flex items-center flex-grow mr-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="mr-2"
                  />
                  {todo.editing ? (
                    <input
                      type="text"
                      value={todo.text}
                      onChange={(e) => updateTodo(todo.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") toggleEdit(todo.id);
                      }}
                      className="bg-transparent flex-grow outline-none"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`flex-grow ${
                        todo.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <select
                    value={todo.priority}
                    onChange={(e) =>
                      changePriority(todo.id, Number(e.target.value))
                    }
                    className="mr-2 p-1 border rounded text-sm"
                  >
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                  </select>
                  <button
                    onClick={() => toggleEdit(todo.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    {todo.editing ? "Save" : "Edit"}
                  </button>
                  <button
                    onClick={() => removeTodo(todo.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </main>

      <style jsx global>{`
        .todo-enter {
          opacity: 0;
          transform: translateY(-20px);
        }
        .todo-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }
        .todo-exit {
          opacity: 1;
        }
        .todo-exit-active {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
    </div>
  );
}
