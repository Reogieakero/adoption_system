'use client';

import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        
        <div className={styles.brandCol}>
          <div className={styles.brandLogo}>spot.</div>
          <p className={styles.brandDesc}>
            Bringing adopters and pets together with caring support, helpful resources, and a joyful adoption experience.
          </p>
          <div className={styles.socials}>
            {['f', 't', 'in', 'i'].map((icon, i) => (
              <a key={i} href="#" className={styles.socialIcon} aria-label={`Follow us on ${icon}`}>{icon}</a>
            ))}
          </div>
        </div>

        <div>
          <h4 className={styles.navColTitle}>Adopt</h4>
          <ul className={styles.navList}>
            <li><a href="#" className={styles.navLink}>Adopt a Dog</a></li>
            <li><a href="#" className={styles.navLink}>Adopt a Cat</a></li>
            <li><a href="#" className={styles.navLink}>Meet the Pets</a></li>
            <li><a href="#" className={styles.navLink}>Shelter Partners</a></li>
          </ul>
        </div>

        <div>
          <h4 className={styles.navColTitle}>Resources</h4>
          <ul className={styles.navList}>
            <li><a href="#" className={styles.navLink}>Adoption Guide</a></li>
            <li><a href="#" className={styles.navLink}>Pet Care Tips</a></li>
            <li><a href="#" className={styles.navLink}>Success Stories</a></li>
            <li><a href="#" className={styles.navLink}>Community Events</a></li>
          </ul>
        </div>

        <div>
          <h4 className={styles.navColTitle}>Reach Us</h4>
          <address className={styles.addressBlock}>
            <div>
              <span className={styles.addressLabel}>Support</span>
              <span className={styles.addressValue}>help@pawconnect.com</span>
            </div>
            <div>
              <span className={styles.addressLabel}>Phone</span>
              <span className={styles.addressValue}>+1 (800) 555-1234</span>
            </div>
            <div>
              <span className={styles.addressLabel}>Location</span>
              <span className={styles.addressValue}>123 Pet Lane, Happy City</span>
            </div>
          </address>
        </div>

      </div>

      <div className={styles.bottomStrip}>
        <div>
          Â© {new Date().getFullYear()} PawConnect. All Rights Reserved.
        </div>
        <div className={styles.legalLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
