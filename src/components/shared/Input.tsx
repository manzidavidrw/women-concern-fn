"use client";

import { Eye, EyeOff } from "lucide-react";
import {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useId,
  useState,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  borderColor?: string;
  textColor?: string;
  labelColor?: string;
  requiredStar?: boolean;
  setShowPassword?: () => void;
  ShowPassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      borderColor,
      textColor,
      labelColor,
      requiredStar,
      setShowPassword,
      ShowPassword,
      type = "text",
      id,
      className = "",
      style,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [internalShowPassword, setInternalShowPassword] = useState(false);

    const isPasswordControlled =
      ShowPassword !== undefined && setShowPassword !== undefined;
    const showPassword = isPasswordControlled
      ? ShowPassword
      : internalShowPassword;
    const togglePassword = isPasswordControlled
      ? setShowPassword
      : () => setInternalShowPassword((prev) => !prev);

    const isPassword = type === "password";
    const isNumber = type === "number";
    const resolvedType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-w-black"
            style={labelColor ? { color: labelColor } : undefined}
          >
            {label}
            {requiredStar && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-w-green">
              {icon}
            </span>
          )}
          <input
            {...props}
            ref={ref}
            id={inputId}
            type={resolvedType}
            inputMode={isNumber ? "numeric" : props.inputMode}
            style={{
              ...(borderColor ? { borderColor } : {}),
              ...(textColor ? { color: textColor } : {}),
              ...style,
            }}
            className={`w-full rounded-md border border-w-black/20 bg-w-white py-2 text-w-black outline-none placeholder:text-w-black/40 focus:border-2 focus:border-w-green ${
              icon ? "pl-10" : "pl-3"
            }
              ${className} ${isPassword ? "pr-10" : "pr-3"} ${error ? "border-w-red" : ""}`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={togglePassword}
              tabIndex={-1}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-w-black/60 hover:text-w-black"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={18} className="text-w-green font-bold" />
              ) : (
                <Eye size={18} className="text-w-green font-bold" />
              )}
            </button>
          )}
        </div>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
