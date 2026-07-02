"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Plus, RotateCcw, Search, Trash2, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Button from "@/src/components/shared/Button";
import ConfirmationDialog from "@/src/components/shared/ConfirmationDialog";
import Input from "@/src/components/shared/Input";
import WBadge from "@/src/components/shared/WBadge";
import WSelect from "@/src/components/shared/WSelect";
import { DataTable } from "@/src/components/shared/table/DataTable";
import RowActions from "@/src/components/shared/table/RowActions";
import { RoleBadge } from "@/src/components/shared/table/Table";
import CreateUserModal from "@/src/components/users/CreateUserModal";
import UserDetailModal from "@/src/components/users/UserDetailModal";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useDeleteUser, useGetAllUsers, useToggleUserStatus } from "@/src/hooks/useUsers";
import { useModal } from "@/src/hooks/useModal";
import { UserRole } from "@/src/services/authService";
import { FullUser, Gender } from "@/src/services/userService";

const GENDER_FILTER_OPTIONS = [
  { label: "All Genders", value: "" },
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const ROLE_FILTER_OPTIONS = [
  { label: "All Roles", value: "" },
  { label: "Admin", value: "ADMIN" },
  { label: "Executive Director", value: "EXECUTIVE_DIRECTOR" },
  { label: "Project Manager", value: "PROJECT_MANAGER" },
  { label: "Finance", value: "FINANCE" },
  { label: "Field Officer", value: "FIELD_OFFICER" },
];

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
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const debouncedSearch = useDebounce(search);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
    setPage(0);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(0);
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
    setPage(0);
  };

  const hasActiveFilters = Boolean(search || gender || status || role);

  const handleResetFilters = () => {
    setSearch("");
    setGender("");
    setStatus("");
    setRole("");
    setPage(0);
  };

  const { data, isLoading, isFetching, isError } = useGetAllUsers({
    page,
    size,
    search: debouncedSearch || undefined,
    gender: (gender || undefined) as Gender | undefined,
    active: status ? status === "true" : undefined,
    role: (role || undefined) as UserRole | undefined,
  });
  const viewModal = useModal();
  const formModal = useModal();
  const { mutate: toggleUserStatus, isPending: isToggling } =
    useToggleUserStatus();
  const [userToToggle, setUserToToggle] = useState<FullUser | null>(null);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const [userToDelete, setUserToDelete] = useState<FullUser | null>(null);

  const handleConfirmToggle = () => {
    if (!userToToggle) return;

    toggleUserStatus(
      { id: userToToggle.id, isActive: userToToggle.isActive },
      {
        onSuccess: (message) => {
          toast.success(
            message ||
              (userToToggle.isActive ? "User deactivated" : "User activated"),
          );
          setUserToToggle(null);
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to update user status");
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    deleteUser(userToDelete.id, {
      onSuccess: (message) => {
        toast.success(message || "User deleted");
        setUserToDelete(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete user");
      },
    });
  };

  if (isError) {
    return <p className="text-w-red">Failed to load users.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-w-green">Users</h1>
        <Button
          variant="primary"
          onClick={formModal.openCreate}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add User
        </Button>
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="sm:flex-1">
          <Input
            icon={<Search size={16} />}
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <WSelect
            options={GENDER_FILTER_OPTIONS}
            value={gender}
            onChange={(value) => handleGenderChange(value ?? "")}
            isClearable={false}
            isSearchable={false}
            placeholder="Gender"
          />
        </div>
        <div className="sm:w-48">
          <WSelect
            options={STATUS_FILTER_OPTIONS}
            value={status}
            onChange={(value) => handleStatusChange(value ?? "")}
            isClearable={false}
            isSearchable={false}
            placeholder="Status"
          />
        </div>
        <div className="sm:w-56">
          <WSelect
            options={ROLE_FILTER_OPTIONS}
            value={role}
            onChange={(value) => handleRoleChange(value ?? "")}
            isClearable={false}
            isSearchable={false}
            placeholder="Role"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleResetFilters}
          disabled={!hasActiveFilters}
          className="flex items-center justify-center gap-2 sm:w-auto sm:shrink-0"
        >
          <RotateCcw size={16} />
          Reset
        </Button>
      </div>
      <div
        className={`transition-opacity ${isFetching && !isLoading ? "opacity-60" : "opacity-100"}`}
      >
        <DataTable
          columns={columns}
          data={data?.content ?? []}
          isLoading={isLoading}
          emptyMessage="No users found."
          pagination={
            data
              ? {
                  page: data.page,
                  totalPages: data.totalPages,
                  totalElements: data.totalElements,
                  pageSize: data.size,
                  first: data.first,
                  last: data.last,
                  onPageChange: setPage,
                }
              : undefined
          }
          renderActions={(user) => (
            <RowActions
              id={user.id}
              actions={[
                {
                  key: "view",
                  label: "View",
                  icon: <Eye size={16} />,
                  onClick: () => viewModal.openEdit(user.id),
                },
                {
                  key: "edit",
                  label: "Edit",
                  icon: <Edit size={16} />,
                  onClick: () =>
                    toast.info(`Edit ${user.firstName} ${user.lastName}`),
                },
                {
                  key: "toggle-status",
                  label: user.isActive ? "Deactivate" : "Activate",
                  icon: user.isActive ? (
                    <UserX size={16} className="text-w-red" />
                  ) : (
                    <UserCheck size={16} className="text-w-green" />
                  ),
                  onClick: () => setUserToToggle(user),
                  className: user.isActive
                    ? "text-w-red bg-w-red/10 hover:bg-w-red/20"
                    : "text-w-green bg-w-green/10 hover:bg-w-green/20",
                },
                {
                  key: "delete",
                  label: "Delete",
                  icon: <Trash2 size={16} className="text-w-red" />,
                  onClick: () => setUserToDelete(user),
                  className: "text-w-red bg-w-red/10 hover:bg-w-red/20",
                  dividerAbove: true,
                },
              ]}
            />
          )}
        />
      </div>
      <UserDetailModal
        userId={viewModal.editId ?? null}
        onClose={() => viewModal.closeModal()}
      />
      <CreateUserModal
        isOpen={formModal.isOpen}
        onClose={() => formModal.closeModal()}
      />
      <ConfirmationDialog
        isOpen={Boolean(userToToggle)}
        onClose={() => setUserToToggle(null)}
        onConfirm={handleConfirmToggle}
        title={userToToggle?.isActive ? "Deactivate User" : "Activate User"}
        message={
          userToToggle && (
            <>
              Are you sure you want to{" "}
              {userToToggle.isActive ? "deactivate" : "activate"}{" "}
              <span className="font-medium text-w-black">
                {userToToggle.firstName} {userToToggle.lastName}
              </span>
              ?
            </>
          )
        }
        confirmButtonText={userToToggle?.isActive ? "Deactivate" : "Activate"}
        confirmButtonVariant={userToToggle?.isActive ? "danger" : "primary"}
        isLoading={isToggling}
      />
      <ConfirmationDialog
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={
          userToDelete && (
            <>
              Are you sure you want to permanently delete{" "}
              <span className="font-medium text-w-black">
                {userToDelete.firstName} {userToDelete.lastName}
              </span>
              ? This action cannot be undone.
            </>
          )
        }
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
