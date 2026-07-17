"use client";

import React, { useMemo, useState } from "react";
import { FolderOpen, Loader2 } from "lucide-react";
import styles from "./Learning.module.css";
import { useLearningModules } from "@/hooks/admin/use-learning-modules";
import type { LearningModule, LearningModuleFormState } from "./types";
import PageHeader from "./components/PageHeader";
import SummaryCards from "./components/SummaryCards";
import FilterBar from "./components/FilterBar";
import ModulesGrid from "./components/ModulesGrid";
import EmptyState from "./components/EmptyState";
import ModuleFormModal from "./components/ModuleFormModal";

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
  status: "Draft",
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

  const [form, setForm] = useState<LearningModuleFormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredModules = useMemo(() => {
    return modules.filter((mod) => {
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
      setFormError("Module title is required.");
      return;
    }

    setIsSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        await editModule(editingId, { ...form }, imageFile);
      } else {
        await addModule({ ...form, image: "" }, imageFile);
      }
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save learning module");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActiveDropdownId(null);
    try {
      await removeModule(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete module");
    }
  };

  const handleDuplicate = async (id: string) => {
    setActiveDropdownId(null);
    try {
      await duplicateModule(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to duplicate module");
    }
  };

  const handleToggleStatus = async (module: LearningModule) => {
    setActiveDropdownId(null);
    try {
      await editModule(module.id, {
        status: module.status === "Published" ? "Draft" : "Published",
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
    { label: "Published", value: "Published" },
    { label: "Draft", value: "Draft" },
  ];

  const modalCategoryOptions = useMemo(() =>
    CATEGORIES.map((cat) => ({ label: cat, value: cat })), []);

  const modalDifficultyOptions = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ];

  const totalModules = modules.length;
  const publishedCount = modules.filter((m) => m.status === "Published").length;
  const draftCount = modules.filter((m) => m.status === "Draft").length;
  const totalViews = modules.reduce((acc, curr) => acc + curr.views, 0);

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
        <EmptyState icon={<Loader2 size={36} className="animate-spin" />} title="Loading learning modulesâ€¦" />
      ) : filteredModules.length > 0 ? (
        <ModulesGrid
          modules={filteredModules}
          activeDropdownId={activeDropdownId}
          onToggleDropdown={(id) => setActiveDropdownId(activeDropdownId === id ? null : id)}
          onEdit={openEditModal}
          onDuplicate={handleDuplicate}
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


