export interface IUser {
  id?: number;
  email: string;
  token?: string;
  role?: "buyer" | "seller" | "manager" | "admin";
  account_type?: string;
  profile?: {
    first_name: string;
    last_name: string;
    age?: number;
  };
}
