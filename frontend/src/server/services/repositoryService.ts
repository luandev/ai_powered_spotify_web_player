import { UserJson } from "./types";

type dbUser = UserJson & { id: string };
const mockDb: { [key: string]: dbUser } = {};

export const saveUser = async (userJson: Omit<UserJson, 'id'>): Promise<string> => {
  const id = Object.keys(mockDb).length.toString();
  mockDb[id] = { id, ...userJson };
  return id;
};

export const getUserJson = async (id: string): Promise<UserJson | null> => {
  return mockDb[id] || null;
};