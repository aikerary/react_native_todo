/**
 * Generates a unique ID with a specified prefix
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} A unique ID
 */
export const generateId = (prefix = 'todo') => {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${randomPart}`;
};
