
import { cookies } from "next/headers";
import {getUser} from "@/services/auth_services/getUser";
import {MenuClientComponent} from "@/components/menu-client-component/MenuClientComponent";

export default async function MenuComponent() {
    const token = (await cookies()).get("authToken")?.value;
    const user = token ? await getUser() : null;
    const authenticated = !!user;

    return (
        <MenuClientComponent user={user} authenticated={authenticated} />
    );
}