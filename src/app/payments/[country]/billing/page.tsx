"use client";

import { useParams } from "next/navigation";
import Billing_Gpayment from "@/components/billing/billing_gpayment";
import Billing_Stripe from "@/components/billing/billing_stripe";
import { LoadingPage } from "@/components/ui";
import useAuthRedirect from "@/hooks/use-auth-redirect";

export default function DynamicBillingPage() {
  const params = useParams();
  const country = params?.country as string;
  const loadingAuth = useAuthRedirect();

  if (!country) return null;
  if (loadingAuth) return <LoadingPage />;

  return (
    <div className="min-h-screen">
      {country.toLowerCase() === "ao" ? (
        <Billing_Gpayment country={country} />
      ) : (
        <Billing_Stripe country={country} />
      )}
    </div>
  );
}