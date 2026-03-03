import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ActionVariant = "view" | "edit" | "delete" | "default";

const VARIANT_STYLES: Record<ActionVariant, string> = {
    view: "border-purple-200 text-purple-700 hover:bg-purple-600 hover:border-purple-600 hover:text-white",
    edit: "border-amber-200 text-amber-600 hover:bg-amber-500 hover:border-amber-500 hover:text-white",
    delete: "border-red-200 text-red-500 hover:bg-red-500 hover:border-red-500 hover:text-white",
    default:
        "border-slate-200 text-slate-600 hover:bg-slate-600 hover:border-slate-600 hover:text-white",
};

interface CommonProps {
    icon: React.ReactNode;
    label: string; // used for title + aria-label
    variant?: ActionVariant;
    className?: string;
    disabled?: boolean;
}

type ActionIconButtonProps =
    | (CommonProps & {
        href: string;
        onClick?: never;
        type?: never;
    })
    | (CommonProps & {
        href?: never;
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
        type?: "button" | "submit" | "reset";
    });

export function ActionIconButton(props: ActionIconButtonProps) {
    const {
        icon,
        label,
        variant = "default",
        className,
        disabled,
    } = props;

    const base = cn(
        "inline-flex size-9 items-center justify-center rounded-full border bg-white transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANT_STYLES[variant],
        className
    );

    if ("href" in props) {
        return (
            <Link
                href={props.href}
                className={base}
                aria-label={label}
                title={label}
            >
                {icon}
            </Link>
        );
    }

    return (
        <button
            type={props.type ?? "button"}
            onClick={props.onClick}
            className={base}
            aria-label={label}
            title={label}
            disabled={disabled}
        >
            {icon}
        </button>
    );
}

