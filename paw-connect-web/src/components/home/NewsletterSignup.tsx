'use client';

import { useState } from 'react';
import styles from './NewsletterSignup.module.css';
import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Subscription submitted — wire up API endpoint separately.');
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.card}>
          <h2 className={styles.title}>Get updates on new arrivals</h2>
          <p className={styles.subtitle}>
            Be the first to know when new pets become available for adoption.
          </p>

          <form className={styles.form} onSubmit={handleSubscribe}>
            <FormInput
              id="subscribe-email"
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button variant="admin-primary" type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
