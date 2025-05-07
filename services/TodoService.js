const BASE_URL = "https://unidb.openlab.uninorte.edu.co";
const CONTRACT_KEY = "todo_potato";
const TABLE = "todos";

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
          id: entry_id,
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
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          table_name: TABLE,
          data: todo
        })
      });

      if (res.status === 200) {
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
    console.log("updateTodo", todo);
    if (!todo.id) throw new Error("Todo.id is required");

    const { id, ...fields } = todo;
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/update/${id}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ data: fields })
      });

      console.log(`updateTodo status ${res.status}`);
      if (res.status === 200) {
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
    console.log(todoOrId);

    const id = typeof todoOrId === "string" ? todoOrId : todoOrId.id;

    if (!id) throw new Error("Todo.id is required");
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/delete/${id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json; charset=UTF-8" }
      });

      console.log(`deleteTodo status ${res.status}`);
      if (res.status === 200) {
      } else {
        const text = await res.text();
        console.error(`deleteTodo failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      console.error("deleteTodo error:", err);
      return false;
    }
  },

  async deleteTodos() {
    try {
      const all = await this.getTodo();
      for (const p of all) {
        await this.deleteTodo(p.id);
      }
      return true;
    } catch (err) {
      console.error("deleteTodo error:", err);
      return false;
    }
  }
};

export default TodoService;
