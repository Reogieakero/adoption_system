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
  FolderOpen
} from "lucide-react";
import styles from "./Learning.module.css";

const INITIAL_MODULES = [
  {
    id: "mod-1",
    title: "Introduction to Responsible Pet Ownership",
    description: "Learn the foundational pillars of bringing a rescued animal into your home safely and sustainably.",
    category: "Responsible Pet Ownership",
    difficulty: "Beginner",
    duration: "45 mins",
    status: "Published",
    views: 1240,
    completionRate: "88%",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "mod-2",
    title: "Understanding Canine Separation Anxiety",
    description: "Advanced behavioral analysis and training techniques to manage and treat severe separation anxiety in shelter dogs.",
    category: "Dog Behavior",
    difficulty: "Advanced",
    duration: "120 mins",
    status: "Published",
    views: 890,
    completionRate: "72%",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "mod-3",
    title: "Feline Vaccination Timeline & Health Basics",
    description: "A definitive guide on key immunizations, standard schedules, and recognizing early signs of medical distress.",
    category: "Pet Health Care",
    difficulty: "Intermediate",
    duration: "60 mins",
    status: "Draft",
    views: 0,
    completionRate: "0%",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=60"
  }
];

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

export default function LearningManagementPage() {
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formDifficulty, setFormDifficulty] = useState("Beginner");
  const [formDuration, setFormDuration] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formStatus, setFormStatus] = useState("Draft");

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

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newModule = {
      id: `mod-${Date.now()}`,
      title: formTitle,
      description: formDesc || "No description provided.",
      category: formCategory,
      difficulty: formDifficulty,
      duration: formDuration || "30 mins",
      status: formStatus,
      views: 0,
      completionRate: "0%",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=60"
    };

    setModules([newModule, ...modules]);
    resetForm();
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormDuration("");
    setFormDifficulty("Beginner");
    setFormCategory(CATEGORIES[0]);
    setFormStatus("Draft");
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
    setActiveDropdownId(null);
  };

  const handleToggleStatus = (id: string) => {
    setModules(modules.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === "Published" ? "Draft" : "Published" };
      }
      return m;
    }));
    setActiveDropdownId(null);
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
        <button onClick={() => setIsModalOpen(true)} className={styles.btnPrimarySupabase}>
          <Plus size={14} strokeWidth={2.5} /> Add Learning Module
        </button>
      </div>

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

      {/* LEARNING MODULES GRID */}
      {filteredModules.length > 0 ? (
        <div className={styles.modulesGrid}>
          {filteredModules.map((module) => (
            <div key={module.id} className={styles.moduleCard}>
              <div className={styles.imageContainer}>
                <img src={module.image} alt={module.title} className={styles.cardImage} />
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
                      <button onClick={() => setActiveDropdownId(null)} className={styles.dropdownItem}>
                        <FileEdit size={14} /> Edit Module
                      </button>
                      <button onClick={() => setActiveDropdownId(null)} className={styles.dropdownItem}>
                        <Copy size={14} /> Duplicate Module
                      </button>
                      <button onClick={() => handleToggleStatus(module.id)} className={styles.dropdownItem} style={{ fontWeight: 600, color: "#2563eb" }}>
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
                  <span style={{ color: "#475569", cursor: "pointer" }}>Edit</span>
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
          <button onClick={() => setIsModalOpen(true)} className={styles.btnPrimarySupabase}>
            Create Your First Module
          </button>
        </div>
      )}

      {/* ADD/EDIT MODAL DIALOG CONTAINER */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            
            <div className={styles.modalHeader}>
              <h2>Add New Learning Module</h2>
              <p>Configure content metrics, categorization pipelines, and media assets for deployment.</p>
            </div>

            <form onSubmit={handleCreateModule} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Module Title *</label>
                <input 
                  type="text" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Post-Adoption Acclimation Blueprint" className={styles.formInputShadcn}
                />
              </div>

              <div className={styles.formGrid3}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <ShadcnSelect 
                    value={formCategory} 
                    onChange={setFormCategory} 
                    options={modalCategoryOptions} 
                    placeholder="Select Category"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Difficulty Level</label>
                  <ShadcnSelect 
                    value={formDifficulty} 
                    onChange={setFormDifficulty} 
                    options={modalDifficultyOptions} 
                    placeholder="Select Difficulty"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Estimated Duration</label>
                  <input type="text" value={formDuration} onChange={(e) => setFormDuration(e.target.value)} placeholder="e.g., 45 mins" className={styles.formInputShadcn} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Cover Image</label>
                <div className={styles.uploadBox}>
                  <ImageIcon size={20} color="#94a3b8" />
                  <span style={{ fontSize: "0.6875rem", color: "#64748b" }}>Click to upload file asset (PNG, JPG up to 5MB)</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Short Description</label>
                <textarea rows={2} value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Provide a high-level educational summary overview..." className={styles.formTextareaShadcn} style={{ resize: "none" }} />
              </div>

              <div className={styles.formGroup}>
                <label>Learning Objectives</label>
                <input type="text" placeholder="Objective tokens separated by commas" className={styles.formInputShadcn} />
              </div>

              <div className={styles.formGroup}>
                <label>Rich Text Lesson Content</label>
                <div className={styles.richTextEditor}>
                  <div className={styles.editorToolbar}>
                    <span>BOLD</span> | <span>ITALIC</span> | <span>HEADER</span> | <span>HYPERLINK</span>
                  </div>
                  <textarea rows={3} placeholder="Compose structured instructional lesson documentation..." className={styles.formTextareaShadcn} style={{ border: "none", borderRadius: 0, resize: "none" }} />
                </div>
              </div>

              <div className={styles.formGrid3} style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                <div className={styles.formGroup}>
                  <label>Video URL</label>
                  <input type="url" placeholder="https://youtube.com/v/..." className={styles.formInputShadcn} />
                </div>
                <div className={styles.formGroup}>
                  <label>PDF Attachment</label>
                  <input type="file" className={styles.formInputShadcn} style={{ fontSize: "10px", padding: "0.35rem" }} />
                </div>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.switchLabelContainer}>
                  <span className={styles.switchTitle}>Publish Status Deployment</span>
                  <span className={styles.switchSubtitle}>Instantly launch this module asset across live tables.</span>
                </div>
                <label className={styles.switchToggle}>
                  <input 
                    type="checkbox" checked={formStatus === "Published"}
                    onChange={(e) => setFormStatus(e.target.checked ? "Published" : "Draft")} 
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={resetForm} className={styles.btnSecondaryShadcn}>Cancel</button>
                <button type="submit" className={styles.btnPrimarySupabase}>Save & Deploy</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}