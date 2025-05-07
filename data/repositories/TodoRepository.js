import Todo from "../../domain/entities/Todo";

export default class TodoRepository {
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  async getTodos() {
    const apiTodos = await this.dataSource.getTodo();
    return apiTodos.map((todo) => Todo.fromApiResponse(todo));
  }

  async addTodo(todo) {
    return this.dataSource.addTodo(todo.toApiModel());
  }

  async updateTodo(todo) {
    return this.dataSource.updateTodo(todo.toApiModel());
  }

  async deleteTodo(id) {
    return this.dataSource.deleteTodo(id);
  }
}
