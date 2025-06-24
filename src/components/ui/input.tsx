import * as React from "react";
import { cn } from "@/lib/utils";

interface InputWithIconProps extends React.ComponentProps<"input"> {
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    inputBg?: string; // Thêm prop này nếu muốn custom màu autofill
    useAlternativeAutofill?: boolean; // Option để dùng method khác
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
    (
        {
            className,
            type,
            icon,
            iconPosition = "left",
            inputBg,
            useAlternativeAutofill = false,
            ...props
        },
        ref
    ) => {
        return (
            <div className="relative">
                {icon && iconPosition === "left" && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                        {icon}
                    </span>
                )}

                <input
                    type={type}
                    ref={ref}
                    data-slot="input"
                    style={
                        {
                            "--input-bg": inputBg ?? "var(--input)",
                            // Thêm CSS custom properties để đảm bảo màu đúng
                            "--autofill-text-color": "var(--foreground)",
                            "--autofill-bg-color": inputBg ?? "var(--input)",
                        } as React.CSSProperties
                    }
                    className={cn(
                        // Chọn class autofill phù hợp
                        useAlternativeAutofill ? "custom-autofill-alt" : "custom-autofill",
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border",
                        "bg-[color:var(--input)]", // Nền mặc định
                        "py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        icon && iconPosition === "left"
                            ? "pl-10 pr-3"
                            : icon && iconPosition === "right"
                            ? "pl-3 pr-10"
                            : "px-3",
                        className
                    )}
                    {...props}
                />

                {icon && iconPosition === "right" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                        {icon}
                    </span>
                )}
            </div>
        );
    }
);

InputWithIcon.displayName = "InputWithIcon";

interface InputProps extends React.ComponentProps<"input"> {
    inputBg?: string;
    useAlternativeAutofill?: boolean;
}

function Input({ className, type, inputBg, useAlternativeAutofill = false, ...props }: InputProps) {
    return (
        <input
            type={type}
            data-slot="input"
            style={
                {
                    "--input-bg": inputBg ?? "var(--input)",
                    "--autofill-text-color": "var(--foreground)",
                    "--autofill-bg-color": inputBg ?? "var(--input)",
                } as React.CSSProperties
            }
            className={cn(
                useAlternativeAutofill ? "custom-autofill-alt" : "custom-autofill",
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-[color:var(--input)] px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    );
}

export { Input, InputWithIcon };
