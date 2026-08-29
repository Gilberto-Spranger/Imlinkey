import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/utils";

export default function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/check/", {
          withCredentials: true,
        });

        if (!mounted) return;

        const isAuthPage = pathname === "/auth" || pathname === "/";

        if (data?.authenticated) {
          if (isAuthPage) router.replace("/dashboard");
        } else {
          if (!isAuthPage) router.replace("/auth");
        }
      } catch {
        if (pathname !== "/auth") router.replace("/auth");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router, pathname]);

  return loading;
}