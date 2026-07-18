import React from 'react';
import { Paperclip, Smile, SendHorizontal } from 'lucide-react';
import Button from '@/components/ui/button';
import styles from './InputBar.module.css';

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function InputBar({ value, onChange, onSend }: InputBarProps) {
  return (
    <footer className={styles.inputBar}>
      <div className={styles.actionPaneWrapper}>
        <Button variant="admin-secondary" square title="Attach operational file">
          <Paperclip size={13} className={styles.actionIcon} />
        </Button>
        <Button variant="admin-secondary" square title="Add emoji response">
          <Smile size={13} className={styles.actionIcon} />
        </Button>
      </div>

      <input
        type="text"
        placeholder="Type your message here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
        className={styles.messageInput}
      />

      <Button variant="admin-primary" onClick={onSend} className={styles.sendBtn}>
        <span>Send</span>
        <SendHorizontal size={11} />
      </Button>
    </footer>
  );
}

