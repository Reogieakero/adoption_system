import React from "react";
import { Plus } from "lucide-react";
import styles from "./PageHeader.module.css";

export interface PageHeaderProps {
  onAddUser: () => void;
}

export default function PageHeader({ onAddUser }: PageHeaderProps) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleArea}>
        <h1>User Management</h1>
      </div>
    </div>
  );
}
