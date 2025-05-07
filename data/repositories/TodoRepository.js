import Todo from "../../domain/entities/Todo";

export default class TodoRepository {
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  async getTodos() {
    const apiTodos = await this.dataSource.getTodo();
    return apiTodos.map((todo) => {
      // Prioritize identification_number over id
      const id = todo.identification_number || todo.id;
      return Todo.fromApiResponse({...todo, id});
    });
  }

  async addTodo(todo) {
    const result = await this.dataSource.addTodo(todo.toApiModel());
    return todo; // Return the original todo with its client-generated ID
  }

  async updateTodo(todo) {
    if (!todo.id) {
      console.error("Attempted to update todo without ID", todo);
      return false;
    }
    return this.dataSource.updateTodo(todo.toApiModel());
  }

  async deleteTodo(id) {
    if (!id) {
      console.error("Attempted to delete todo without ID");
      return false;
    }
    return this.dataSource.deleteTodo(id);
  }
}
