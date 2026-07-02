"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import WBadge from "@/src/components/shared/WBadge";
import { DataTable } from "@/src/components/shared/table/DataTable";
import RowActions from "@/src/components/shared/table/RowActions";
import { RoleBadge } from "@/src/components/shared/table/Table";
import UserDetailModal from "@/src/components/users/UserDetailModal";
import { useGetAllUsers } from "@/src/hooks/useUsers";
import { FullUser } from "@/src/services/userService";
import WLoader from "@/src/components/shared/WLoader";

const columns: ColumnDef<FullUser, unknown>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <RoleBadge>
        {row.original.role.replace(/_/g, " ").toLowerCase()}
      </RoleBadge>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.gender.toLowerCase()}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <WBadge variant={row.original.isActive ? "primary" : "danger"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </WBadge>
    ),
  },
];

export default function UsersPage() {
  const { data, isLoading, isError } = useGetAllUsers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <WLoader />
      </div>
    );
  }

  if (isError) {
    return <p className="text-w-red">Failed to load users.</p>;
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-w-green">Users</h1>
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        emptyMessage="No users found."
        renderActions={(user) => (
          <RowActions
            id={user.id}
            actions={[
              {
                key: "view",
                label: "View",
                icon: <Eye size={16} />,
                onClick: () => setSelectedUserId(user.id),
              },
              {
                key: "edit",
                label: "Edit",
                icon: <Edit size={16} />,
                onClick: () =>
                  toast.info(`Edit ${user.firstName} ${user.lastName}`),
              },
            ]}
          />
        )}
      />
      <UserDetailModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  );
}
