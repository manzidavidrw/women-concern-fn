"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/src/components/shared/Button";
import Input from "@/src/components/shared/Input";
import { useLogin } from "@/src/hooks/useAuth";
import { useReloadOnBfcacheRestore } from "@/src/hooks/useReloadOnBfcacheRestore";

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  useReloadOnBfcacheRestore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-w-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-sm rounded-lg border border-w-black/10 p-8 shadow-sm"
      >
        <h1 className="mb-1 text-2xl font-semibold text-w-green">
          Welcome back
        </h1>
        <p className="mb-6 text-sm text-w-black/60">Sign in to your account</p>

        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={18} />}
            requiredStar
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            icon={<Lock size={18} />}
            placeholder="Enter your password"
            requiredStar
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isLoggingIn}
          className="mt-6 w-full"
        >
          {isLoggingIn ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
