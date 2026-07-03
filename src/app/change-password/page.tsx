"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/src/components/shared/Button";
import Input from "@/src/components/shared/Input";
import Logo from "@/src/components/shared/Logo";
import { useResetPassword } from "@/src/hooks/useAuth";
import { tokenStore } from "@/src/lib/tokenStore";

const changePasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const { mutate: resetPassword, isPending } = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = (values: ChangePasswordFormValues) => {
    resetPassword({
      token: tokenStore.getAccessToken() ?? "",
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-w-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-sm rounded-lg border border-w-black/10 p-8 shadow-sm"
      >
        <Logo className="mx-auto mb-6 w-20" />
        <h1 className="mb-1 text-2xl font-semibold text-w-green">Set a new password</h1>
        <p className="mb-6 text-sm text-w-black/60">
          You must change your password before continuing.
        </p>

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
          {isPending ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
