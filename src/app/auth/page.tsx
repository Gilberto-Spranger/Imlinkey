"use client";

import { useState } from "react";
import Signin from "@/components/auth/signin";
import Signup from "@/components/auth/signup";
import useAuthRedirect from "@/hooks/use-auth-redirect";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const loading = useAuthRedirect();

  if (loading) return (
    <div className="min-h-screen w-full flex items-center justify-center text-white">
      <p>Checking authentication...</p>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{ backgroundColor: "#020617" }}
    >
      <div className="w-full max-w-md p-6 rounded-2xl text-white">
        {mode === "signin" ? (
          <Signin setMode={setMode} />
        ) : (
          <Signup setMode={setMode} />
        )}
      </div>
    </div>
  );
}