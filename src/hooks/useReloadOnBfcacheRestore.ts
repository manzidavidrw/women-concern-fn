"use client";

import { useEffect } from "react";

/**
 * If this page is restored from the browser's back-forward cache, force a
 * real reload so proxy.ts re-checks the auth cookie instead of showing a
 * frozen pre-login/pre-logout snapshot.
 */
export function useReloadOnBfcacheRestore() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);
}
