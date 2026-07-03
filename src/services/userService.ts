import api from "@/src/lib/apiClient";
import { ApiEnvelope, Page } from "@/src/lib/apiTypes";
import { UserRole } from "@/src/services/authService";

export type Gender = "MALE" | "FEMALE";

export interface FullUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  jobTitle?: string;
  address?: string;
  profilePictureUrl?: string;
  profilePictureId?: string;
  nationalId?: string;
  emergencyContact?: string;
  dateOfBirth?: string;
  gender: Gender;
  certificates?: string;
  joinedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersParams {
  page?: number;
  size?: number;
  search?: string;
  gender?: Gender;
  active?: boolean;
  role?: UserRole;
}

export interface RegisterUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  phoneNumber: string;
  role: UserRole;
  joinedAt: string;
}

export const userService = {
  getUsers: async (params?: GetUsersParams): Promise<Page<FullUser>> => {
    const response = await api.get<ApiEnvelope<Page<FullUser>>>("/users", {
      params,
    });
    return response.data;
  },

  getUser: async (id: string): Promise<FullUser> => {
    const response = await api.get<ApiEnvelope<FullUser>>(`/users/${id}`);
    return response.data;
  },

  registerUser: async (payload: RegisterUserPayload): Promise<string> => {
    const response = await api.post<{ message: string }>(
      "/users/register",
      payload,
    );
    return response.message;
  },

  activateUser: async (id: string): Promise<string> => {
    const response = await api.patch<ApiEnvelope<string>>(
      `/users/${id}/activate`,
    );
    return response.message;
  },

  deactivateUser: async (id: string): Promise<string> => {
    const response = await api.patch<ApiEnvelope<string>>(
      `/users/${id}/deactivate`,
    );
    return response.message;
  },

  deleteUser: async (id: string): Promise<string> => {
    const response = await api.delete<ApiEnvelope<string>>(`/users/${id}`);
    return response.message;
  },
};
