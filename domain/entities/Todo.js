import { generateId } from '../../utils/idGenerator';

export default class Todo {
  constructor(id, name, completed = false) {
    // Always generate an ID if none provided
    this.id = id || generateId('todo');
    this.name = name || "";
    this.completed = completed || false;
    // Add identification_number as an alias to id
    this.identification_number = this.id;
  }

  static fromApiResponse(apiTodo) {
    if (!apiTodo) return new Todo(generateId('todo'), "", false);
    
    // Prioritize identification_number over id
    const id = apiTodo.identification_number || apiTodo.id || generateId('todo');
    
    return new Todo(
      id,
      apiTodo.name,
      apiTodo.completed === true
    );
  }

  toApiModel() {
    return {
      id: this.id,
      identification_number: this.id, // Ensure identification_number is always set
      name: this.name,
      completed: this.completed
    };
  }
}
