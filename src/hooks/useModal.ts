"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const openCreate = useCallback(() => {
    setEditId(undefined);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((id: string) => {
    setEditId(id);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(
    (queryKeysToInvalidate?: string[]) => {
      setIsOpen(false);
      setEditId(undefined);
      queryKeysToInvalidate?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
    [queryClient],
  );

  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    editId,
    isEditing: editId !== undefined,
    openCreate,
    openEdit,
    closeModal,
    toggleModal,
  };
}
