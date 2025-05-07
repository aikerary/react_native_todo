export default class Todo {
  constructor(id, name, completed = false) {
    this.id = id;
    this.name = name;
    this.completed = completed;
  }

  static fromApiResponse(apiTodo) {
    return new Todo(apiTodo.id, apiTodo.name, apiTodo.completed || false);
  }

  toApiModel() {
    return {
      id: this.id,
      name: this.name,
      completed: this.completed
    };
  }
}
