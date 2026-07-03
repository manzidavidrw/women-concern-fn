"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, FileText, Upload, User as UserIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CertificatePreviewModal from "@/src/components/profile/CertificatePreviewModal";
import Button from "@/src/components/shared/Button";
import Input from "@/src/components/shared/Input";
import Modal from "@/src/components/shared/Modal";
import WBadge from "@/src/components/shared/WBadge";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useUpdateProfile } from "@/src/hooks/useAuth";
import { getFileNameFromUrl } from "@/src/lib/fileName";

const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const { user } = useAuthContext();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      address: user?.address ?? "",
      emergencyContact: user?.emergencyContact ?? "",
      dateOfBirth: user?.dateOfBirth ?? "",
    },
  });

  const objectUrl = useMemo(
    () => (profilePicture ? URL.createObjectURL(profilePicture) : null),
    [profilePicture],
  );

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  if (!user) return null;

  const handleClose = () => {
    reset();
    setProfilePicture(null);
    setCertificates([]);
    setPreviewUrl(null);
    onClose();
  };

  const avatarPreview = objectUrl ?? user.profilePictureUrl;
  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
    "?";

  const handleCertificatesChange = (files: FileList | null) => {
    if (!files) return;
    setCertificates((prev) => [...prev, ...Array.from(files)]);
  };

  const removeCertificate = (index: number) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (values: EditProfileFormValues) => {
    updateProfile(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        address: values.address ?? "",
        emergencyContact: values.emergencyContact ?? "",
        dateOfBirth: values.dateOfBirth ?? "",
        profilePicture,
        certificates,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          handleClose();
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to update profile");
        },
      },
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Edit Profile"
        closeOnBackdropClick={false}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- local blob URL or external/unknown host
              <img
                src={avatarPreview}
                alt="Profile preview"
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-w-gold text-xl font-semibold text-w-black">
                {initials}
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-w-black/20 px-3 py-2 text-sm font-medium text-w-black/70 transition-colors hover:bg-w-black/5">
              <UserIcon size={16} />
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProfilePicture(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Phone Number"
              placeholder="Enter phone number"
              requiredStar
              error={errors.phoneNumber?.message}
              {...register("phoneNumber")}
            />
            <Input
              label="Date of Birth"
              type="date"
              error={errors.dateOfBirth?.message}
              {...register("dateOfBirth")}
            />
          </div>

          <Input
            label="Address"
            placeholder="Enter address"
            error={errors.address?.message}
            {...register("address")}
          />

          <Input
            label="Emergency Contact"
            placeholder="Enter emergency contact"
            error={errors.emergencyContact?.message}
            {...register("emergencyContact")}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-w-black">
              Certificates
            </label>

            {user.certificates.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {user.certificates.map((cert, index) => (
                  <li key={`existing-${index}`} className="max-w-[45%]">
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(cert)}
                      className="w-full text-left"
                    >
                      <WBadge
                        variant="outline"
                        size="sm"
                        className="w-full min-w-0 gap-1.5 truncate transition-colors hover:border-w-green/40 hover:text-w-green"
                      >
                        <FileText size={14} className="shrink-0 text-w-green" />
                        <span className="min-w-0 flex-1 truncate">
                          {getFileNameFromUrl(cert)}
                        </span>
                        <Eye size={12} className="shrink-0 text-w-black/40" />
                      </WBadge>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {certificates.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {certificates.map((file, index) => (
                  <li key={`new-${index}`} className="max-w-[45%]">
                    <WBadge
                      variant="success"
                      size="sm"
                      className="w-full min-w-0 gap-1.5 truncate"
                    >
                      <FileText size={14} className="shrink-0 text-w-green" />
                      <span className="min-w-0 flex-1 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeCertificate(index)}
                        className="shrink-0 text-w-black/50 hover:text-w-red"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X size={12} />
                      </button>
                    </WBadge>
                  </li>
                ))}
              </ul>
            )}

            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-w-black/20 px-3 py-2 text-sm font-medium text-w-black/70 transition-colors hover:bg-w-black/5">
              <Upload size={16} />
              Upload Certificates
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleCertificatesChange(e.target.files)}
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
      <CertificatePreviewModal
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </>
  );
}
