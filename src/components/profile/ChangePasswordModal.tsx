"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Button from "@/src/components/shared/Button";
import Input from "@/src/components/shared/Input";
import Modal from "@/src/components/shared/Modal";
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

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { mutate: changePassword, isPending } = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword(values, {
      onSuccess: (message) => {
        toast.success(message || "Password changed successfully");
        handleClose();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to change password");
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      closeOnBackdropClick={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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
          label="Confirm New Password"
          type="password"
          icon={<Lock size={18} />}
          placeholder="Re-enter new password"
          requiredStar
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
