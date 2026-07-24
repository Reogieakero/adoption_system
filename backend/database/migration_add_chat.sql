-- Migration: Add chat tables for direct messaging between residents and admins
-- Requires: users table (exists)

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_conversations;

CREATE TABLE chat_conversations (
  conversation_id   INT           NOT NULL AUTO_INCREMENT,
  participant_ids   JSON          NOT NULL COMMENT 'JSON array of user_ids in this conversation, sorted ascending',
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (conversation_id),
  INDEX idx_conversation_participants ((CAST(participant_ids AS CHAR(255))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE chat_messages (
  message_id        INT           NOT NULL AUTO_INCREMENT,
  conversation_id   INT           NOT NULL,
  sender_id         INT           NOT NULL,
  message_text      TEXT          NOT NULL,
  is_read           BOOLEAN       NOT NULL DEFAULT FALSE,
  sent_at           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (message_id),
  INDEX idx_messages_conversation (conversation_id),
  INDEX idx_messages_sender (sender_id),
  INDEX idx_messages_sent (conversation_id, sent_at),

  CONSTRAINT fk_chat_msg_conversation
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations (conversation_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_chat_msg_sender
    FOREIGN KEY (sender_id) REFERENCES users (user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;