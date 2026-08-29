"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils";

export type Role = "user" | "artist" | "organizer" | "admin";
export type Status = "online" | "offline";
export type AccountStatus = "active" | "suspended" | "banned";
export type Currency = "AOA" | "BRL" | "CNY" | "EUR" | "GBP" | "HUF" | "USD" | "ZAR";
export type Country = "PT" | "AO" | "BR" | "CN" | "DE" | "FR" | "IT" | "GB" | "HU" | "US" | "ZA";
export type Language = "pt" | "zh" | "de" | "fr" | "it" | "en" | "hu";
export type ThemePreference = "light" | "dark" | "system";

export interface AccountSettingsData {
  id: string;
  user_id: string;
  role: Role;
  status: Status;
  account_status: AccountStatus;
  timezone_str: string;
  language: Language;
  currency: Currency;
  country: Country;
  theme_preference: ThemePreference;
  two_factor_enabled: boolean;
  last_signin: string | null;
  created_at: string;
  updated_at: string;
}

let cachedSettings: AccountSettingsData | null = null;
let fetchingPromise: Promise<AccountSettingsData> | null = null;

export function useAccountSettings() {
  const [settings, setSettings] = useState<AccountSettingsData | null>(cachedSettings);
  const [loading, setLoading] = useState(!cachedSettings);

  const loadSettings = useCallback(async () => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }

    if (!fetchingPromise) {
      fetchingPromise = api.get<AccountSettingsData[]>("/account_settings/")
        .then(({ data }) => {
          const raw = Array.isArray(data) ? data[0] : data;
          cachedSettings = raw;
          return cachedSettings;
        })
        .finally(() => {
          fetchingPromise = null;
        });
    }

    const result = await fetchingPromise;
    setSettings(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return { settings, loading };
}

export function updateAccountSettingsCache(newData: AccountSettingsData) {
  cachedSettings = newData;
}