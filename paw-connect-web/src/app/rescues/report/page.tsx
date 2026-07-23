'use client';

import { useState, useRef, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Camera, X, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import Select from '@/components/ui/shadcn-select';
import FloatingMessage from '@/components/ui/floating-message';
import { residentFetch } from '@/lib/resident-api';
import styles from './page.module.css';

const BARANGAYS = [
  'Badas', 'Bobon', 'Buso', 'Cabuaya', 'Central (Poblacion)',
  'Culian', 'Dahican', 'Danao', 'Dawan', 'Don Enrique Lopez',
  'Don Martin Marundan', 'Don Salvador Lopez, Sr.', 'Langka',
  'Lawigan', 'Libudon', 'Luban', 'Macambol', 'Mamali', 'Matiao',
  'Mayo', 'Sainz', 'Sanghay', 'Tagbinonga', 'Taguibo', 'Tamisan',
];

const SPECIES_OPTIONS = [
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
  { label: 'Unknown', value: 'unknown' },
];

function isValidPHMobile(phone: string): boolean {
  const cleaned = phone.replace(/\s|-/g, '');
  return /^(09|\+639)\d{9}$/.test(cleaned);
}

function formatPHMobile(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('63')) {
    return '+63 ' + digits.slice(2, 5) + ' ' + digits.slice(5, 8) + ' ' + digits.slice(8, 11);
  }
  if (digits.startsWith('0')) {
    const rest = digits.slice(1);
    return '0' + (rest.length > 0 ? ' ' + rest.slice(0, 3) : '') + (rest.length > 3 ? ' ' + rest.slice(3, 6) : '') + (rest.length > 6 ? ' ' + rest.slice(6, 10) : '');
  }
  return value;
}

function unformatPHMobile(value: string): string {
  return value.replace(/\s/g, '');
}

export default function ReportRescuePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [species, setSpecies] = useState('dog');
  const [condition, setCondition] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationArea, setLocationArea] = useState('');
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState('');

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - photos.length;
    const selected = files.slice(0, remaining);
    setPhotos((prev) => [...prev, ...selected]);
    selected.forEach((f) => {
      const url = URL.createObjectURL(f);
      setPhotoPreviews((prev) => [...prev, url]);
    });
    if (e.target) e.target.value = '';
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function getLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
            { headers: { 'User-Agent': 'PawConnect/1.0' } },
          );
          const data = await res.json();
          const addr = data?.address;
          const candidates = [
            addr?.suburb, addr?.village, addr?.neighbourhood,
            addr?.hamlet, addr?.town_district, addr?.borough,
          ];
          const match = candidates.find((c) => c && BARANGAYS.some((b) => c.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(c.toLowerCase())));
          if (match) {
            const found = BARANGAYS.find((b) => match.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(match.toLowerCase()));
            if (found) setLocationArea(found);
          }
        } catch {
          // reverse geocode failed silently
        }

        setLocating(false);
      },
      () => {
        setError('Unable to retrieve your location. Please enable location access.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function handleContactChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    let formatted: string;
    if (digits.startsWith('63')) {
      formatted = '+63 ' + digits.slice(2);
    } else if (digits.startsWith('0')) {
      formatted = '0' + digits.slice(1);
    } else {
      formatted = digits;
    }
    setContact(formatted);

    const cleaned = unformatPHMobile(formatted);
    if (cleaned.length > 0 && !isValidPHMobile(cleaned)) {
      setContactError('Enter a valid Philippine mobile number (e.g., 0917 123 4567)');
    } else {
      setContactError('');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (photos.length === 0) {
      setError('Please attach at least one photo of the animal');
      return;
    }

    if (latitude === null || longitude === null) {
      setError('Please share your location');
      return;
    }

    const cleanedContact = unformatPHMobile(contact);
    if (contact && !isValidPHMobile(cleanedContact)) {
      setError('Please enter a valid Philippine mobile number (e.g., 0917 123 4567)');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      photos.forEach((f) => formData.append('photos', f));
      const uploadRes = await residentFetch<{ urls: string[] }>('/api/resident/reports/upload', {
        method: 'POST',
        body: formData,
      });

      const photoUrl = uploadRes.urls.join(',');

      await residentFetch('/api/resident/reports', {
        method: 'POST',
        body: JSON.stringify({
          species,
          condition_description: condition,
          photo_url: photoUrl,
          latitude,
          longitude,
          location_area: locationArea || null,
          contact_preference: contact ? cleanedContact : null,
        }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <h2 className={styles.successTitle}>Report Submitted!</h2>
          <p className={styles.successText}>
            Thank you for reporting this animal. Our rescue team will review it and take action.
          </p>
          <Button variant="admin-primary" onClick={() => router.push('/home')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const showContactError = contactError !== '';

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Report an Animal in Need</h1>
      <p className={styles.subtitle}>Provide details about the animal that needs rescue.</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {showContactError && (
          <FloatingMessage message={contactError} onDismiss={() => setContactError('')} />
        )}
        <div className={styles.formColumns}>
          <div className={styles.formCol}>
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Animal Info</h2>

              <div className={styles.field}>
                <span className={styles.label}>Species <span className={styles.badgeRequired}>Required</span></span>
                <Select
                  options={SPECIES_OPTIONS}
                  value={species}
                  onChange={setSpecies}
                />
              </div>

              <FormInput
                id="condition"
                label={<>Condition description <span className={styles.badgeRequired}>Required</span></>}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              />
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Photos <span className={styles.badgeRequired}>Required</span></h2>
              <p className={styles.hint}>Upload up to 5 images of the animal (JPG, PNG, or WebP)</p>

              {photoPreviews.length > 0 && (
                <div className={styles.previewGrid}>
                  {photoPreviews.map((url, i) => (
                    <div key={url} className={styles.previewWrap}>
                      <img src={url} alt={`Photo ${i + 1}`} className={styles.preview} />
                      <button type="button" className={styles.removeBtn} onClick={() => removePhoto(i)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photos.length < 5 && (
                <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
                  <Camera size={16} />
                  {photos.length === 0 ? 'Select photos' : 'Add more'}
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className={styles.fileInput}
                onChange={handleFiles}
              />
            </div>
          </div>

          <div className={styles.formCol}>
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Location <span className={styles.badgeRequired}>Required</span></h2>

              <div className={styles.locRow}>
                <button type="button" className={styles.locBtn} onClick={getLocation} disabled={locating}>
                  <MapPin size={16} />
                  {locating ? 'Locating...' : latitude !== null ? 'Update location' : 'Share my location'}
                </button>
                {locating && <Loader2 size={16} className={styles.spinner} />}
              </div>

              {latitude !== null && longitude !== null && (
                <div className={styles.coords}>
                  <span className={styles.coordValue}>{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
                </div>
              )}

              <div className={styles.field}>
                <span className={styles.label}>Barangay</span>
                <Select
                  options={BARANGAYS}
                  value={locationArea}
                  onChange={setLocationArea}
                  placeholder="Select barangay..."
                />
              </div>
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Contact</h2>

              <div className={styles.field}>
                <span className={styles.label}>Mobile number</span>
                <input
                  type="tel"
                  className={`${styles.phoneInput} ${showContactError ? styles.phoneError : ''}`}
                  value={contact}
                  onChange={(e) => handleContactChange(e.target.value)}
                  placeholder="0917 123 4567"
                />
              </div>
            </div>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <Button variant="admin-primary" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Report'}
        </Button>

        <Link href="/rescues" className={styles.historyLink}>
          <Button variant="admin-secondary" type="button">View my rescue reports</Button>
        </Link>
      </form>
    </div>
  );
}
