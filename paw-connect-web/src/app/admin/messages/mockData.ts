import { Conversation } from './types';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    userName: 'Jane Miller',
    userRole: 'Adopter',
    avatarFallback: 'JM',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
    relatedAnimal: 'Max (Beagle)',
    category: 'Adoption',
    lastMessage: 'Sure, I will upload the residential verification docs tonight.',
    time: '2m ago',
    isUnread: true,
    messages: [
      { id: 'm1', sender: 'user', text: 'Hello, I wanted to inquire about the home layout checks required for Max.', time: '10:30 AM', status: 'read' },
      { id: 'm2', sender: 'admin', text: 'Hi Jane! We need a quick video walkthrough or document verification proving space compliance.', time: '10:32 AM', status: 'read' },
      { id: 'm3', sender: 'user', text: 'Sure, I will upload the residential verification docs tonight.', time: '10:35 AM', status: 'read',
        attachment: { type: 'file', name: 'housing_agreement.pdf', size: '1.2 MB' } }
    ]
  },
  {
    id: 'c2',
    userName: 'Marcus Vance',
    userRole: 'Rescuer',
    avatarFallback: 'MV',
    relatedAnimal: 'Case #4093 (Shadow)',
    category: 'Rescue',
    lastMessage: 'Unit 4 cleared the sector. The canine is secure inside the crate.',
    time: '1h ago',
    isUnread: false,
    messages: [
      { id: 'm4', sender: 'admin', text: 'Marcus, what is your current ETA to the North Industrial Block?', time: '09:12 AM', status: 'read' },
      { id: 'm5', sender: 'user', text: 'Unit 4 cleared the sector. The canine is secure inside the crate.', time: '09:20 AM', status: 'read',
        attachment: { type: 'image', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop&q=60' } }
    ]
  },
  {
    id: 'c3',
    userName: 'Alice Cooper',
    userRole: 'Citizen',
    category: 'General',
    avatarFallback: 'AC',
    lastMessage: 'Thank you for the update on the public stray tracking procedures.',
    time: 'Yesterday',
    isUnread: false,
    messages: [
      { id: 'm6', sender: 'user', text: 'How do I report stray integration lines without creating false emergency alarms?', time: 'Yesterday', status: 'read' },
      { id: 'm7', sender: 'admin', text: 'You can flag them using the General portal tier right inside our utility app.', time: 'Yesterday', status: 'read' },
      { id: 'm8', sender: 'user', text: 'Thank you for the update on the public stray tracking procedures.', time: 'Yesterday', status: 'read' }
    ]
  }
];

