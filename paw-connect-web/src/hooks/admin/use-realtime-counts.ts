'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { fetchUnreadCount } from '@/services/notifications.api';
import { fetchAdoptionPendingCount } from '@/services/adoptions.api';
import { fetchReportPendingCount } from '@/services/rescues.api';

interface Counts {
  notifications: number;
  adoptions: number;
  rescues: number;
}

function playNotificationSound() {
  try {
    const sr = 44100;
    const length = Math.floor(sr * 0.4);
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);

    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sr, true);
    view.setUint32(28, sr * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, length * 2, true);

    for (let i = 0; i < length; i++) {
      const t = i / sr;
      let sample: number;
      if (t < 0.15) {
        sample = Math.sin(2 * Math.PI * 440 * t);
      } else {
        sample = Math.sin(2 * Math.PI * 523 * t);
      }
      const fade = Math.min(1, (length - i) / (sr * 0.05));
      const envelope = Math.min(1, i / (sr * 0.01)) * fade;
      const val = Math.round(sample * envelope * 0.8 * 32767);
      view.setInt16(44 + i * 2, val, true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.volume = 1;
    audio.play().then(() => {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }).catch(() => {});
  } catch {
    // give up
  }
}

export function useRealtimeCounts(): Counts {
  const [counts, setCounts] = useState<Counts>({ notifications: 0, adoptions: 0, rescues: 0 });
  const prevNotifRef = useRef<number>(0);
  const socketRef = useRef<Socket | null>(null);

  async function fetchCounts(): Promise<Counts | null> {
    try {
      const [notifCount, adoptionCount, rescueCount] = await Promise.all([
        fetchUnreadCount(),
        fetchAdoptionPendingCount(),
        fetchReportPendingCount(),
      ]);
      return { notifications: notifCount, adoptions: adoptionCount, rescues: rescueCount };
    } catch {
      return null;
    }
  }

  useEffect(() => {
    fetchCounts().then((c) => {
      if (!c) return;
      setCounts(c);
      prevNotifRef.current = c.notifications;
    });

    const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('adminAuthToken') : null;
    const socket = io(socketUrl, {
      auth: { token: adminToken },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-admin');
    });

    socket.on('data-changed', () => {
      fetchCounts().then((c) => {
        if (!c) return;
        if (c.notifications > prevNotifRef.current) {
          playNotificationSound();
        }
        prevNotifRef.current = c.notifications;
        setCounts(c);
      });
    });

    const unlockAudio = () => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctx.resume();
      ctx.close();
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return counts;
}