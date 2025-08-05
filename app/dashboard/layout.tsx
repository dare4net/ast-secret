"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/lib/utils";
import { SocketProvider } from "@/lib/socket-context";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = getCookie("ast-secret-user-id");
    if (!id) {
      router.push("/create");
    } else {
      setUserId(id);
    }
  }, [router]);

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <SocketProvider userId={userId}>
      {children}
    </SocketProvider>
  );
}
