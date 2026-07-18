import React, { useEffect, useMemo, useState } from 'react';
import type { AdoptionApplication } from '@/types';
import { useAdoptionDetails } from '@/hooks/admin/use-adoptions';
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

  const { details, isLoading, error } = useAdoptionDetails(application?.id ?? null);

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
                  handleOpenPreview(details.personal.profilePhoto, `${details.personal.fullName} - Profile Photo`)
                }
                title="Preview profile photo"
                className={styles.headerAvatarLink}
                style={{ background: 'none', border: 'none', padding: 0 }}
                disabled={!details}
              >
                <img
                  src={details?.personal.profilePhoto ?? application.animalPhoto}
                  alt={application.applicantName}
                  className={styles.headerAvatar}
                />
              </button>
              <div>
                <div className={styles.headerName}>{application.applicantName}</div>
                <div className={styles.headerSubline}>
                  Applying for <strong>{application.animalName}</strong> Â· {application.id}
                </div>
              </div>
            </div>
            <div className={styles.panelHeaderActions}>
              <StatusBadge status={application.status} />
              <Button variant="admin-ghost" square onClick={onClose} aria-label="Close details">
                âœ•
              </Button>
            </div>
          </header>

          <div className={styles.panelBody}>
            {isLoading && (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading detailsâ€¦</p>
            )}

            {error && (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#b91c1c' }}>{error}</p>
            )}

            {details && !isLoading && !error && (
              <>
                <DetailSection title="Personal Information">
                  <DetailRow label="Applicant ID" value={details.personal.applicantId} />
                  <DetailRow label="Full Name" value={details.personal.fullName} />
                  <DetailRow label="Date of Birth" value={details.personal.dateOfBirth} />
                  <DetailRow label="Age" value={details.personal.age} />
                  <DetailRow label="Sex/Gender" value={details.personal.sex} />
                  <DetailRow label="Civil Status" value={details.personal.civilStatus} />
                  <DetailRow label="Nationality" value={details.personal.nationality} />
                </DetailSection>

                <DetailSection title="Contact Information">
                  <DetailRow label="Email Address" value={details.contact.email} />
                  <DetailRow label="Mobile Number" value={details.contact.mobileNumber} />
                  <DetailRow label="Alternate Contact Number" value={details.contact.alternateContactNumber} />
                </DetailSection>

                <DetailSection title="Address Information">
                  <DetailRow label="Complete Home Address" value={details.address.homeAddress} />
                  <DetailRow label="Barangay" value={details.address.barangay} />
                  <DetailRow label="City/Municipality" value={details.address.cityMunicipality} />
                  <DetailRow label="Province" value={details.address.province} />
                  <DetailRow label="ZIP Code" value={details.address.zipCode} />
                </DetailSection>

                <DetailSection title="Identification">
                  <DetailRow label="Government ID Type" value={details.identification.govIdType} />
                  <DetailRow label="Government ID Number" value={details.identification.govIdNumber} />
                  <div className={styles.sectionGridFull}>
                    <DocumentChip label="Uploaded Government ID" href={details.identification.govIdPhoto} onPreview={handleOpenPreview} />
                  </div>
                </DetailSection>

                <DetailSection title="Employment Information">
                  <DetailRow label="Occupation" value={details.employment.occupation} />
                  <DetailRow label="Employer/Company" value={details.employment.employer} />
                  <DetailRow label="Monthly Income Range" value={details.employment.monthlyIncomeRange} />
                </DetailSection>

                <DetailSection title="Household Information">
                  <DetailRow label="Type of Residence" value={details.household.residenceType} />
                  <DetailRow label="Home Ownership" value={details.household.homeOwnership} />
                  <DetailRow label="Number of Household Members" value={details.household.householdMembers} />
                  <DetailRow label="Number of Children" value={details.household.children} />
                  <DetailRow label="Existing Pets" value={details.household.hasExistingPets ? 'Yes' : 'No'} />
                  <DetailRow label="Number of Existing Pets" value={details.household.existingPetsCount} />
                </DetailSection>

                <DetailSection title="Adoption Questionnaire">
                  <div className={styles.sectionGridFull}>
                    <DetailRow label="Why do you want to adopt this pet?" value={details.questionnaire.whyAdopt} />
                  </div>
                  <DetailRow label="Have you owned a pet before?" value={details.questionnaire.ownedPetBefore} />
                  <DetailRow label="Primary caregiver" value={details.questionnaire.primaryCaregiver} />
                  <DetailRow label="Hours left alone" value={details.questionnaire.hoursAlone} />
                  <DetailRow label="Can provide regular vet care?" value={details.questionnaire.canProvideVetCare} />
                  <DetailRow label="Household in favor of adoption?" value={details.questionnaire.householdInFavor} />
                  <DetailRow label="Secure area for the pet?" value={details.questionnaire.hasSecureArea} />
                </DetailSection>

                <DetailSection title="Uploaded Documents">
                  <div className={styles.sectionGridFull}>
                    <div className={styles.documentGrid}>
                      <DocumentChip label="Government ID" href={details.documents.governmentId} onPreview={handleOpenPreview} />
                      <DocumentChip label="Proof of Address" href={details.documents.proofOfAddress} onPreview={handleOpenPreview} />
                      <DocumentChip label="Proof of Income" href={details.documents.proofOfIncome} onPreview={handleOpenPreview} />
                      {details.documents.otherDocuments.map((doc: string, idx: number) => (
                        <DocumentChip key={idx} label={`Other Document ${idx + 1}`} href={doc} onPreview={handleOpenPreview} />
                      ))}
                    </div>
                  </div>
                </DetailSection>

                <DetailSection title="Application Information">
                  <DetailRow label="Request ID" value={details.applicationInfo.requestId} />
                  <DetailRow label="Date Submitted" value={details.applicationInfo.dateSubmitted} />
                  <DetailRow label="Application Status" value={details.applicationInfo.status} />
                  <DetailRow label="Preferred Contact Method" value={details.applicationInfo.preferredContactMethod} />
                  <DetailRow label="Preferred Adoption Date" value={details.applicationInfo.preferredAdoptionDate} />
                </DetailSection>

                <DetailSection title="Emergency Contact">
                  <DetailRow label="Full Name" value={details.emergencyContact.fullName} />
                  <DetailRow label="Relationship" value={details.emergencyContact.relationship} />
                  <DetailRow label="Contact Number" value={details.emergencyContact.contactNumber} />
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
                âœ•
              </Button>
            </header>
            <img src={previewData.url} alt={previewData.label} className={styles.previewImage} />
          </div>
        </div>
      )}
    </>
  );
}

