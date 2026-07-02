"use client";

import { useQuery } from "@tanstack/react-query";
import { GetUsersParams, userService } from "@/src/services/userService";

export function useGetAllUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.getUsers(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userService.getUser(id),
    enabled: Boolean(id),
    retry: 1,
  });
}
