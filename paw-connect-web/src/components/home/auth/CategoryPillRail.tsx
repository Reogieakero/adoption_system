'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import styles from './CategoryPillRail.module.css';

const CATEGORIES = [
  { label: 'All', href: '/animals' },
  { label: 'Dogs', href: '/animals?species=Dog' },
  { label: 'Cats', href: '/animals?species=Cat' },
  { label: 'Small', href: '/animals?size=Small' },
  { label: 'Medium', href: '/animals?size=Medium' },
  { label: 'Large', href: '/animals?size=Large' },
  { label: 'New', href: '/animals?sort=newest' },
  { label: 'Urgent', href: '/animals?status=Urgent' },
];

export default function CategoryPillRail() {
  const router = useRouter();
  const [active, setActive] = useState('All');

  return (
    <section className={styles.rail}>
      {CATEGORIES.map((cat) => (
        <Button
          key={cat.label}
          variant={active === cat.label ? 'admin-primary' : 'admin-secondary'}
          className={styles.pill}
          onClick={() => {
            setActive(cat.label);
            router.push(cat.href);
          }}
        >
          {cat.label}
        </Button>
      ))}
    </section>
  );
}
