"use client";

import Loading from "@/components/ui/Loading";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({ children }: LayoutProps<"/">) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isLoading) return;
    if (!user || user.roles[0] != "Owner") {
      router.push("/dashboard");
    }
  }, [user, isLoading]);
  if (isLoading || !user || user.roles[0] != "Owner") return <Loading />;
  return <>{children}</>;
}
