import React, { useEffect, useState, createContext } from "react";
import TodoService from "../services/TodoService.js";

export const TodoContext = createContext({
  todos: [],
  loading: false,
  error: null,
  refreshTodos: () => {},
  createTodo: async (data) => {},
  updateTodo: async (todo) => {},
  toggleTodoComplete: async (id) => {},
  deleteTodo: async (id) => {}
});

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await TodoService.getTodo();
      setTodos(data);
    } catch (err) {
      setError("Failed to fetch Todo.");
      console.error("Failed to fetch Todo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async (todoData) => {
    setLoading(true);
    try {
      await TodoService.addTodo(todoData);
      await fetchTodos();
      return true;
    } catch (err) {
      setError("Failed to create Todo.");
      console.error("Create Todo failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (todo) => {
    setLoading(true);
    try {
      await TodoService.updateTodo(todo);
      await fetchTodos();
      return true;
    } catch (err) {
      setError("Failed to update Todo.");
      console.error("Update Todo failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleTodoComplete = async (id) => {
    setLoading(true);
    try {
      const todo = todos.find(item => item.id === id);
      if (todo) {
        const updatedTodo = {
          ...todo,
          completed: !todo.completed
        };
        await TodoService.updateTodo(updatedTodo);
        await fetchTodos();
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to toggle todo completion.");
      console.error("Toggle todo completion failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      const success = await TodoService.deleteTodo(id);
      if (success) {
        setTodos((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to delete Todo.");
      console.error("Delete Todo failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        refreshTodos: fetchTodos,
        createTodo,
        updateTodo,
        toggleTodoComplete,
        deleteTodo
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
