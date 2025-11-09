export interface IUser {
  id?: number;
  email: string;
  token?: string;
  role?: "buyer" | "seller" | "manager" | "admin";
  account_type?: string;
  profile?: {
    name: string;
    surname: string;
    age?: number;
  };
}
