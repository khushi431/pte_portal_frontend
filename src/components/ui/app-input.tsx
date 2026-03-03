import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

interface AppInputProps
  extends Omit<React.ComponentProps<typeof Input>, "id"> {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  requiredMark?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
}

export const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
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
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const inputId = id ?? props.name ?? reactId;
    const describedByIds: string[] = [];

    if (description) describedByIds.push(`${inputId}-description`);
    if (error) describedByIds.push(`${inputId}-error`);

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <Label
            htmlFor={inputId}
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
        <Input
          id={inputId}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            describedByIds.length ? describedByIds.join(" ") : undefined
          }
          className={cn(
            "h-9 text-sm",
            error && "aria-invalid",
            className,
          )}
          {...props}
        />
        {description && !error && (
          <p
            id={`${inputId}-description`}
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
            id={`${inputId}-error`}
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

AppInput.displayName = "AppInput";

