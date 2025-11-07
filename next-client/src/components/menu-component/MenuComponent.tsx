import { cookies } from "next/headers";
import { authService } from "@/lib/services/authService";
import { MenuClientComponent } from "@/components/menu-client-component/MenuClientComponent";

export default async function MenuComponent() {
    const token = cookies().get("authToken")?.value;

    // Припустимо, у authService є метод getCurrentUser(token)
    let user = null;
    if (token) {
        try {
            user = await authService.getCurrentUser(token);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            user = null;
        }
    }

    const authenticated = !!user;

    return <MenuClientComponent user={user} authenticated={authenticated} />;
}
