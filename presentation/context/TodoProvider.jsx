import React, { useEffect, useState, createContext } from "react";
import TodoService from "../../data/datasources/TodoService";
import TodoRepository from "../../data/repositories/TodoRepository";
import TodoUseCases from "../../domain/usecases/TodoUseCases";
import Todo from "../../domain/entities/Todo";
import StatsService from "../../domain/services/StatsService";
import { generateId } from '../../utils/idGenerator';

export const TodoContext = createContext({
  todos: [],
  loading: false,
  error: null,
  stats: {
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  },
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
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  });
  
  // Create repository and use cases as objects correctly
  const todoRepository = new TodoRepository(TodoService);
  const todoUseCases = new TodoUseCases(todoRepository);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await todoUseCases.getTodos();
      setTodos(data);
    } catch (err) {
      setError("Failed to fetch todos.");
      console.error("Failed to fetch todos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    const newStats = StatsService.calculateStats(todos);
    setStats(newStats);
  }, [todos]);

  const createTodo = async (todoData) => {
    setLoading(true);
    try {
      // Generate an ID for the new todo
      const id = generateId('todo');
      const newTodo = new Todo(id, todoData.name, todoData.completed || false);
      
      const result = await todoUseCases.addTodo(newTodo);
      
      if (result) {
        // Update local state with the new todo that has our generated ID
        setTodos(prevTodos => [...prevTodos, result]);
        return true;
      }
      
      await fetchTodos(); // Fallback to fetching all todos
      return false;
    } catch (err) {
      setError("Failed to create todo.");
      console.error("Create todo failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (todoData) => {
    setLoading(true);
    try {
      const todo = new Todo(todoData.id, todoData.name, todoData.completed);
      await todoUseCases.updateTodo(todo);
      await fetchTodos();
      return true;
    } catch (err) {
      setError("Failed to update todo.");
      console.error("Update todo failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleTodoComplete = async (id) => {
    setLoading(true);
    try {
      await todoUseCases.toggleTodoComplete(id);
      await fetchTodos();
      return true;
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
      const success = await todoUseCases.deleteTodo(id);
      if (success) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to delete todo.");
      console.error("Delete todo failed:", err);
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
        stats,
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
