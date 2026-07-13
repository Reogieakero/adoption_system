import React, { useEffect, useRef, useState } from "react";
import { Download, ChevronDown, FileText, FileSpreadsheet, Printer } from "lucide-react";
import styles from "./ExportMenu.module.css";

export function ExportMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className={styles.btnPrimary} onClick={() => setOpen((o) => !o)}>
        <Download size={15} />
        Export
        <ChevronDown size={13} />
      </button>
      {open && (
        <div className={styles.selectContent}>
          <div className={styles.selectItem} onClick={() => setOpen(false)}>
            <span className={styles.itemLayout}>
              <FileText size={14} /> Export PDF
            </span>
          </div>
          <div className={styles.selectItem} onClick={() => setOpen(false)}>
            <span className={styles.itemLayout}>
              <FileSpreadsheet size={14} /> Export Excel
            </span>
          </div>
          <div className={styles.selectItem} onClick={() => setOpen(false)}>
            <span className={styles.itemLayout}>
              <Printer size={14} /> Print Report
            </span>
          </div>
        </div>
      )}
    </div>
  );
}