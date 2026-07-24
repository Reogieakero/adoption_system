import { API_BASE_URL } from '@/lib/config';
import { ChatConversation, ChatMessage } from '@/types/chat';

function getChatBase(): string {
  if (typeof window === 'undefined') return '/api/resident/chat';
  const hasAdminToken = !!sessionStorage.getItem('adminAuthToken');
  const hasResidentToken = !!sessionStorage.getItem('authToken') || !!localStorage.getItem('authToken');
  return hasAdminToken && !hasResidentToken ? '/api/admin/chat' : '/api/resident/chat';
}

function getChatToken(): string | null {
  if (typeof window === 'undefined') return null;
  if (getChatBase() === '/api/admin/chat') return sessionStorage.getItem('adminAuthToken');
  return sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
}

export async function fetchConversations(): Promise<ChatConversation[]> {
  const token = getChatToken();
  const base = getChatBase();
  const res = await fetch(`${API_BASE_URL}${base}/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch conversations');
  return data.data;
}

export async function fetchMessages(conversationId: number): Promise<ChatMessage[]> {
  const token = getChatToken();
  const base = getChatBase();
  const res = await fetch(`${API_BASE_URL}${base}/conversations/${conversationId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch messages');
  return data.data;
}

export async function sendChatMessage(conversationId: number, messageText: string, recipientId: number, photoFile?: File): Promise<ChatMessage> {
  const token = getChatToken();
  const base = getChatBase();
  const body = new FormData();
  body.append('message_text', messageText);
  body.append('recipient_id', String(recipientId));
  if (photoFile) body.append('photo', photoFile);
  const res = await fetch(`${API_BASE_URL}${base}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to send message');
  return data.data;
}

export async function findOrCreateConversation(recipientId: number): Promise<{ conversation_id: number }> {
  const token = getChatToken();
  const base = getChatBase();
  const res = await fetch(`${API_BASE_URL}${base}/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ recipient_id: recipientId }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to create conversation');
  return data.data;
}

export async function markChatRead(conversationId: number): Promise<void> {
  const token = getChatToken();
  const base = getChatBase();
  await fetch(`${API_BASE_URL}${base}/conversations/${conversationId}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchChatUnreadCount(): Promise<number> {
  const token = getChatToken();
  const base = getChatBase();
  const res = await fetch(`${API_BASE_URL}${base}/unread-count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch unread count');
  return data.data.count;
}

export async function fetchChatResidents(): Promise<{ user_id: number; full_name: string }[]> {
  const token = getChatToken();
  const base = getChatBase();
  const res = await fetch(`${API_BASE_URL}${base}/residents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch residents');
  return data.data;
}

export async function fetchChatAdmins(): Promise<{ user_id: number; full_name: string }[]> {
  const res = await fetch(`${API_BASE_URL}/api/public/admins`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch admins');
  return data.data;
}
