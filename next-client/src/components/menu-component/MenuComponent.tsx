import { cookies } from "next/headers";
import { authService } from "@/lib/services/authService";

import { IUser } from "@/models/IUser";
import {MenuClientComponent} from "@/components/menuClient-component/MenuClientComponent";

export const MenuComponent = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("authToken")?.value;

    let user: IUser | null = null;

    if (token) {
        try {
            user = await authService.getCurrentUser(token);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            user = null;
        }
    }

    const authenticated = !!user;

   return  <MenuClientComponent user={user} authenticated={authenticated} />
};

