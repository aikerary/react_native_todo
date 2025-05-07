export default class TodoUseCases {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async getTodos() {
    return this.todoRepository.getTodos();
  }

  async addTodo(todo) {
    const createdTodo = await this.todoRepository.addTodo(todo);
    return createdTodo;
  }

  async updateTodo(todo) {
    return this.todoRepository.updateTodo(todo);
  }

  async toggleTodoComplete(id) {
    const todos = await this.todoRepository.getTodos();
    const todo = todos.find((todo) => todo.id === id);

    if (todo) {
      todo.completed = !todo.completed;
      return this.todoRepository.updateTodo(todo);
    }
    return false;
  }

  async deleteTodo(id) {
    return this.todoRepository.deleteTodo(id);
  }
}
