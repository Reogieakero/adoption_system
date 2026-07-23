'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import Select from '@/components/ui/shadcn-select';
import { publicFetch, residentFetch } from '@/lib/resident-api';
import type { Pet, AdoptionApplication } from '@/types';
import styles from './page.module.css';

export default function ApplyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [animal, setAnimal] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [reason, setReason] = useState('');
  const [livingSituation, setLivingSituation] = useState('');
  const [hasOtherPets, setHasOtherPets] = useState(false);
  const [householdCount, setHouseholdCount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    publicFetch<{ pet: Pet }>(`/api/public/pets/${id}`)
      .then((data) => setAnimal(data.pet))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await residentFetch('/api/resident/adoptions', {
        method: 'POST',
        body: JSON.stringify({
          pet_id: Number(id),
          reason_for_adopting: reason,
          living_situation: livingSituation || null,
          has_other_pets: hasOtherPets,
          household_members_count: householdCount ? Number(householdCount) : null,
          additional_notes: notes || null,
        }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className={styles.page}><p className={styles.muted}>Loading...</p></div>;
  if (!animal) return <div className={styles.page}><p className={styles.muted}>Pet not found.</p></div>;

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <h2 className={styles.successTitle}>Application Submitted!</h2>
          <p className={styles.successText}>
            Your adoption application for <strong>{animal.name}</strong> has been received.
            The shelter will review it and get back to you.
          </p>
          <Button variant="admin-primary" onClick={() => router.push('/applications')}>
            View My Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => router.back()}>
        <ChevronLeft size={16} /> Back
      </button>

      <h1 className={styles.title}>Apply to adopt {animal.name}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <FormInput
          id="reason"
          label={<>Why do you want to adopt this pet? <span className={styles.badgeRequired}>Required</span></>}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <FormInput
          id="livingSituation"
          label={<>Describe your living situation <span className={styles.badgeOptional}>(Optional)</span></>}
          value={livingSituation}
          onChange={(e) => setLivingSituation(e.target.value)}
        />

        <div className={styles.checkRow}>
          <input
            id="hasOtherPets"
            type="checkbox"
            checked={hasOtherPets}
            onChange={(e) => setHasOtherPets(e.target.checked)}
            className={styles.checkbox}
          />
          <label htmlFor="hasOtherPets" className={styles.checkLabel}>
            I currently have other pets <span className={styles.badgeOptional}>(Optional)</span>
          </label>
        </div>

        <div className={styles.fieldGroup}>
          <span className={styles.selectLabel}>
            Number of people in household <span className={styles.badgeOptional}>(Optional)</span>
          </span>
          <Select
            options={[
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
              { label: '4', value: '4' },
              { label: '5 or more', value: '5' },
            ]}
            value={householdCount}
            onChange={setHouseholdCount}
            placeholder="Select..."
          />
        </div>

        <FormInput
          id="notes"
          label={<>Additional notes <span className={styles.badgeOptional}>(Optional)</span></>}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {error && <p className={styles.error}>{error}</p>}

        <Button variant="admin-primary" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </div>
  );
}
