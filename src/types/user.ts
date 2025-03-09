export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}