"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const COOKIE_NAME = "imlinkey_ref";
const EXPIRY = 60 * 60 * 24 * 30; // 30 dias

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");

    if (!ref) return;

    // Evita overwrite (first-click attribution)
    const existing = document.cookie
      .split("; ")
      .find(row => row.startsWith(`${COOKIE_NAME}=`));

    if (existing) return;

    document.cookie = `${COOKIE_NAME}=${ref}; path=/; max-age=${EXPIRY}; SameSite=Lax`;

    console.log("Referral capturado:", ref);
  }, [searchParams]);

  return null;
}
