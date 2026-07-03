"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/src/components/shared/Button";
import Input from "@/src/components/shared/Input";
import Logo from "@/src/components/shared/Logo";
import { useForgotPassword } from "@/src/hooks/useAuth";

const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPassword(values, {
      onSuccess: () => setSubmittedEmail(values.email),
    });
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-w-white px-4">
      <div className="w-full max-w-sm rounded-lg border border-w-black/10 p-8 shadow-sm">
        <Logo className="mx-auto mb-6 w-20" />
        {submittedEmail ? (
          <>
            <h1 className="mb-1 text-2xl font-semibold text-w-green">Check your email</h1>
            <p className="mb-6 text-sm text-w-black/60">
              If an account exists for <span className="font-medium text-w-black">{submittedEmail}</span>,
              we&apos;ve sent a link to reset your password.
            </p>
            <Link href="/login" className="text-sm font-medium text-w-green hover:underline">
              Back to sign in
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h1 className="mb-1 text-2xl font-semibold text-w-green">Forgot password?</h1>
            <p className="mb-6 text-sm text-w-black/60">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={18} />}
              requiredStar
              error={errors.email?.message}
              {...register("email")}
            />

            <Button type="submit" variant="primary" disabled={isPending} className="mt-6 w-full">
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>

            <Link
              href="/login"
              className="mt-4 block text-center text-sm font-medium text-w-green hover:underline"
            >
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
