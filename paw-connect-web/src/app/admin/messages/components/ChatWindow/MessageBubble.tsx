import React from 'react';
import { FileText, CheckCheck, Check } from 'lucide-react';
import { Message } from '../../types';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAdmin = message.sender === 'admin';

  return (
    <div className={`${styles.msgRow} ${isAdmin ? styles.msgAdmin : styles.msgIncoming}`}>
      <div className={`${styles.bubble} ${isAdmin ? styles.bubbleAdmin : styles.bubbleIncoming}`}>
        {message.text}

        {message.attachment?.type === 'image' && (
          <div className={styles.attachmentPreview}>
            <img src={message.attachment.url} alt="Attachment payload" className={styles.attachmentImage} />
          </div>
        )}

        {message.attachment?.type === 'file' && (
          <div className={styles.attachmentPreview}>
            <div className={styles.fileAttachment}>
              <FileText size={12} className={styles.fileIcon} />
              <div className={styles.fileDetails}>
                <p className={styles.fileName}>{message.attachment.name}</p>
                <p className={styles.fileSize}>{message.attachment.size}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`${styles.msgMeta} ${isAdmin ? styles.msgMetaAdmin : ''}`}>
        <span>{message.time}</span>
        {isAdmin && (
          <span>
            {message.status === 'read' ? <CheckCheck size={10} className={styles.readIcon} /> : <Check size={10} />}
          </span>
        )}
      </div>
    </div>
  );
}

