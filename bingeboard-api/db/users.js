// ============================================================
//  db/users.js
//  In-memory user "database" — swap for a real DB later
// ============================================================

/**
 * Each user object looks like:
 * {
 *   id: number,
 *   username: string,
 *   email: string,
 *   passwordHash: string   ← bcrypt hash, NEVER the plain password
 * }
 */
export const users = [];
let nextId = 1;

export function createUser({ username, email, passwordHash }) {
  const user = { id: nextId++, username, email, passwordHash };
  users.push(user);
  return user;
}

export function findUserByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function findUserById(id) {
  return users.find((u) => u.id === id) || null;
}