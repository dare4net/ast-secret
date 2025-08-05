"use client"

import { useEffect, useState } from "react"
import { getCookie } from "@/lib/utils"
import { SocketProvider } from "@/lib/socket-context"
import { useRouter } from "next/navigation"

export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = getCookie("ast-secret-user-id");
    setUserId(id);
  }, []);

  // We always want to provide the socket context, even for non-logged-in users
  // This allows them to receive real-time updates when viewing public profiles
  return (
    <SocketProvider userId={userId || 'anonymous'}>
      {children}
    </SocketProvider>
  );
}
