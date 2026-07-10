'use client';

import React, { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import modalStyles from './Modal.module.css';
import styles from './FormControls.module.css';
import type { AnimalCardData } from '../../components/AnimalCard';

type EditableAnimalData = AnimalCardData &
  Partial<{
    size: string;
    colorMarkings: string;
    rescueStatus: string;
    vaccinationStatus: string;
    heartRate: string;
    shelterLocation: string;
    dateRescued: string;
    dateAdded: string;
    lastUpdated: string;
    reporterName: string;
  }>;

interface EditAnimalModalProps {
  open: boolean;
  animal: AnimalCardData;
  onClose: () => void;
  onSave: (updated: AnimalCardData) => void | Promise<void>;
}

const SPECIES_OPTIONS = ['Dog', 'Cat'] as const;
const SEX_OPTIONS = ['Male', 'Female', 'Unknown'];
const SIZE_OPTIONS = ['Small', 'Medium', 'Large', 'Extra Large'];
const HEALTH_OPTIONS = ['Healthy', 'Recovering', 'Under Treatment', 'Critical'];
const ADOPTION_OPTIONS = ['Available', 'Pending', 'Adopted', 'Unavailable'];
const RESCUE_OPTIONS = ['In Shelter', 'In Foster', 'Released', 'Transferred'];
const VACCINATION_OPTIONS = ['Vaccinated', 'Not Vaccinated', 'Pending'];

const STEPS = [
  { eyebrow: 'RECORD 01', title: 'Identification' },
  { eyebrow: 'RECORD 02', title: 'Status & Health' },
  { eyebrow: 'RECORD 03', title: 'Location & Timeline' },
  { eyebrow: 'RECORD 04', title: 'Reported By & Photo' },
  { eyebrow: 'VERIFICATION', title: 'Review New Information' },
] as const;

interface CustomSelectProps {
  value: string;
  placeholder: string;
  options: readonly string[];
  onChange: (val: string) => void;
  id?: string;
}

function CustomSelect({ value, placeholder, options, onChange, id }: CustomSelectProps) {
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
    <div className={styles.selectWrapper} ref={containerRef} id={id}>
      <button
        type="button"
        className={styles.selectTrigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{value || placeholder}</span>
        <svg
          className={`${styles.selectChevron} ${isOpen ? styles.chevronOpen : ''}`}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3.5 5.25L7 8.75l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <ul className={styles.selectContent} role="listbox">
          {options.map((opt) => (
            <li
              key={opt}
              role="option"
              aria-selected={value === opt}
              className={`${styles.selectItem} ${value === opt ? styles.selectItemActive : ''}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
              {value === opt && (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={styles.checkIcon}>
                  <path d="M13.5 4.5l-7 7L3.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateSelect = (day: number) => {
    if (disabled) return;
    const pad = (n: number) => n.toString().padStart(2, '0');
    const selectedStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    onChange(selectedStr);
    setIsOpen(false);
  };

  const displayLabel = value ? value : 'Pick a date';
  const blanks = Array(firstDayIndex).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className={styles.selectWrapper} ref={containerRef}>
      <button
        type="button"
        className={`${styles.selectTrigger} ${disabled ? styles.disabledTrigger : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span>{displayLabel}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.calendarPopover}>
          <div className={styles.calendarHeader}>
            <button type="button" className={styles.calendarNavBtn} onClick={handlePrevMonth}>
              ‹
            </button>
            <div className={styles.calendarMonthLabel}>
              {monthsList[month]} {year}
            </div>
            <button type="button" className={styles.calendarNavBtn} onClick={handleNextMonth}>
              ›
            </button>
          </div>
          <div className={styles.calendarGrid}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className={styles.calendarWeekDay}>
                {d}
              </div>
            ))}
            {blanks.map((_, i) => (
              <div key={`b-${i}`} />
            ))}
            {days.map((d) => {
              const pad = (n: number) => n.toString().padStart(2, '0');
              const currentStr = `${year}-${pad(month + 1)}-${pad(d)}`;
              const isSelected = value === currentStr;
              return (
                <button
                  key={d}
                  type="button"
                  className={`${styles.calendarDay} ${isSelected ? styles.calendarDaySelected : ''}`}
                  onClick={() => handleDateSelect(d)}
                >
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d={direction === 'left' ? 'M10 3.5L5 8l5 4.5' : 'M6 3.5l5 4.5-5 4.5'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function EditAnimalModal({ open, animal, onClose, onSave }: EditAnimalModalProps) {
  const [form, setForm] = useState<EditableAnimalData>(animal);
  const [wasOpen, setWasOpen] = useState(open);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm(animal);
      setStep(0);
      setFileName(null);
    }
  }

  const update = <K extends keyof EditableAnimalData>(key: K, value: EditableAnimalData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) return;
    const reader = new FileReader();
    reader.onload = () => {
      update('photo', (reader.result as string) ?? '');
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const isFirstStep = step === 0;
  const isLastStep = step === STEPS.length - 1;
  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    function handleGlobalKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement;
        if (target && target.tagName === 'TEXTAREA') {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (isLastStep) {
          handleSave();
        } else {
          goNext();
        }
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [open, step, form, isLastStep]);

  const current = STEPS[step];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit animal record"
      description={`Update details for ${animal.name} (${animal.id}).`}
      footer={
        <div className={styles.footerContainer}>
          <div className={styles.footerActionRow}>
            {isFirstStep ? (
              <button type="button" className={modalStyles.btn} onClick={onClose} disabled={isSaving}>
                Cancel
              </button>
            ) : (
              <button type="button" className={modalStyles.btn} onClick={goBack} disabled={isSaving}>
                Back
              </button>
            )}
            {isLastStep ? (
              <button type="button" className={modalStyles.btnPrimary} onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving Changes…' : 'Confirm Save? [Enter]'}
              </button>
            ) : (
              <button type="button" className={modalStyles.btnPrimary} onClick={goNext} disabled={isSaving}>
                Next
              </button>
            )}
          </div>
          <p className={styles.footerHintText}>Press Enter ↵ to proceed</p>
        </div>
      }
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={styles.stepHeaderRow}>
          <div>
            <p className={styles.stepEyebrow}>{current.eyebrow}</p>
            <h3 className={styles.stepTitle}>{current.title}</h3>
          </div>
          <div className={styles.stepPager}>
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={goBack}
              disabled={isFirstStep}
              aria-label="Previous step"
            >
              <ArrowIcon direction="left" />
            </button>
            <span className={styles.pagerCount}>
              {step + 1} / {STEPS.length}
            </span>
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={goNext}
              disabled={isLastStep}
              aria-label="Next step"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>

        <div className={styles.stepDivider} />

        <div className={styles.stepDots}>
          {STEPS.map((s, i) => (
            <button
              type="button"
              key={s.title}
              className={i === step ? `${styles.dot} ${styles.dotActive}` : styles.dot}
              onClick={() => setStep(i)}
              aria-label={`Go to ${s.title}`}
              aria-current={i === step}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {step === 0 && (
          <div className={styles.compactFormLayout}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-name">
                  Name
                </label>
                <input
                  id="animal-name"
                  className={styles.input}
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  Species
                </label>
                <CustomSelect
                  value={form.species || ''}
                  placeholder="Select species"
                  options={SPECIES_OPTIONS}
                  onChange={(val) => update('species', val)}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-breed">
                  Breed
                </label>
                <input
                  id="animal-breed"
                  className={styles.input}
                  type="text"
                  value={form.breed}
                  onChange={(e) => update('breed', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-sex">
                  Sex
                </label>
                <CustomSelect
                  value={form.sex || ''}
                  placeholder="Select sex"
                  options={SEX_OPTIONS}
                  onChange={(val) => update('sex', val)}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-age">
                  Estimated age
                </label>
                <input
                  id="animal-age"
                  className={styles.input}
                  type="text"
                  value={form.age}
                  onChange={(e) => update('age', e.target.value)}
                  placeholder="e.g. 4 years"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-size">
                  Size
                </label>
                <CustomSelect
                  value={form.size || ''}
                  placeholder="Select size"
                  options={SIZE_OPTIONS}
                  onChange={(val) => update('size', val)}
                />
              </div>
            </div>

            <div className={styles.field} style={{ marginBottom: 0 }}>
              <label className={styles.label} htmlFor="animal-markings">
                Color / markings
              </label>
              <input
                id="animal-markings"
                className={styles.input}
                type="text"
                value={form.colorMarkings ?? ''}
                onChange={(e) => update('colorMarkings', e.target.value)}
                placeholder="e.g. Black and tan saddle"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className={styles.compactFormLayout}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-rescue-status">
                  Rescue status
                </label>
                <CustomSelect
                  value={form.rescueStatus || ''}
                  placeholder="Select status"
                  options={RESCUE_OPTIONS}
                  onChange={(val) => update('rescueStatus', val)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-adoption">
                  Adoption status
                </label>
                <CustomSelect
                  value={form.adoptionStatus || ''}
                  placeholder="Select status"
                  options={ADOPTION_OPTIONS}
                  onChange={(val) => update('adoptionStatus', val)}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-health">
                  Health status
                </label>
                <CustomSelect
                  value={form.healthStatus || ''}
                  placeholder="Select status"
                  options={HEALTH_OPTIONS}
                  onChange={(val) => update('healthStatus', val)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-vaccination">
                  Vaccination status
                </label>
                <CustomSelect
                  value={form.vaccinationStatus || ''}
                  placeholder="Select status"
                  options={VACCINATION_OPTIONS}
                  onChange={(val) => update('vaccinationStatus', val)}
                />
              </div>
            </div>

            <div className={styles.field} style={{ marginBottom: 0 }}>
              <label className={styles.label} htmlFor="animal-heart-rate">
                Heart rate
              </label>
              <div className={styles.heartRow}>
                <span className={styles.heartDot} />
                <input
                  id="animal-heart-rate"
                  className={styles.input}
                  type="text"
                  value={form.heartRate ?? ''}
                  onChange={(e) => update('heartRate', e.target.value)}
                  placeholder="e.g. 76 BPM"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.compactFormLayout}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="animal-location">
                Current shelter / location
              </label>
              <input
                id="animal-location"
                className={styles.input}
                type="text"
                value={form.shelterLocation ?? ''}
                onChange={(e) => update('shelterLocation', e.target.value)}
                placeholder="e.g. Main Shelter — Kennel B1"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Date rescued</label>
                <CustomDatePicker
                  value={form.dateRescued ?? ''}
                  onChange={(val) => update('dateRescued', val)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Date added</label>
                <CustomDatePicker
                  value={form.dateAdded ?? ''}
                  onChange={(val) => update('dateAdded', val)}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Last updated</label>
                <CustomDatePicker
                  value={form.lastUpdated ?? ''}
                  onChange={() => {}}
                  disabled={true}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="animal-id">
                  Animal ID
                </label>
                <input id="animal-id" className={styles.input} type="text" value={form.id} disabled readOnly />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.compactFormLayout}>
            <div className={styles.row} style={{ alignItems: 'flex-start' }}>
              <div className={styles.field} style={{ marginBottom: 0 }}>
                <label className={styles.label} htmlFor="animal-reporter">
                  Reported by
                </label>
                <input
                  id="animal-reporter"
                  className={styles.input}
                  type="text"
                  value={form.reporterName ?? ''}
                  onChange={(e) => update('reporterName', e.target.value)}
                  placeholder="Name of reporter"
                />
              </div>
              <div className={styles.field} style={{ marginBottom: 0 }}>
                <label className={styles.label}>Animal photo</label>
                <div className={styles.fileZone} style={{ padding: '0.35rem 0.6rem' }}>
                  {form.photo ? (
                    <img src={form.photo} alt="" className={styles.filePreview} style={{ width: '32px', height: '32px' }} />
                  ) : (
                    <div className={styles.filePreviewEmpty} style={{ width: '32px', height: '32px' }} />
                  )}
                  <div className={styles.fileZoneInner}>
                    <label htmlFor="animal-photo-file" className={modalStyles.btn} style={{ cursor: 'pointer', height: '28px', padding: '0 0.6rem' }}>
                      Choose file
                    </label>
                    <input
                      id="animal-photo-file"
                      className={styles.fileHiddenInput}
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                    />
                    <span className={styles.fileMeta} style={{ fontSize: '0.68rem' }}>{fileName ? 'Selected' : 'JPG/PNG'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.field} style={{ marginBottom: 0, marginTop: '0.5rem' }}>
              <label className={styles.label} htmlFor="animal-bio">
                Bio
              </label>
              <textarea
                id="animal-bio"
                className={styles.textarea}
                style={{ minHeight: '60px' }}
                value={form.bio}
                onChange={(e) => update('bio', e.target.value)}
                placeholder="Short description for adoption listings..."
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={styles.reviewWrapper}>
            <div className={styles.reviewGrid}>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Identity</span>
                <span className={styles.reviewValue} title={form.name}>{form.name || '—'} ({form.species || '—'})</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Breed / Sex</span>
                <span className={styles.reviewValue}>{form.breed || '—'} · {form.sex || '—'}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Age / Size</span>
                <span className={styles.reviewValue}>{form.age || '—'} ({form.size || '—'})</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Markings</span>
                <span className={styles.reviewValue}>{form.colorMarkings || '—'}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Rescue / Adopt</span>
                <span className={styles.reviewValue}>{form.rescueStatus || '—'} → {form.adoptionStatus || '—'}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Health / Vax</span>
                <span className={styles.reviewValue}>{form.healthStatus || '—'} · {form.vaccinationStatus || '—'}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Vitals</span>
                <span className={styles.reviewValue}>{form.heartRate || '—'}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Location</span>
                <span className={styles.reviewValue}>{form.shelterLocation || '—'}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Rescued / Added</span>
                <span className={styles.reviewValue}>{form.dateRescued || '—'} / {form.dateAdded || '—'}</span>
              </div>
              <div className={styles.reviewGroup}>
                <span className={styles.reviewLabel}>Reporter</span>
                <span className={styles.reviewValue}>{form.reporterName || '—'}</span>
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
    </Modal>
  );
}