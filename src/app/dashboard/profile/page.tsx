"use client";

import { KeyRound, Pencil } from "lucide-react";
import { useState } from "react";
import ChangePasswordModal from "@/src/components/profile/ChangePasswordModal";
import EditProfileModal from "@/src/components/profile/EditProfileModal";
import ProfileCard from "@/src/components/profile/ProfileCard";
import Button from "@/src/components/shared/Button";

export default function ProfilePage() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-w-green">My Profile</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsEditProfileOpen(true)}
            className="flex items-center gap-2"
          >
            <Pencil size={16} />
            Edit Profile
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsChangePasswordOpen(true)}
            disabled
            title="Not implemented yet"
            className="flex items-center gap-2"
          >
            <KeyRound size={16} />
            Change Password
          </Button>
        </div>
      </div>
      <ProfileCard />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}
