"use client";

import {
  Briefcase,
  Cake,
  Calendar,
  Contact,
  Eye,
  FileText,
  GraduationCap,
  IdCard,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import CertificatePreviewModal from "@/src/components/profile/CertificatePreviewModal";
import { DetailRow, Section } from "@/src/components/shared/DetailView";
import WBadge from "@/src/components/shared/WBadge";
import { RoleBadge } from "@/src/components/shared/table/Table";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { formatDate } from "@/src/lib/formatDate";
import { getFileNameFromUrl } from "@/src/lib/fileName";

export default function ProfileCard() {
  const { user } = useAuthContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!user) return null;

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
    "?";

  return (
    <div className="space-y-5 rounded-lg border border-w-black/10 bg-w-white shadow-sm">
      <div className="flex items-center gap-4 rounded-t-lg bg-w-green/5 px-6 py-5">
        {user.profilePictureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external/unknown host, avoid next/image remotePatterns coupling
          <img
            src={user.profilePictureUrl}
            alt={fullName}
            className="h-16 w-16 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-w-gold text-xl font-semibold text-w-black">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-w-black">
            {fullName}
          </h3>
          <p className="truncate text-sm text-w-black/60">{user.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <RoleBadge>{user.role.replace(/_/g, " ").toLowerCase()}</RoleBadge>
            {/* <WBadge variant={user.active ? "primary" : "danger"}>
              {user.active ? "Active" : "Inactive"}
            </WBadge> */}
          </div>
        </div>
      </div>

      <div className="space-y-5 px-6 pb-6">
        <Section title="Contact">
          <DetailRow
            icon={<Mail size={16} />}
            label="Email"
            value={user.email}
          />
          <DetailRow
            icon={<Phone size={16} />}
            label="Phone Number"
            value={user.phoneNumber}
          />
          <DetailRow
            icon={<MapPin size={16} />}
            label="Address"
            value={user.address}
          />
          <DetailRow
            icon={<Contact size={16} />}
            label="Emergency Contact"
            value={user.emergencyContact}
          />
        </Section>

        <Section title="Work">
          <DetailRow
            icon={<Briefcase size={16} />}
            label="Job Title"
            value={user.jobTitle}
          />
          <DetailRow
            icon={<Calendar size={16} />}
            label="Joined At"
            value={formatDate(user.joinedAt)}
          />

          <div className="flex items-start gap-3 sm:col-span-2">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-w-green/10 text-w-green">
              <GraduationCap size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-w-black/50">
                Certificates
              </p>
              {user.certificates.length > 0 ? (
                <ul className="mt-1 flex flex-wrap gap-2">
                  {user.certificates.map((cert, index) => (
                    <li key={index} className="max-w-[45%]">
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
              ) : (
                <p className="text-sm text-w-black">—</p>
              )}
            </div>
          </div>
        </Section>

        <Section title="Personal">
          <DetailRow
            icon={<UserRound size={16} />}
            label="Gender"
            value={
              user.gender && (
                <span className="capitalize">{user.gender.toLowerCase()}</span>
              )
            }
          />
          <DetailRow
            icon={<Cake size={16} />}
            label="Date of Birth"
            value={formatDate(user.dateOfBirth)}
          />
          <DetailRow
            icon={<IdCard size={16} />}
            label="National ID"
            value={user.nationalId}
          />
        </Section>
      </div>

      <CertificatePreviewModal
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </div>
  );
}
