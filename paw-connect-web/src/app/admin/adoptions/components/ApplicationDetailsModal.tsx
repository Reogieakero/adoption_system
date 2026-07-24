import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { AdoptionApplication } from '@/types';
import { useAdoptionDetails } from '@/hooks/admin/use-adoptions';
import { formatStatus } from '@/lib/format-status';
import { StatusBadge } from './StatusBadge';
import Button from '@/components/ui/button';
import styles from './ApplicationDetailsModal.module.css';

interface ApplicationDetailsModalProps {
  application: AdoptionApplication | null;
  onClose: () => void;
}

interface DetailRowProps {
  label: string;
  value?: React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value || value === 0 ? value : 'â€”'}</span>
    </div>
  );
}

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section className={styles.detailSection}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.sectionGrid}>{children}</div>
    </section>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

interface DocumentChipProps {
  label: string;
  href?: string;
  onPreview: (url: string, label: string) => void;
}

function DocumentChip({ label, href, onPreview }: DocumentChipProps) {
  if (!href) {
    return (
      <div className={`${styles.documentChip} ${styles.documentChipEmpty}`}>
        <span className={styles.documentChipLabel}>{label}</span>
        <span className={styles.documentChipStatus}>Not provided</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.documentChip}
      onClick={() => onPreview(href, label)}
      title={`Preview ${label}`}
      style={{ background: 'none', textAlign: 'left', font: 'inherit' }}
    >
      <div className={styles.documentThumbWrapper}>
        <img src={href} alt={label} className={styles.documentThumb} />
        <span className={styles.documentThumbOverlay}>
          <ExternalLinkIcon />
          View
        </span>
      </div>
      <span className={styles.documentChipLabel}>{label}</span>
    </button>
  );
}

export function ApplicationDetailsModal({ application, onClose }: ApplicationDetailsModalProps) {
  const [previewData, setPreviewData] = useState<{ url: string; label: string } | null>(null);

  const handleOpenPreview = (url: string, label: string) => {
    setPreviewData({ url, label });
  };

  const handleClosePreview = () => {
    setPreviewData(null);
  };

  useEffect(() => {
    if (!application) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (previewData) {
          handleClosePreview();
        } else {
          onClose();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [application, onClose, previewData]);

  const { details, isLoading, error } = useAdoptionDetails(application?.application_id ?? null);

  if (!application) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
          <header className={styles.panelHeader}>
            <div className={styles.panelHeaderIdentity}>
              <button
                type="button"
                onClick={() =>
                  details &&
                  handleOpenPreview(application.pet_photo_url ?? '', `${application.resident_name} - Profile Photo`)
                }
                title="Preview profile photo"
                className={styles.headerAvatarLink}
                style={{ background: 'none', border: 'none', padding: 0 }}
                disabled={!details}
              >
                {application.pet_photo_url ? (
                  <img
                    src={application.pet_photo_url}
                    alt={application.resident_name}
                    className={styles.headerAvatar}
                  />
                ) : (
                  <div className={styles.headerAvatar} />
                )}
              </button>
              <div>
                <div className={styles.headerName}>{application.resident_name}</div>
                <div className={styles.headerSubline}>
                  Applying for <strong>{application.pet_name}</strong> · {application.application_id}
                </div>
              </div>
            </div>
            <div className={styles.panelHeaderActions}>
              <StatusBadge status={application.status} />
              <Button variant="admin-ghost" square onClick={onClose} aria-label="Close details">
                <X size={14} />
              </Button>
            </div>
          </header>

          <div className={styles.panelBody} style={{ position: 'relative' }}>
            {application.status !== 'pending_review' && (
              <div className={styles.watermark}>
                <span className={`${styles.watermarkText} ${
                  application.status === 'approved' ? styles.watermarkApproved :
                  application.status === 'pet_unavailable' ? styles.watermarkAdopted :
                  application.status === 'rejected' ? styles.watermarkRejected :
                  styles.watermarkPending
                }`}>
                  {formatStatus(application.status)}
                </span>
              </div>
            )}

            {isLoading && (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading detailsâ€¦</p>
            )}

            {error && (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#b91c1c' }}>{error}</p>
            )}

            {details && !isLoading && !error && (
              <>
                <DetailSection title="Application Information">
                  <DetailRow label="Application ID" value={details.application_id} />
                  <DetailRow label="Resident Name" value={details.resident_name} />
                  <DetailRow label="Resident Email" value={details.resident_email} />
                  <DetailRow label="Pet Name" value={details.pet_name} />
                  <DetailRow label="Pet Species" value={details.pet_species} />
                  <DetailRow label="Status" value={formatStatus(details.status)} />
                  <DetailRow label="Submitted At" value={details.submitted_at} />
                  <DetailRow label="Decided At" value={details.decided_at} />
                  <DetailRow label="Handover Confirmed At" value={details.handover_confirmed_at} />
                </DetailSection>

                <DetailSection title="Adoption Details">
                  <DetailRow label="Reason for Adopting" value={details.reason_for_adopting} />
                  <DetailRow label="Living Situation" value={details.living_situation} />
                  <DetailRow label="Has Other Pets" value={details.has_other_pets === null ? '—' : details.has_other_pets ? 'Yes' : 'No'} />
                  <DetailRow label="Household Members Count" value={details.household_members_count} />
                  <DetailRow label="Rejection Reason" value={details.rejection_reason} />
                  <DetailRow label="Additional Notes" value={details.additional_notes} />
                </DetailSection>
              </>
            )}
          </div>
        </div>
      </div>

      {previewData && (
        <div className={styles.previewOverlay} onClick={handleClosePreview}>
          <div className={styles.previewContainer} onClick={(e) => e.stopPropagation()}>
            <header className={styles.previewHeader}>
              <span className={styles.previewTitle}>{previewData.label}</span>
              <Button
                variant="admin-ghost"
                square
                onClick={handleClosePreview}
                aria-label="Close preview"
              >
                <X size={14} />
              </Button>
            </header>
            <img src={previewData.url} alt={previewData.label} className={styles.previewImage} />
          </div>
        </div>
      )}
    </>
  );
}

