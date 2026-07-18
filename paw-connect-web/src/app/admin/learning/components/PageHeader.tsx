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
      <Button variant="admin-primary" onClick={onAddClick}>
         Add Learning Module
      </Button>
    </div>
  );
}