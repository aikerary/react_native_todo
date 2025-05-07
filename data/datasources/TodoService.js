const BASE_URL = "https://unidb.openlab.uninorte.edu.co";
const CONTRACT_KEY = "todo_gelatto";
const TABLE = "todos";

// Export as an object with methods, not a class
const TodoService = {
  async getTodo() {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/all?format=json`;
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.status !== 200) {
        throw new Error(`Error code ${response.status}`);
      }

      const decoded = await response.json();
      const rawData = decoded.data || [];

      const todos = rawData.map((record) => {
        const { entry_id, data } = record;
        return {
          entry_id: entry_id, // Keep this for reference but don't use it for operations
          id: data.identification_number || entry_id, // Prioritize our custom ID
          ...data
        };
      });

      return todos;
    } catch (err) {
      console.error("getTodo error:", err);
      throw err;
    }
  },

  async addTodo(todo) {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/store`;

    try {
      // Always include identification_number in the data
      const todoData = {
        ...todo,
        identification_number: todo.id
      };
      
      delete todoData.id; // Remove id from the payload to avoid confusion

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          table_name: TABLE,
          data: todoData
        })
      });

      if (res.status === 200) {
        // Return the original todo with client-generated ID
        return { ...todo, identification_number: todo.id };
      } else {
        const text = await res.text();
        console.error(`addTodo failed ${res.status}:`, text);
        return null;
      }
    } catch (err) {
      console.error("addTodo error:", err);
      return null;
    }
  },

  async updateTodo(todo) {
    if (!todo.id) throw new Error("Todo.id is required");

    const { id, ...fields } = todo;

    // First, find the entry with matching identification_number
    try {
      // Get all todos
      const todos = await this.getTodo();
      
      // Find the one with matching identification_number
      const todoToUpdate = todos.find(t => 
        t.identification_number === id || 
        t.id === id
      );
      
      if (!todoToUpdate || !todoToUpdate.entry_id) {
        console.error(`Todo with identification_number ${id} not found`);
        return false;
      }

      // Now update using the entry_id from the database
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/update/${todoToUpdate.entry_id}`;
      
      // Include identification_number in the update data
      const dataToUpdate = {
        ...fields,
        identification_number: id // Always store our ID
      };

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ data: dataToUpdate })
      });

      if (res.status === 200) {
        return true;
      } else {
        const text = await res.text();
        console.error(`updateTodo failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      console.error("updateTodo error:", err);
      return false;
    }
  },

  async deleteTodo(todoOrId) {
    const id = typeof todoOrId === "string" ? todoOrId : todoOrId.id;

    if (!id) throw new Error("Todo.id is required");
    
    try {
      // Get all todos
      const todos = await this.getTodo();
      
      // Find the one with matching identification_number
      const todoToDelete = todos.find(t => 
        t.identification_number === id || 
        t.id === id
      );
      
      if (!todoToDelete || !todoToDelete.entry_id) {
        console.error(`Todo with identification_number ${id} not found`);
        return false;
      }
      
      // Use the entry_id for deletion
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/delete/${todoToDelete.entry_id}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json; charset=UTF-8" }
      });

      if (res.status === 200) {
        return true;
      } else {
        const text = await res.text();
        console.error(`deleteTodo failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      console.error("deleteTodo error:", err);
      return false;
    }
  }
};

export default TodoService;
