export interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'image' | 'file';
    url?: string;
    name?: string;
    size?: string;
  };
}

export interface Conversation {
  id: string;
  userName: string;
  userRole: 'Citizen' | 'Adopter' | 'Rescuer';
  avatarFallback: string;
  avatarUrl?: string;
  relatedAnimal?: string;
  category: 'Adoption' | 'Rescue' | 'General';
  lastMessage: string;
  time: string;
  isUnread: boolean;
  messages: Message[];
}

