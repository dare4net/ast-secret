"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';

const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-url.com' // Replace with your production backend URL
  : 'http://localhost:5000';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const newSocket = io(SOCKET_URL);

    function onConnect() {
      setIsConnected(true);
      // Join user's room for private updates
      newSocket.emit('join', userId);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    newSocket.on('connect', onConnect);
    newSocket.on('disconnect', onDisconnect);

    setSocket(newSocket);

    // Socket is now connected and ready

    newSocket.on('newMessage', ({ message, messageCount }) => {
      toast({
        title: "New Message! 📨",
        description: "You have received a new message.",
      });
      // Dispatch an event to update messages in Dashboard
      window.dispatchEvent(new CustomEvent('newMessage', { detail: { message, messageCount } }));
    });

    newSocket.on('newReply', ({ messageId, reply, replyTimestamp }) => {
      toast({
        title: "New Reply! 💬",
        description: "Someone replied to your message.",
      });
      // Dispatch an event to update message reply in Dashboard
      window.dispatchEvent(new CustomEvent('newReply', { detail: { messageId, reply, replyTimestamp } }));
    });

    newSocket.on('newReaction', ({ messageId, reactions }) => {
      // Dispatch an event to update message reactions in Dashboard
      window.dispatchEvent(new CustomEvent('newReaction', { detail: { messageId, reactions } }));
    });

    return () => {
      newSocket.off('connect', onConnect);
      newSocket.off('disconnect', onDisconnect);
      newSocket.off('newMessage');
      newSocket.off('newReply');
      newSocket.off('newReaction');
      newSocket.close();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
