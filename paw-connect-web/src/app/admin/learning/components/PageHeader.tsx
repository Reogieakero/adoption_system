"use client";

import React from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  onAddClick: () => void;
}

export default function PageHeader({ onAddClick }: PageHeaderProps) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleArea}>
        <h1>E-Learning</h1>
        <p>Create and manage educational modules that promote responsible pet ownership and animal welfare.</p>
      </div>
      <Button variant="admin-primary" onClick={onAddClick}>
        <Plus size={14} strokeWidth={2.5} /> Add Learning Module
      </Button>
    </div>
  );
}

