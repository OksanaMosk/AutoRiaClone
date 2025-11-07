
import { cookies } from "next/headers";
import { authService } from "@/lib/services/authService";
import {MenuClientComponent} from "@/components/menu-client-component/MenuClientComponent";

export default async function MenuComponent() {
    const token = (await cookies()).get("authToken")?.value;
    const user = token ? await authService() : null;
    const authenticated = !!user;

    return (
        <MenuClientComponent user={user} authenticated={authenticated} />
    );
}