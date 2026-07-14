// learning/page.tsx
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  FileEdit,
  Users,
  Plus,
  Search,
  SlidersHorizontal,
  MoreVertical,
  Eye,
  Trash2,
  Copy,
  Globe,
  Clock,
  TrendingUp,
  ChevronDown,
  Check,
  Image as ImageIcon,
  FolderOpen,
  Loader2,
} from "lucide-react";
import styles from "./Learning.module.css";
import { useLearningModules } from "../../hooks/admin/useLearningModules";
import type { LearningModule, ModuleDifficulty, ModuleStatus } from "./types";

const CATEGORIES = [
  "Responsible Pet Ownership", "Dog Behavior", "Cat Behavior",
  "Basic Dog Training", "Basic Cat Training", "Pet Health Care",
  "Vaccination Awareness", "Animal Welfare Laws", "Adoption Preparation",
  "Post-Adoption Care"
];

// Helper Component for Custom Shadcn-styled Dropdowns
function ShadcnSelect({
  value,
  onChange,
  options,
  placeholder,
  showLeftIcon = false
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  showLeftIcon?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={styles.selectWrapperShadcn} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.selectTriggerShadcn} ${showLeftIcon ? styles.triggerWithIcon : ""}`}
      >
        {showLeftIcon && <SlidersHorizontal size={12} className={styles.selectIconLeft} />}
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={14} className={styles.selectIconRight} />
      </button>

      {isOpen && (
        <div className={styles.selectContentShadcn}>
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`${styles.selectItemShadcn} ${value === opt.value ? styles.selectItemActive : ""}`}
            >
              <span className={styles.selectItemCheck}>
                {value === opt.value && <Check size={12} />}
              </span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const EMPTY_FORM = {
  title: "",
  category: CATEGORIES[0],
  difficulty: "Beginner" as ModuleDifficulty,
  duration: "",
  description: "",
  objectives: "",
  content: "",
  videoUrl: "",
  pdfUrl: "",
  status: "Draft" as ModuleStatus,
};

export default function LearningManagementPage() {
  const {
    modules,
    isLoading,
    error,
    addModule,
    editModule,
    removeModule,
    duplicateModule,
  } = useLearningModules();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredModules = useMemo(() => {
    return modules.filter(mod => {
      const matchesSearch = mod.title.toLowerCase().includes(search.toLowerCase()) ||
                            mod.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || mod.category === selectedCategory;
      const matchesStatus = selectedStatus === "All" || mod.status === selectedStatus;
      const matchesDifficulty = selectedDifficulty === "All" || mod.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty;
    });
  }, [modules, search, selectedCategory, selectedStatus, selectedDifficulty]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (module: LearningModule) => {
    setEditingId(module.id);
    setForm({
      title: module.title,
      category: module.category,
      difficulty: module.difficulty,
      duration: module.duration,
      description: module.description,
      objectives: module.objectives,
      content: module.content,
      videoUrl: module.videoUrl,
      pdfUrl: module.pdfUrl,
      status: module.status,
    });
    setImageFile(null);
    setImagePreview(module.image || null);
    setFormError(null);
    setIsModalOpen(true);
    setActiveDropdownId(null);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setFormError(null);
    setIsModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Module title is required.');
      return;
    }

    setIsSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        await editModule(editingId, { ...form }, imageFile);
      } else {
        await addModule({ ...form, image: '' }, imageFile);
      }
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save learning module');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActiveDropdownId(null);
    try {
      await removeModule(id);
    } catch (err) {
      // Surface delete failures inline rather than losing them silently
      alert(err instanceof Error ? err.message : 'Failed to delete module');
    }
  };

  const handleDuplicate = async (id: string) => {
    setActiveDropdownId(null);
    try {
      await duplicateModule(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to duplicate module');
    }
  };

  const handleToggleStatus = async (module: LearningModule) => {
    setActiveDropdownId(null);
    try {
      await editModule(module.id, {
        status: module.status === "Published" ? "Draft" : "Published",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  // Build filter options arrays
  const categoryOptions = useMemo(() => [
    { label: "All Categories", value: "All" },
    ...CATEGORIES.map(cat => ({ label: cat, value: cat }))
  ], []);

  const difficultyOptions = [
    { label: "All Difficulties", value: "All" },
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" }
  ];

  const statusOptions = [
    { label: "All Statuses", value: "All" },
    { label: "Published", value: "Published" },
    { label: "Draft", value: "Draft" }
  ];

  const modalCategoryOptions = useMemo(() =>
    CATEGORIES.map(cat => ({ label: cat, value: cat })), []
  );

  const modalDifficultyOptions = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" }
  ];

  const totalModules = modules.length;
  const publishedCount = modules.filter(m => m.status === "Published").length;
  const draftCount = modules.filter(m => m.status === "Draft").length;
  const totalViews = modules.reduce((acc, curr) => acc + curr.views, 0);

  return (
    <div className={styles.adminContainer}>

      {/* PAGE HEADER */}
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1>E-Learning</h1>
          <p>Create and manage educational modules that promote responsible pet ownership and animal welfare.</p>
        </div>
        <button onClick={openCreateModal} className={styles.btnPrimarySupabase}>
          <Plus size={14} strokeWidth={2.5} /> Add Learning Module
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: "1.5rem", padding: "0.75rem 1rem", borderRadius: "0.375rem", border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c", fontSize: "0.8125rem" }}>
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <p>Total Modules</p>
            <BookOpen size={16} color="#94a3b8" />
          </div>
          <div className={styles.summaryCardValue}>{totalModules}</div>
          <p className={styles.summaryCardDesc}>Active items in storage</p>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <p>Published</p>
            <CheckCircle2 size={16} color="#10b981" />
          </div>
          <div className={styles.summaryCardValue} style={{ color: "#10b981" }}>{publishedCount}</div>
          <p className={styles.summaryCardDesc}>Live & visible to community</p>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <p>Draft Modules</p>
            <FileEdit size={16} color="#f59e0b" />
          </div>
          <div className={styles.summaryCardValue} style={{ color: "#b45309" }}>{draftCount}</div>
          <p className={styles.summaryCardDesc}>Work in progress files</p>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <p>Total Views</p>
            <Users size={16} color="#3b82f6" />
          </div>
          <div className={styles.summaryCardValue} style={{ color: "#2563eb" }}>{totalViews.toLocaleString()}</div>
          <p className={styles.summaryCardDesc}>Total operational reach</p>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search module title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInputShadcn}
          />
        </div>
        <div className={styles.filterGroup}>
          <ShadcnSelect
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categoryOptions}
            placeholder="All Categories"
            showLeftIcon
          />
          <ShadcnSelect
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
            options={difficultyOptions}
            placeholder="All Difficulties"
          />
          <ShadcnSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
            placeholder="All Statuses"
          />
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <Loader2 size={36} className="animate-spin" />
          </div>
          <h3>Loading learning modules…</h3>
        </div>
      ) : filteredModules.length > 0 ? (
        /* LEARNING MODULES GRID */
        <div className={styles.modulesGrid}>
          {filteredModules.map((module) => (
            <div key={module.id} className={styles.moduleCard}>
              <div className={styles.imageContainer}>
                {module.image ? (
                  <img src={module.image} alt={module.title} className={styles.cardImage} />
                ) : (
                  <div className={styles.cardImage} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
                    <ImageIcon size={28} color="#cbd5e1" />
                  </div>
                )}
                <div className={styles.badgeContainer}>
                  <span className={styles.badge}>{module.difficulty}</span>
                  <span className={`${styles.badge} ${module.status === "Published" ? styles.badgePublished : styles.badgeDraft}`}>
                    {module.status}
                  </span>
                </div>

                <div className={styles.actionsTrigger}>
                  <button
                    onClick={() => setActiveDropdownId(activeDropdownId === module.id ? null : module.id)}
                    className={styles.dropdownTriggerBtn}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {activeDropdownId === module.id && (
                    <div className={styles.dropdownMenu}>
                      <button onClick={() => setActiveDropdownId(null)} className={styles.dropdownItem}>
                        <Eye size={14} /> View Module
                      </button>
                      <button onClick={() => openEditModal(module)} className={styles.dropdownItem}>
                        <FileEdit size={14} /> Edit Module
                      </button>
                      <button onClick={() => handleDuplicate(module.id)} className={styles.dropdownItem}>
                        <Copy size={14} /> Duplicate Module
                      </button>
                      <button onClick={() => handleToggleStatus(module)} className={styles.dropdownItem} style={{ fontWeight: 600, color: "#2563eb" }}>
                        <Globe size={14} /> {module.status === "Published" ? "Unpublish" : "Publish"}
                      </button>
                      <div className={styles.dropdownDivider}></div>
                      <button onClick={() => handleDelete(module.id)} className={styles.dropdownItem} style={{ color: "#e11d48" }}>
                        <Trash2 size={14} /> Delete Module
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.cardBody}>
                <div>
                  <div className={styles.categoryLabel}>{module.category}</div>
                  <h3 className={styles.cardTitle}>{module.title}</h3>
                  <p className={styles.cardDesc}>{module.description}</p>
                </div>

                <div className={styles.cardMetricsRow}>
                  <div className={styles.metricItem}>
                    <Clock size={14} color="#94a3b8" />
                    <span>{module.duration}</span>
                  </div>
                  <div className={styles.metricItem} style={{ justifyContent: "center" }}>
                    <Eye size={14} color="#94a3b8" />
                    <span>{module.views} views</span>
                  </div>
                  <div className={styles.metricItem} style={{ justifyContent: "flex-end" }}>
                    <TrendingUp size={14} color="#10b981" />
                    <span>{module.completionRate} CR</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span style={{ color: "#475569", cursor: "pointer" }}>Details</span>
                <div className={styles.cardFooterActions}>
                  <span style={{ color: "#475569", cursor: "pointer" }} onClick={() => openEditModal(module)}>Edit</span>
                  <button onClick={() => handleDelete(module.id)} className={styles.btnDanger}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* EMPTY STATE ELEMENT */
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <FolderOpen size={36} />
          </div>
          <h3>No learning modules available.</h3>
          <p>No content matches your selected filters. Refine the queries or create your first interactive module.</p>
          <button onClick={openCreateModal} className={styles.btnPrimarySupabase}>
            Create Your First Module
          </button>
        </div>
      )}

      {/* ADD/EDIT MODAL DIALOG CONTAINER */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>

            <div className={styles.modalHeader}>
              <h2>{editingId ? "Edit Learning Module" : "Add New Learning Module"}</h2>
              <p>Configure content metrics, categorization pipelines, and media assets for deployment.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {formError && (
                <div style={{ padding: "0.6rem 0.75rem", borderRadius: "0.375rem", border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c", fontSize: "0.8125rem" }}>
                  {formError}
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Module Title *</label>
                <input
                  type="text" required value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g., Post-Adoption Acclimation Blueprint" className={styles.formInputShadcn}
                />
              </div>

              <div className={styles.formGrid3}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <ShadcnSelect
                    value={form.category}
                    onChange={(val) => setForm(f => ({ ...f, category: val }))}
                    options={modalCategoryOptions}
                    placeholder="Select Category"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Difficulty Level</label>
                  <ShadcnSelect
                    value={form.difficulty}
                    onChange={(val) => setForm(f => ({ ...f, difficulty: val as ModuleDifficulty }))}
                    options={modalDifficultyOptions}
                    placeholder="Select Difficulty"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Estimated Duration</label>
                  <input type="text" value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g., 45 mins" className={styles.formInputShadcn} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Cover Image</label>
                <label className={styles.uploadBox} style={{ cursor: "pointer" }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Cover preview" style={{ maxHeight: "8rem", borderRadius: "0.25rem" }} />
                  ) : (
                    <>
                      <ImageIcon size={20} color="#94a3b8" />
                      <span style={{ fontSize: "0.6875rem", color: "#64748b" }}>Click to upload file asset (PNG, JPG up to 5MB)</span>
                    </>
                  )}
                  <input type="file" accept="image/png,image/jpeg" onChange={handleImageChange} style={{ display: "none" }} />
                </label>
              </div>

              <div className={styles.formGroup}>
                <label>Short Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Provide a high-level educational summary overview..." className={styles.formTextareaShadcn} style={{ resize: "none" }} />
              </div>

              <div className={styles.formGroup}>
                <label>Learning Objectives</label>
                <input type="text" value={form.objectives} onChange={(e) => setForm(f => ({ ...f, objectives: e.target.value }))} placeholder="Objective tokens separated by commas" className={styles.formInputShadcn} />
              </div>

              <div className={styles.formGroup}>
                <label>Rich Text Lesson Content</label>
                <div className={styles.richTextEditor}>
                  <div className={styles.editorToolbar}>
                    <span>BOLD</span> | <span>ITALIC</span> | <span>HEADER</span> | <span>HYPERLINK</span>
                  </div>
                  <textarea rows={3} value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Compose structured instructional lesson documentation..." className={styles.formTextareaShadcn} style={{ border: "none", borderRadius: 0, resize: "none" }} />
                </div>
              </div>

              <div className={styles.formGrid3} style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                <div className={styles.formGroup}>
                  <label>Video URL</label>
                  <input type="url" value={form.videoUrl} onChange={(e) => setForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://youtube.com/v/..." className={styles.formInputShadcn} />
                </div>
                <div className={styles.formGroup}>
                  <label>PDF URL</label>
                  <input type="url" value={form.pdfUrl} onChange={(e) => setForm(f => ({ ...f, pdfUrl: e.target.value }))} placeholder="https://.../worksheet.pdf" className={styles.formInputShadcn} />
                </div>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.switchLabelContainer}>
                  <span className={styles.switchTitle}>Publish Status Deployment</span>
                  <span className={styles.switchSubtitle}>Instantly launch this module asset across live tables.</span>
                </div>
                <label className={styles.switchToggle}>
                  <input
                    type="checkbox" checked={form.status === "Published"}
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.checked ? "Published" : "Draft" }))}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={resetForm} className={styles.btnSecondaryShadcn} disabled={isSaving}>Cancel</button>
                <button type="submit" className={styles.btnPrimarySupabase} disabled={isSaving}>
                  {isSaving ? "Saving…" : "Save & Deploy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}