import { UserRole, ROLE_COOKIE } from "./routes";

export { ROLE_COOKIE };

/** Read the role from the cookie (server component / server action only) */
export async function getRole(): Promise<UserRole | null> {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const role = cookieStore.get(ROLE_COOKIE)?.value;
    if (!role) return null;
    return role as UserRole;
}
