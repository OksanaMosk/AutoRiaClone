export interface IUser {
    email: string;
    token?: string;
    profile?: {
        first_name: string;
        last_name: string;
        age: number;
    };
}
