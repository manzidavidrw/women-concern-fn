"use client";

import {
  Briefcase,
  Cake,
  Calendar,
  Clock,
  Contact,
  GraduationCap,
  IdCard,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { DetailRow, Section } from "@/src/components/shared/DetailView";
import Modal from "@/src/components/shared/Modal";
import WBadge from "@/src/components/shared/WBadge";
import WLoader from "@/src/components/shared/WLoader";
import { RoleBadge } from "@/src/components/shared/table/Table";
import { useUser } from "@/src/hooks/useUsers";
import { formatDate, formatDateTime } from "@/src/lib/formatDate";

interface UserDetailModalProps {
  userId: string | null;
  onClose: () => void;
}

export default function UserDetailModal({ userId, onClose }: UserDetailModalProps) {
  const { data: user, isLoading, error } = useUser(userId ?? "");

  return (
    <Modal isOpen={Boolean(userId)} onClose={onClose} title="User Details">
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <WLoader />
        </div>
      )}

      {error && <p className="text-w-red">{error.message}</p>}

      {user && (
        <div className="space-y-5">
          <div className="-mx-6 -mt-6 flex items-center gap-4 bg-w-green/5 px-6 py-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-w-gold text-xl font-semibold text-w-black">
              {`${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-w-black">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-w-black/60">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <RoleBadge>{user.role.replace(/_/g, " ").toLowerCase()}</RoleBadge>
                <WBadge variant={user.isActive ? "primary" : "danger"}>
                  {user.isActive ? "Active" : "Inactive"}
                </WBadge>
              </div>
            </div>
          </div>

          <Section title="Contact">
            <DetailRow icon={<Mail size={16} />} label="Email" value={user.email} />
            <DetailRow icon={<Phone size={16} />} label="Phone Number" value={user.phoneNumber} />
            <DetailRow icon={<MapPin size={16} />} label="Address" value={user.address} />
            <DetailRow
              icon={<Contact size={16} />}
              label="Emergency Contact"
              value={user.emergencyContact}
            />
          </Section>

          <Section title="Work">
            <DetailRow icon={<Briefcase size={16} />} label="Job Title" value={user.jobTitle} />
            <DetailRow
              icon={<GraduationCap size={16} />}
              label="Certificates"
              value={user.certificates}
            />
            <DetailRow
              icon={<Calendar size={16} />}
              label="Joined At"
              value={formatDate(user.joinedAt)}
            />
          </Section>

          <Section title="Personal">
            <DetailRow
              icon={<UserRound size={16} />}
              label="Gender"
              value={<span className="capitalize">{user.gender.toLowerCase()}</span>}
            />
            <DetailRow
              icon={<Cake size={16} />}
              label="Date of Birth"
              value={formatDate(user.dateOfBirth)}
            />
            <DetailRow icon={<IdCard size={16} />} label="National ID" value={user.nationalId} />
          </Section>

          <Section title="Account">
            <DetailRow
              icon={<Clock size={16} />}
              label="Created At"
              value={formatDateTime(user.createdAt)}
            />
            <DetailRow
              icon={<Clock size={16} />}
              label="Updated At"
              value={formatDateTime(user.updatedAt)}
            />
          </Section>
        </div>
      )}
    </Modal>
  );
}
