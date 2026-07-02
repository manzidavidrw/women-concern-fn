"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Button from "@/src/components/shared/Button";
import Input from "@/src/components/shared/Input";
import Modal from "@/src/components/shared/Modal";
import WSelect from "@/src/components/shared/WSelect";
import { useCreateUser } from "@/src/hooks/useUsers";

const ROLE_OPTIONS = [
  { label: "Admin", value: "ADMIN" },
  { label: "Executive Director", value: "EXECUTIVE_DIRECTOR" },
  { label: "Project Manager", value: "PROJECT_MANAGER" },
  { label: "Finance", value: "FINANCE" },
  { label: "Field Officer", value: "FIELD_OFFICER" },
];

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

const registerUserSchema = z.object({
  email: z.email("Enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["MALE", "FEMALE"], { error: "Select a gender" }),
  phoneNumber: z.string().min(1, "Phone number is required"),
  role: z.enum(["ADMIN", "EXECUTIVE_DIRECTOR", "PROJECT_MANAGER", "FINANCE", "FIELD_OFFICER"], {
    error: "Select a role",
  }),
  joinedAt: z.string().min(1, "Joined date is required"),
});

type RegisterUserFormValues = z.infer<typeof registerUserSchema>;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const { mutate: registerUser, isPending } = useCreateUser();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterUserFormValues>({ resolver: zodResolver(registerUserSchema) });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: RegisterUserFormValues) => {
    registerUser(values, {
      onSuccess: (message) => {
        toast.success(message || "User created successfully");
        handleClose();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to create user");
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add User">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            placeholder="Enter first name"
            requiredStar
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last Name"
            placeholder="Enter last name"
            requiredStar
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="Enter email"
          requiredStar
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            requiredStar
            error={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <WSelect
                label="Gender"
                requiredStar
                placeholder="Select gender"
                options={GENDER_OPTIONS}
                error={errors.gender?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <WSelect
                label="Role"
                requiredStar
                placeholder="Select role"
                options={ROLE_OPTIONS}
                error={errors.role?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          <Input
            label="Joined At"
            type="date"
            requiredStar
            error={errors.joinedAt?.message}
            {...register("joinedAt")}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
