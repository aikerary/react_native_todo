/**
 * Service to calculate statistics about todos
 */
export default class StatsService {
  /**
   * Calculate statistics about todos
   * @param {Array} todos - Array of todos
   * @returns {Object} Statistics
   */
  static calculateStats(todos) {
    if (!todos || !todos.length) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        completionRate: 0
      };
    }

    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      pending,
      completionRate: Math.round(completionRate)
    };
  }
}
