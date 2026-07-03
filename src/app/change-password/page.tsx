"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Button from "@/src/components/shared/Button";
import Input from "@/src/components/shared/Input";
import Logo from "@/src/components/shared/Logo";
import { useChangePassword } from "@/src/hooks/useAuth";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const { mutate: changePassword, isPending } = useChangePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword(values, {
      onSuccess: (message) => {
        toast.success(message || "Password changed successfully");
        router.push("/dashboard");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to change password");
      },
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
            label="Current Password"
            type="password"
            icon={<Lock size={18} />}
            placeholder="Enter current password"
            requiredStar
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
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
