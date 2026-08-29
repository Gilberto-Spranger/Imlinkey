"use client";

import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/ui";
import Init from "./init/page";
import useAuthRedirect from "@/hooks/use-auth-redirect";

const Loading = () => {
  const [showInit, setShowInit] = useState(false);

  const loadingAuth = useAuthRedirect();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInit(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loadingAuth || !showInit) {
    return <LoadingPage />;
  }

  return <Init />;
};

export default Loading;