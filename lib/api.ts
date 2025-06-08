import { logger } from './logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ast-secret-backend.onrender.com/api';
//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5000/api';

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  reactions: {
    heart: number;
    fire: number;
    laugh: number;
  };
  isRead: boolean;
  isPublic: boolean;
  reply?: string;
  replyTimestamp?: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  usePin: boolean;
  isPublic: boolean;
  messageCount: number;
  createdAt: string;
  expiresAt: string;
  link: string;
}

export async function createUser(username: string, usePin: boolean, isPublic: boolean): Promise<User> {
  logger.info('Creating new user', { username, usePin, isPublic });
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, usePin, isPublic }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      logger.error('Failed to create user', { username, error, status: response.status });
      throw new Error('Failed to create user');
    }

    const user = await response.json();
    logger.info('User created successfully', { userId: user.id });
    return user;
  } catch (error) {
    logger.error('Error creating user', { username, error });
    throw error;
  }
}

export async function getUser(userId: string): Promise<User> {
  logger.info('Fetching user', { userId });
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      logger.error('Failed to fetch user', { userId, error, status: response.status });
      throw new Error('Failed to fetch user');
    }

    const user = await response.json();
    logger.debug('User fetched successfully', { userId });
    return user;
  } catch (error) {
    logger.error('Error fetching user', { userId, error });
    throw error;
  }
}

export async function getUserByUsername(username: string): Promise<User> {
  logger.info('Fetching user by username', { username });
  try {
    const response = await fetch(`${API_BASE_URL}/users/by-username/${username}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      logger.error('Failed to fetch user by username', { username, error, status: response.status });
      throw new Error(error.error || 'Failed to fetch user');
    }

    const user = await response.json();
    logger.debug('User fetched successfully by username', { username, userId: user.id });
    return user;
  } catch (error) {
    logger.error('Error fetching user by username', { username, error });
    throw error;
  }
}

export async function getMessages(userId: string): Promise<Message[]> {
  const response = await fetch(`${API_BASE_URL}/messages/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  return response.json();
}

export async function sendMessage(userId: string, content: string, isPublic: boolean): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, content, isPublic }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}

export async function addReaction(messageId: string, userId: string, reactionType: 'heart' | 'fire' | 'laugh'): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/messages/${messageId}/reactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, reactionType }),
  });

  if (!response.ok) {
    throw new Error('Failed to add reaction');
  }

  return response.json();
}

export async function deleteMessage(userId: string, messageId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/messages/${userId}/${messageId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete message');
  }
}

export async function markMessageAsRead(messageId: string, userId: string): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to mark message as read');
  }

  return response.json();
}

export async function replyToMessage(messageId: string, userId: string, reply: string): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/messages/${messageId}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, reply }),
  });

  if (!response.ok) {
    throw new Error('Failed to send reply');
  }

  return response.json();
} 