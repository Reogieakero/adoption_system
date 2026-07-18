"use client";

import React, { useRef, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";
import Button from "@/components/ui/button";
import styles from "./ModuleFormModal.module.css";
import ShadcnSelect from '@/components/ui/shadcn-select';
import type { LearningModuleFormState, ModuleDifficulty, SelectOption } from "@/types";

interface ModuleFormModalProps {
  isEditing: boolean;
  form: LearningModuleFormState;
  onFormChange: React.Dispatch<React.SetStateAction<LearningModuleFormState>>;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving: boolean;
  formError: string | null;
  categoryOptions: SelectOption[];
  difficultyOptions: SelectOption[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function ModuleFormModal({
  isEditing,
  form,
  onFormChange,
  imagePreview,
  onImageChange,
  isSaving,
  formError,
  categoryOptions,
  difficultyOptions,
  onSubmit,
  onCancel,
}: ModuleFormModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [form.description]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{isEditing ? "Edit Lesson Plan" : "Create New Lesson Plan"}</h2>
          <p>Fill out the details below to organize and publish your learning materials.</p>
        </div>

        <form onSubmit={onSubmit} className={styles.modalForm}>
          <div className={styles.formScrollArea}>
            {formError && <div className={styles.formError}>{formError}</div>}

            <div className={styles.formGroup}>
              <label>Lesson Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => onFormChange((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g., Introduction to Basics"
                className={styles.formInputShadcn}
              />
            </div>

            <div className={styles.formGrid3}>
              <div className={styles.formGroup}>
                <label>Topic Category</label>
                <ShadcnSelect
                  value={form.category}
                  onChange={(val) => onFormChange((f) => ({ ...f, category: val }))}
                  options={categoryOptions}
                  placeholder="Select Topic"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Difficulty Level</label>
                <ShadcnSelect
                  value={form.difficulty}
                  onChange={(val) => onFormChange((f) => ({ ...f, difficulty: val as ModuleDifficulty }))}
                  options={difficultyOptions}
                  placeholder="Select Difficulty"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Estimated Duration *</label>
                <input
                  type="text"
                  required
                  value={form.duration}
                  onChange={(e) => onFormChange((f) => ({ ...f, duration: e.target.value }))}
                  placeholder="e.g., 45 mins"
                  className={styles.formInputShadcn}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Cover Image</label>
              <label className={styles.uploadBox}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Cover preview" className={styles.uploadPreview} />
                ) : (
                  <>
                    <ImageIcon size={20} className={styles.uploadIcon} />
                    <span className={styles.uploadHint}>Click to upload an image file (PNG, JPG up to 5MB)</span>
                  </>
                )}
                <input type="file" accept="image/png,image/jpeg" onChange={onImageChange} className={styles.hiddenFileInput} />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label>Short Summary</label>
              <textarea
                ref={textareaRef}
                rows={1}
                value={form.description}
                onChange={(e) => {
                  onFormChange((f) => ({ ...f, description: e.target.value }));
                  adjustTextareaHeight();
                }}
                placeholder="Brief summary of this lesson..."
                className={styles.autoExpandingTextarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label>What students will learn</label>
              <input
                type="text"
                value={form.objectives}
                onChange={(e) => onFormChange((f) => ({ ...f, objectives: e.target.value }))}
                placeholder="Enter main goals separated by commas"
                className={styles.formInputShadcn}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Detailed Lesson Text</label>
              <div className={styles.richTextEditor}>
                <div className={styles.editorToolbar}>
                  <span>BOLD</span> | <span>ITALIC</span> | <span>HEADER</span> | <span>LINK</span>
                </div>
                <textarea
                  rows={3}
                  value={form.content}
                  onChange={(e) => onFormChange((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Write the text, instructions, and materials for this lesson here..."
                  className={styles.formTextareaShadcn}
                />
              </div>
            </div>

            <div className={styles.formGrid2}>
              <div className={styles.formGroup}>
                <label>Link to Video</label>
                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={(e) => onFormChange((f) => ({ ...f, videoUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  className={styles.formInputShadcn}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Link to PDF Document</label>
                <input
                  type="url"
                  value={form.pdfUrl}
                  onChange={(e) => onFormChange((f) => ({ ...f, pdfUrl: e.target.value }))}
                  placeholder="https://example.com/handout.pdf"
                  className={styles.formInputShadcn}
                />
              </div>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.switchLabelContainer}>
                <span className={styles.switchTitle}>Make visible to the public</span>
                <span className={styles.switchSubtitle}>Turn this on to let users view this lesson immediately.</span>
              </div>
              <label className={styles.switchToggle}>
                <input
                  type="checkbox"
                  checked={form.status === "Published"}
                  onChange={(e) => onFormChange((f) => ({ ...f, status: e.target.checked ? "Published" : "Draft" }))}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <Button variant="admin-secondary" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="admin-primary" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}