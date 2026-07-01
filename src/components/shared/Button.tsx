import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-w-green text-w-white hover:bg-w-green/90",
  secondary: "bg-w-gold text-w-black hover:bg-w-gold/90",
  danger: "bg-w-red text-w-white hover:bg-w-red/90",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={`rounded-md px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      />
    );
  },
);

Button.displayName = "Button";

export default Button;
