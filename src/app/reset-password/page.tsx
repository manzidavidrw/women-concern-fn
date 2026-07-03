"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/src/components/shared/Button";
import Input from "@/src/components/shared/Input";
import Logo from "@/src/components/shared/Logo";
import { usePublicResetPassword } from "@/src/hooks/useAuth";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordCard() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutate: resetPassword, isPending } = usePublicResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!token) return;
    resetPassword({ token, ...values });
  };

  if (!token) {
    return (
      <div className="w-full max-w-sm rounded-lg border border-w-black/10 p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-w-green">Invalid or expired link</h1>
        <p className="mb-6 text-sm text-w-black/60">
          This password reset link is missing or no longer valid. Request a new one to continue.
        </p>
        <Link href="/forgot-password" className="text-sm font-medium text-w-green hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-sm rounded-lg border border-w-black/10 p-8 shadow-sm"
    >
      <h1 className="mb-1 text-2xl font-semibold text-w-green">Reset your password</h1>
      <p className="mb-6 text-sm text-w-black/60">Enter a new password for your account.</p>

      <div className="flex flex-col gap-4">
        <Input
          label="New Password"
          type="password"
          icon={<Lock size={18} />}
          placeholder="Enter new password"
          requiredStar
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <Input
          label="Confirm Password"
          type="password"
          icon={<Lock size={18} />}
          placeholder="Re-enter new password"
          requiredStar
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <Button type="submit" variant="primary" disabled={isPending} className="mt-6 w-full">
        {isPending ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-w-white px-4">
      <Logo className="mb-6 w-20" />
      <Suspense fallback={null}>
        <ResetPasswordCard />
      </Suspense>
    </div>
  );
}
