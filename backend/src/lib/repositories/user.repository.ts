import { User, getUsers, addUser, updateUser } from "../db";

export class UserRepository {
  async getById(id: string): Promise<User | null> {
    const users = await getUsers();
    return users.find(u => u.id === id) || null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const users = await getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async getAll(): Promise<User[]> {
    return await getUsers();
  }

  async create(user: Omit<User, "id" | "createdAt" | "status" | "joinedDate">): Promise<User> {
    return await addUser(user);
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    return await updateUser(id, updates);
  }
}
