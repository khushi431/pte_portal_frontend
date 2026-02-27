import { ReactNode } from "react";

/** Pass-through layout — each sub-route (admin, teacher, student) has its own layout */
export default function TenantLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}