import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

interface Option {
  value: string;
  label: string;
}

interface AppSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  requiredMark?: boolean;
  options?: Option[];
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
}

export const AppSelect = React.forwardRef<HTMLSelectElement, AppSelectProps>(
  (
    {
      id,
      label,
      description,
      error,
      requiredMark,
      className,
      containerClassName,
      labelClassName,
      descriptionClassName,
      errorClassName,
      options,
      children,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const selectId = id ?? props.name ?? reactId;
    const describedByIds: string[] = [];

    if (description) describedByIds.push(`${selectId}-description`);
    if (error) describedByIds.push(`${selectId}-error`);

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <Label
            htmlFor={selectId}
            className={cn("text-xs font-medium text-slate-600", labelClassName)}
          >
            <span>{label}</span>
            {requiredMark && (
              <span className="ml-0.5 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </Label>
        )}
        <select
          id={selectId}
          ref={ref}
          aria-describedby={
            describedByIds.length ? describedByIds.join(" ") : undefined
          }
          className={cn(
            "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-slate-700 outline-none shadow-xs transition-[color,box-shadow] focus:border-ring focus:ring-ring/50 focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive",
            className,
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {description && !error && (
          <p
            id={`${selectId}-description`}
            className={cn(
              "text-[11px] text-slate-400",
              descriptionClassName,
            )}
          >
            {description}
          </p>
        )}
        {error && (
          <p
            id={`${selectId}-error`}
            className={cn(
              "text-[11px] text-red-500",
              errorClassName,
            )}
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

AppSelect.displayName = "AppSelect";

