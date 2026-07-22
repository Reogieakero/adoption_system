"use client";

import React, { useMemo, useState } from "react";
import { FolderOpen, Loader2 } from "lucide-react";
import styles from "./page.module.css";
import { useLearningModules } from "@/hooks/admin/use-learning-modules";
import type { ElearningModule } from "@/types";
import PageHeader from "./components/PageHeader";
import SummaryCards from "./components/SummaryCards";
import FilterBar from "./components/FilterBar";
import ModulesGrid from "./components/ModulesGrid";
import EmptyState from "./components/EmptyState";
import ModuleFormModal from "./components/ModuleFormModal";

interface LearningModuleFormState {
  title: string;
  category: string;
  difficulty: string;
  duration: string;
  description: string;
  objectives: string;
  content: string;
  videoUrl: string;
  pdfUrl: string;
  status: string;
}

const CATEGORIES = [
  "Responsible Pet Ownership", "Dog Behavior", "Cat Behavior",
  "Basic Dog Training", "Basic Cat Training", "Pet Health Care",
  "Vaccination Awareness", "Animal Welfare Laws", "Adoption Preparation",
  "Post-Adoption Care"
];

const EMPTY_FORM: LearningModuleFormState = {
  title: "",
  category: CATEGORIES[0],
  difficulty: "Beginner",
  duration: "",
  description: "",
  objectives: "",
  content: "",
  videoUrl: "",
  pdfUrl: "",
  status: "draft",
};

export default function LearningManagementPage() {
  const {
    modules,
    isLoading,
    error,
    addModule,
    editModule,
    removeModule,
  } = useLearningModules();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState<LearningModuleFormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredModules = useMemo(() => {
    return modules.filter((mod) => {
      const matchesSearch = mod.title.toLowerCase().includes(search.toLowerCase()) ||
                            (mod.description ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || (mod.category_name ?? '') === selectedCategory;
      const matchesStatus = selectedStatus === "All" || mod.status === selectedStatus;
      const matchesDifficulty = selectedDifficulty === "All";
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

  const openEditModal = (module: ElearningModule) => {
    setEditingId(module.module_id);
    setForm({
      title: module.title,
      category: module.category_name ?? '',
      difficulty: 'Beginner',
      duration: 'N/A',
      description: module.description ?? '',
      objectives: '',
      content: module.content_body,
      videoUrl: module.video_url ?? '',
      pdfUrl: '',
      status: module.status,
    });
    setImageFile(null);
    setImagePreview(module.cover_image_url ?? null);
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
      setFormError("Module title is required.");
      return;
    }

    setIsSaving(true);
    setFormError(null);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        content_body: form.content,
        video_url: form.videoUrl || null,
        cover_image_url: null,
        order_index: 0,
        status: form.status as 'draft' | 'published',
        category_id: 1,
        created_by_admin_id: 1,
      };
      if (editingId) {
        await editModule(editingId, payload, imageFile);
      } else {
        await addModule(payload, imageFile);
      }
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save learning module");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setActiveDropdownId(null);
    try {
      await removeModule(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete module");
    }
  };

  const handleToggleStatus = async (module: ElearningModule) => {
    setActiveDropdownId(null);
    try {
      await editModule(module.module_id, {
        status: module.status === "published" ? "draft" : "published",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const categoryOptions = useMemo(() => [
    { label: "All Categories", value: "All" },
    ...CATEGORIES.map((cat) => ({ label: cat, value: cat })),
  ], []);

  const difficultyOptions = [
    { label: "All Difficulties", value: "All" },
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ];

  const statusOptions = [
    { label: "All Statuses", value: "All" },
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
  ];

  const modalCategoryOptions = useMemo(() =>
    CATEGORIES.map((cat) => ({ label: cat, value: cat })), []);

  const modalDifficultyOptions = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ];

  const totalModules = modules.length;
  const publishedCount = modules.filter((m) => m.status === "published").length;
  const draftCount = modules.filter((m) => m.status === "draft").length;
  const totalViews = 0;

  return (
    <div className={styles.adminContainer}>
      <PageHeader onAddClick={openCreateModal} />

      {error && <div className={styles.errorBanner}>{error}</div>}

      <SummaryCards
        totalModules={totalModules}
        publishedCount={publishedCount}
        draftCount={draftCount}
        totalViews={totalViews}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        categoryOptions={categoryOptions}
        difficultyOptions={difficultyOptions}
        statusOptions={statusOptions}
      />

      {isLoading ? (
        <EmptyState icon={<Loader2 size={36} className="animate-spin" />} title="Loading learning modules…" />
      ) : filteredModules.length > 0 ? (
        <ModulesGrid
          modules={filteredModules}
          activeDropdownId={activeDropdownId}
          onToggleDropdown={(id) => setActiveDropdownId(activeDropdownId === id ? null : id)}
          onEdit={openEditModal}
          onView={openEditModal}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState
          icon={<FolderOpen size={36} />}
          title="No learning modules available."
          description="No content matches your selected filters. Refine the queries or create your first interactive module."
          actionLabel="Create Your First Module"
          onAction={openCreateModal}
        />
      )}

      {isModalOpen && (
        <ModuleFormModal
          isEditing={Boolean(editingId)}
          form={form}
          onFormChange={setForm}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          isSaving={isSaving}
          formError={formError}
          categoryOptions={modalCategoryOptions}
          difficultyOptions={modalDifficultyOptions}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}
    </div>
  );
}
