'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import styles from '../[id]/components/FormControls.module.css';

export interface AnimalFormData {
  id: string;
  name: string;
  species: string;
  breed: string;
  sex: string;
  age: string;
  size: string;
  colorMarkings: string;
  rescueStatus: string;
  adoptionStatus: string;
  healthStatus: string;
  vaccinationStatus: string;
  heartRate: string;
  location: string;
  dateRescued: string;
  dateAdded: string;
  lastUpdated: string;
  bio: string;
  photo: string;
}

interface AnimalFormProps {
  initialData: AnimalFormData | null;
  onSave: (data: AnimalFormData, photoFile: File | null) => Promise<void>;
  isNew: boolean;
  title: string;
}

const SPECIES_OPTIONS = ['Dog', 'Cat'] as const;
const SEX_OPTIONS = ['Male', 'Female', 'Unknown'] as const;
const SIZE_OPTIONS = ['Small', 'Medium', 'Large', 'Extra Large'] as const;
const RESCUE_OPTIONS = ['Reported', 'Rescued', 'In Shelter', 'In Foster', 'Released', 'Transferred'] as const;
const ADOPTION_OPTIONS = ['Available', 'Pending', 'Adopted', 'Unavailable'] as const;
const HEALTH_OPTIONS = ['Healthy', 'Recovering', 'Under Treatment', 'Critical'] as const;
const VACCINATION_OPTIONS = ['Vaccinated', 'Not Vaccinated', 'Not Fully Vaccinated', 'Due', 'Pending'] as const;

const STEPS = [
  { eyebrow: 'RECORD 01', title: 'Identification' },
  { eyebrow: 'RECORD 02', title: 'Status & Health' },
  { eyebrow: 'RECORD 03', title: 'Location & Timeline' },
  { eyebrow: 'RECORD 04', title: 'Photo & Bio' },
  { eyebrow: 'VERIFICATION', title: 'Review' },
] as const;

function formatDisplayDate(year: number, month: number, day: number): string {
  return new Date(year, month, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function todayDisplay(): string {
  const now = new Date();
  return formatDisplayDate(now.getFullYear(), now.getMonth(), now.getDate());
}

interface CustomSelectProps {
  value: string;
  placeholder: string;
  options: readonly string[];
  onChange: (val: string) => void;
}

function CustomSelect({ value, placeholder, options, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.selectWrapper} ref={containerRef}>
      <button type="button" className={styles.selectTrigger} onClick={() => setIsOpen(!isOpen)} aria-haspopup="listbox" aria-expanded={isOpen}>
        <span>{value || placeholder}</span>
        <svg className={`${styles.selectChevron} ${isOpen ? styles.chevronOpen : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 5.25L7 8.75l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {isOpen && (
        <ul className={styles.selectContent} role="listbox">
          {options.map((opt) => (
            <li key={opt} role="option" aria-selected={value === opt} className={`${styles.selectItem} ${value === opt ? styles.selectItemActive : ''}`} onClick={() => { onChange(opt); setIsOpen(false); }}>
              {opt}
              {value === opt && (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={styles.checkIcon}><path d="M13.5 4.5l-7 7L3.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface CustomDatePickerProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

function CustomDatePicker({ value, onChange, disabled }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateSelect = (day: number) => {
    if (disabled) return;
    onChange(formatDisplayDate(year, month, day));
    setIsOpen(false);
  };

  const displayLabel = value || 'Pick a date';
  const blanks = Array(firstDayIndex).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className={styles.selectWrapper} ref={containerRef}>
      <button type="button" className={`${styles.selectTrigger} ${disabled ? styles.disabledTrigger : ''}`} onClick={() => !disabled && setIsOpen(!isOpen)} disabled={disabled}>
        <span>{displayLabel}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles['icon-muted']}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>
      {isOpen && (
        <div className={styles.calendarPopover}>
          <div className={styles.calendarHeader}>
            <Button variant="admin-ghost" square onClick={handlePrevMonth}>&lsaquo;</Button>
            <div className={styles.calendarMonthLabel}>{monthsList[month]} {year}</div>
            <Button variant="admin-ghost" square onClick={handleNextMonth}>&rsaquo;</Button>
          </div>
          <div className={styles.calendarGrid}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className={styles.calendarWeekDay}>{d}</div>
            ))}
            {blanks.map((_, i) => <div key={`b-${i}`} />)}
            {days.map((d) => {
              const isSelected = value === formatDisplayDate(year, month, d);
              return (
                <button key={d} type="button" className={`${styles.calendarDay} ${isSelected ? styles.calendarDaySelected : ''}`} onClick={() => handleDateSelect(d)}>
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d={direction === 'left' ? 'M10 3.5L5 8l5 4.5' : 'M6 3.5l5 4.5-5 4.5'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AnimalForm({ initialData, onSave, isNew, title }: AnimalFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<AnimalFormData>(() => initialData || {
    id: '',
    name: '',
    species: 'Dog',
    breed: '',
    sex: 'Male',
    age: '',
    size: 'Small',
    colorMarkings: '',
    rescueStatus: 'Reported',
    adoptionStatus: 'Available',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Vaccinated',
    heartRate: '',
    location: '',
    dateRescued: '',
    dateAdded: todayDisplay(),
    lastUpdated: todayDisplay(),
    bio: '',
    photo: '',
  });
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const update = <K extends keyof AnimalFormData>(key: K, value: AnimalFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
  };

  const handleRemovePhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhotoFile(null);
    setPreviewUrl(null);
    setFileName(null);
    update('photo', '');
  };

  const isFirstStep = step === 0;
  const isLastStep = step === STEPS.length - 1;
  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(form, photoFile);
      router.push(isNew ? '/admin/animals' : `/admin/animals/${form.id}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save animal');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement;
        if (target && target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        e.stopPropagation();
        if (isLastStep) handleSubmit();
        else goNext();
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [step, form, isLastStep, isNew]);

  const current = STEPS[step];

  return (
    <div className={styles.pageForm}>
      <div className={styles.pageHeader}>
        <Link href="/admin/animals" className={styles.pageBackLink}>&larr; Back</Link>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      {saveError && <p className={styles.errorBanner}>{saveError}</p>}

      <div className={styles.stepHeaderRow}>
        <div>
          <p className={styles.stepEyebrow}>{current.eyebrow}</p>
          <h3 className={styles.stepTitle}>{current.title}</h3>
        </div>
        <div className={styles.stepPager}>
          <Button variant="admin-ghost" square onClick={goBack} disabled={isFirstStep} aria-label="Previous step">
            <ArrowIcon direction="left" />
          </Button>
          <span className={styles.pagerCount}>{step + 1} / {STEPS.length}</span>
          <Button variant="admin-ghost" square onClick={goNext} disabled={isLastStep} aria-label="Next step">
            <ArrowIcon direction="right" />
          </Button>
        </div>
      </div>

      <div className={styles.stepDots}>
        {STEPS.map((s, i) => (
          <button key={s.title} type="button" className={i === step ? `${styles.dot} ${styles.dotActive}` : styles.dot} onClick={() => setStep(i)} aria-label={`Go to ${s.title}`} aria-current={i === step}>
            {i + 1}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {step === 0 && (
          <div className={styles.compactFormLayout}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-name">Name</label>
                <input id="animal-name" className={styles.input} type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Max" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Species</label>
                <CustomSelect value={form.species} placeholder="Select species" options={SPECIES_OPTIONS} onChange={(val) => update('species', val)} />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-breed">Breed</label>
                <input id="animal-breed" className={styles.input} type="text" value={form.breed} onChange={(e) => update('breed', e.target.value)} placeholder="e.g. Golden Retriever" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Sex</label>
                <CustomSelect value={form.sex} placeholder="Select sex" options={SEX_OPTIONS} onChange={(val) => update('sex', val)} />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-age">Estimated age</label>
                <input id="animal-age" className={styles.input} type="text" value={form.age} onChange={(e) => update('age', e.target.value)} placeholder="e.g. 4 years" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Size</label>
                <CustomSelect value={form.size} placeholder="Select size" options={SIZE_OPTIONS} onChange={(val) => update('size', val)} />
              </div>
            </div>
            <div className={`${styles.field} ${styles['field-no-mb']}`}>
              <label className={styles.label} htmlFor="animal-markings">Color / markings</label>
              <input id="animal-markings" className={styles.input} type="text" value={form.colorMarkings} onChange={(e) => update('colorMarkings', e.target.value)} placeholder="e.g. Black and tan saddle" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className={styles.compactFormLayout}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Rescue status</label>
                <CustomSelect value={form.rescueStatus} placeholder="Select status" options={RESCUE_OPTIONS} onChange={(val) => update('rescueStatus', val)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Adoption status</label>
                <CustomSelect value={form.adoptionStatus} placeholder="Select status" options={ADOPTION_OPTIONS} onChange={(val) => update('adoptionStatus', val)} />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Health status</label>
                <CustomSelect value={form.healthStatus} placeholder="Select status" options={HEALTH_OPTIONS} onChange={(val) => update('healthStatus', val)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Vaccination status</label>
                <CustomSelect value={form.vaccinationStatus} placeholder="Select status" options={VACCINATION_OPTIONS} onChange={(val) => update('vaccinationStatus', val)} />
              </div>
            </div>
            <div className={`${styles.field} ${styles['field-no-mb']}`}>
              <label className={styles.label} htmlFor="animal-heart-rate">Heart rate</label>
              <div className={styles.heartRow}>
                <span className={styles.heartDot} />
                <input id="animal-heart-rate" className={styles.input} type="text" value={form.heartRate} onChange={(e) => update('heartRate', e.target.value)} placeholder="e.g. 76 BPM" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.compactFormLayout}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="animal-location">Current shelter / location</label>
              <input id="animal-location" className={styles.input} type="text" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Main Shelter -- Kennel B1" />
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Date rescued</label>
                <CustomDatePicker value={form.dateRescued} onChange={(val) => update('dateRescued', val)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Date added</label>
                <CustomDatePicker value={form.dateAdded} onChange={(val) => update('dateAdded', val)} />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Last updated</label>
                <CustomDatePicker value={form.lastUpdated} onChange={() => {}} disabled={true} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-id">Animal ID</label>
                <input id="animal-id" className={styles.input} type="text" value={form.id} disabled readOnly />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.compactFormLayout}>
            <div className={`${styles.field} ${styles['field-no-mb']}`}>
              <label className={styles.label}>Animal photo</label>
              <div className={styles.fileZone}>
                {previewUrl ? <img src={previewUrl} alt="" className={styles.filePreview} /> : <div className={styles.filePreviewEmpty} />}
                <div className={styles.fileZoneInner}>
                  <label htmlFor="animal-photo-file" className={`${styles.labelBtn}`}>
                    Choose file
                  </label>
                  <input id="animal-photo-file" className={styles.fileHiddenInput} type="file" accept="image/png, image/jpeg" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
                  {fileName ? (
                    <>
                      <span className={styles.fileMeta}>{fileName}</span>
                      <Button variant="admin-danger" square onClick={handleRemovePhoto}>Remove</Button>
                    </>
                  ) : (
                    <span className={styles.fileMeta}>No photo -- JPG/PNG, optional</span>
                  )}
                </div>
              </div>
            </div>
            <div className={`${styles.field}`} style={{ marginBottom: 0, marginTop: '0.85rem' }}>
              <label className={styles.label} htmlFor="animal-bio">Bio</label>
              <textarea id="animal-bio" className={styles.textarea} value={form.bio} onChange={(e) => update('bio', e.target.value)} placeholder="Short description for adoption listings..." />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={styles.reviewWrapper}>
            <div className={styles.reviewGrid}>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Identity</span>
                <span className={styles.reviewValue}>{form.name || '--'} ({form.species})</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Breed / Sex</span>
                <span className={styles.reviewValue}>{form.breed || '--'} . {form.sex}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Age / Size</span>
                <span className={styles.reviewValue}>{form.age || '--'} ({form.size})</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Markings</span>
                <span className={styles.reviewValue}>{form.colorMarkings || '--'}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Rescue / Adopt</span>
                <span className={styles.reviewValue}>{form.rescueStatus}{' → '}{form.adoptionStatus}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Health / Vax</span>
                <span className={styles.reviewValue}>{form.healthStatus}{' · '}{form.vaccinationStatus}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Vitals</span>
                <span className={styles.reviewValue}>{form.heartRate || '--'}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Location</span>
                <span className={styles.reviewValue}>{form.location || '--'}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Rescued / Added</span>
                <span className={styles.reviewValue}>{form.dateRescued || '--'} / {form.dateAdded}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Animal ID</span>
                <span className={styles.reviewValue}>{form.id}</span>
              </div>
            </div>
            {form.bio && (
              <div className={styles.reviewBioSection}>
                <span className={styles.reviewLabel}>Bio Summary</span>
                <p className={styles.reviewBioText}>{form.bio}</p>
              </div>
            )}
          </div>
        )}
      </form>

      <footer className={styles.footerContainer}>
        <div className={styles.footerActionRow}>
          {isFirstStep ? (
            <Button variant="admin-secondary" onClick={() => router.push('/admin/animals')} disabled={isSaving}>Cancel</Button>
          ) : (
            <Button variant="admin-secondary" onClick={goBack} disabled={isSaving}>Back</Button>
          )}
          {isLastStep ? (
            <Button variant="admin-primary" onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? 'Saving...' : `Confirm & ${isNew ? 'Add' : 'Save'} [Enter]`}
            </Button>
          ) : (
            <Button variant="admin-primary" onClick={goNext} disabled={isSaving}>Next</Button>
          )}
        </div>
        <p className={styles.footerHintText}>Press Enter to proceed</p>
      </footer>
    </div>
  );
}
