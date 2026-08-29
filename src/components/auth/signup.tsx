"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@/components/ui";
import { FaLock, FaBirthdayCake, FaAt, FaEnvelope, FaUser } from "react-icons/fa";
import { api } from "@/utils";
import type { AxiosError } from "axios";

interface SignupProps {
  setMode: (mode: "signin" | "signup") => void;
}

type AlertType = "error" | "success" | "warning" | "info";

interface Alert {
  type: AlertType;
  message: string;
}

interface BackendErrorResponse {
  [key: string]: string | string[];
}

export default function Signup({ setMode }: SignupProps) {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const [age, setAge] = useState<number | null>(null);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(false);

  const normalizePhone = (p: string) => p.replace(/\D/g, "");

  const setField = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // cálculo de idade (UI apenas)
  useEffect(() => {
    if (!form.birthDate) {
      setAge(null);
      return;
    }

    const today = new Date();
    const birth = new Date(form.birthDate);

    let years = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      years--;
    }

    setAge(years >= 0 ? years : null);
  }, [form.birthDate]);

  const validate = () => {
    if (
      !form.username ||
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.birthDate ||
      !form.password ||
      !form.confirmPassword
    ) {
      setAlert({ type: "warning", message: "Please fill all required fields." });
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    setAlert(null);

    if (!validate()) return;

    const payload = {
      username: form.username.trim(),
      full_name: form.fullName.trim(),
      email: form.email.trim(),
      phone: normalizePhone(form.phone),
      birthdate: form.birthDate,
      password: form.password,
    };

    try {
      setLoading(true);

      await api.post("/auth/signup/", payload);

      setAlert({
        type: "success",
        message: "Account created successfully! Redirecting...",
      });

      setTimeout(() => setMode("signin"), 1200);
    } catch (err: unknown) {
      const messages: string[] = [];

      if ((err as AxiosError).isAxiosError) {
        const data = (err as AxiosError<BackendErrorResponse>).response?.data;

        if (data) {
          Object.entries(data).forEach(([field, value]) => {
            if (Array.isArray(value)) {
              value.forEach(msg => messages.push(`${field}: ${msg}`));
            } else {
              messages.push(`${field}: ${value}`);
            }
          });
        }
      }

      if (!messages.length) {
        messages.push("Failed to create account. Please try again.");
      }

      setAlert({ type: "error", message: messages.join(" | ") });
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (type: AlertType) => {
    const styles = {
      error: "bg-red-100 text-red-700 border-red-500",
      success: "bg-green-100 text-green-700 border-green-500",
      warning: "bg-yellow-100 text-yellow-700 border-yellow-500",
      info: "bg-blue-100 text-blue-700 border-blue-500",
    };

    return styles[type];
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">

      {alert && (
        <div className={`border-l-4 p-4 text-sm font-medium ${getAlertColor(alert.type)}`}>
          {alert.message}
        </div>
      )}

      <Input
        placeholder="Username"
        icon={<FaAt />}
        value={form.username}
        onChange={e => setField("username", e.target.value)}
        required
      />

      <Input
        placeholder="Full Name"
        icon={<FaUser />}
        value={form.fullName}
        onChange={e => setField("fullName", e.target.value)}
        required
      />

      <Input
        placeholder="Email"
        type="email"
        icon={<FaEnvelope />}
        value={form.email}
        onChange={e => setField("email", e.target.value)}
        required
      />

      <Input
        variant="phone"
        value={form.phone}
        onChange={value => setField("phone", value)}
        required
      />

      <Input
        placeholder="Birth Date"
        type="date"
        icon={<FaBirthdayCake />}
        value={form.birthDate}
        onChange={e => setField("birthDate", e.target.value)}
        required
      />

      {age !== null && (
        <Input
          placeholder="Age"
          type="number"
          value={age}
          readOnly
        />
      )}

      <Input
        placeholder="Password"
        type="password"
        icon={<FaLock />}
        eye
        value={form.password}
        onChange={e => setField("password", e.target.value)}
        required
      />

      <Input
        placeholder="Confirm Password"
        type="password"
        icon={<FaLock />}
        eye
        value={form.confirmPassword}
        onChange={e => setField("confirmPassword", e.target.value)}
        required
      />

      <Button
        className="w-full mb-4"
        onClick={handleSignUp}
        disabled={loading}
      >
        {loading ? "Creating account..." : "Sign Up"}
      </Button>

      <p className="text-sm text-center text-gray-300">
        Already have an account?{" "}
        <button
          onClick={() => setMode("signin")}
          className="text-blue-400 hover:underline"
        >
          Sign in
        </button>
      </p>

    </div>
  );
}
