'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAnimal } from '@/hooks/admin/use-animals';
import { updateAnimal, type UpdateAnimalPayload } from '@/services/animals.api';
import AnimalForm, { type AnimalFormData } from '../../components/animal-form';
import NotFound from '../components/NotFound';
import Button from '@/components/ui/button';
import { API_BASE_URL } from '@/lib/config';
import { adminRequest } from '@/lib/api-client';
import { X } from 'lucide-react';
import styles from '../components/FormControls.module.css';

function toPayload(data: AnimalFormData): UpdateAnimalPayload {
  return {
    name: data.name,
    species: data.species as UpdateAnimalPayload['species'],
    breed: data.breed,
    sex: data.sex as UpdateAnimalPayload['sex'],
    age: data.age,
    size: data.size as UpdateAnimalPayload['size'],
    colorMarkings: data.colorMarkings,
    rescueStatus: data.rescueStatus as UpdateAnimalPayload['rescueStatus'],
    adoptionStatus: data.adoptionStatus as UpdateAnimalPayload['adoptionStatus'],
    healthStatus: data.healthStatus as UpdateAnimalPayload['healthStatus'],
    vaccinationStatus: data.vaccinationStatus as UpdateAnimalPayload['vaccinationStatus'],
    heartRate: data.heartRate,
    location: data.location,
    dateRescued: data.dateRescued,
    dateAdded: data.dateAdded,
    bio: data.bio,
    photo: data.photo,
  };
}

export default function EditAnimalPageClient({ id }: { id: string }) {
  const { animal, isLoading, error, refetch } = useAnimal(id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState('');
  const [showViewer, setShowViewer] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState('');
  const [genDescMessage, setGenDescMessage] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  useEffect(() => {
    if (!showViewer) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js';
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [showViewer]);

  if (isLoading) return <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading animal record...</p>;
  if (error) return <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }} role="alert">{error}</p>;
  if (!animal) return <NotFound id={id} backHref="/admin/animals" />;

  const handleSave = async (data: AnimalFormData, photoFile: File | null) => {
    await updateAnimal(animal.id, toPayload(data), photoFile);
    await refetch();
  };

  const handleGenerate3D = async () => {
    setIsGenerating(true);
    setGenMessage('');
    try {
      const data = await adminRequest<{ success: boolean; message?: string }>(
        API_BASE_URL, `/api/admin/animals/${animal.id}/generate-3d`,
        { method: 'POST' }
      );
      if (!data.success) {
        setGenMessage(data.message || 'Generation failed');
      } else {
        setGenMessage('3D model generated successfully!');
        await refetch();
      }
    } catch (e: unknown) {
      setGenMessage(e instanceof Error ? e.message : 'Unable to reach the server.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate3DDescription = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingDesc(true);
    setGenDescMessage('');
    try {
      const data = await adminRequest<{ success: boolean; message?: string }>(
        API_BASE_URL, `/api/admin/animals/${animal.id}/generate-3d-from-description`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: prompt.trim() }),
        }
      );
      if (!data.success) {
        setGenDescMessage(data.message || 'Generation failed');
      } else {
        setGenDescMessage('3D model generated successfully!');
        await refetch();
      }
    } catch (e: unknown) {
      setGenDescMessage(e instanceof Error ? e.message : 'Unable to reach the server.');
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const initialData: AnimalFormData = {
    id: animal.id,
    name: animal.name,
    species: animal.species,
    breed: animal.breed,
    sex: animal.sex,
    age: animal.age,
    size: animal.size,
    colorMarkings: animal.colorMarkings,
    rescueStatus: animal.rescueStatus,
    adoptionStatus: animal.adoptionStatus,
    healthStatus: animal.healthStatus,
    vaccinationStatus: animal.vaccinationStatus,
    heartRate: animal.heartRate,
    location: animal.location,
    dateRescued: animal.dateRescued,
    dateAdded: animal.dateAdded,
    lastUpdated: animal.lastUpdated,
    bio: animal.bio,
    photo: animal.photo,
  };

  return (
    <>
      <AnimalForm initialData={initialData} onSave={handleSave} isNew={false} title={`Edit ${animal.name}`} />

      <div style={{ padding: '0 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: 640 }}>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: '8px 0 0' }}>
          3D Model
        </p>
        {animal.model3dUrl && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
            Status: {animal.model3dStatus} &middot;{' '}
            <button onClick={() => setShowViewer(true)} style={{ color: 'var(--info)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}>
              View model
            </button>
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button variant="admin-primary" onClick={handleGenerate3D} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'From photo'}
          </Button>
          {genMessage && (
            <span style={{ fontSize: 'var(--text-xs)', color: genMessage.includes('success') ? 'var(--success)' : 'var(--error)' }}>
              {genMessage}
            </span>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-muted)', margin: 0 }}>
          Or generate from description
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. brown labrador, floppy ears, sitting, white background"
            style={{
              padding: '8px 10px', fontSize: 'var(--text-sm)', border: '1px solid var(--border)',
              borderRadius: 6, background: 'var(--surface)', color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button variant="admin-primary" onClick={handleGenerate3DDescription} disabled={isGeneratingDesc || !prompt.trim()}>
              {isGeneratingDesc ? 'Generating...' : 'From description'}
            </Button>
            {genDescMessage && (
              <span style={{ fontSize: 'var(--text-xs)', color: genDescMessage.includes('success') ? 'var(--success)' : 'var(--error)' }}>
                {genDescMessage}
              </span>
            )}
          </div>
        </div>
      </div>

      {showViewer && animal.model3dUrl && (
        <div ref={viewerRef}
          onClick={(e) => { if (e.target === viewerRef.current) setShowViewer(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)', padding: '2rem',
          }}>
          <div style={{
            position: 'relative', width: '100%', maxWidth: 600, height: '70vh',
            background: '#111', borderRadius: 12, overflow: 'hidden',
          }}>
            <button onClick={() => setShowViewer(false)}
              style={{
                position: 'absolute', top: 12, right: 12, zIndex: 10,
                background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
              }}>
              <X size={20} />
            </button>
            <model-viewer
              src={animal.model3dUrl}
              alt={animal.name}
              auto-rotate="true"
              camera-controls="true"
              interaction-prompt="auto"
              loading="eager"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
