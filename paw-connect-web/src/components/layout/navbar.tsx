import Link from 'next/link';
import styles from './navbar.module.css';
import Button from '@/components/ui/button';

type NavbarProps = {
  navScrolled: boolean;
};

export default function Navbar({ navScrolled }: NavbarProps) {
  return (
    <header className={`${styles.nav} ${navScrolled ? styles.navScrolled : styles.navOverlay}`}>
      <Link href="/" className={styles.logo}>
        <svg className={styles.logoMark} viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="14" stroke="#0077B6" strokeWidth="2.5" />
          <path d="M6 15h5l2-6 4 12 2-6h5" stroke="#4169E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span>spot.</span>
      </Link>

      <nav className={styles.navLinks}>
        <Link className={styles.navLink} href="/">Home</Link>
        <Link className={styles.navLink} href="#plans">Conditions we treat</Link>
        <Link className={styles.navLink} href="#products">Pharmacy</Link>
        <Link className={styles.navLink} href="#">About mizo</Link>
        <Link className={styles.navLink} href="#">Journal</Link>
      </nav>

      <div className={styles.navRight}>
        <Link href="/login">
          <Button variant="admin-secondary">Log in</Button>
        </Link>
        <Link href="/register">
          <Button variant="admin-primary">Create account</Button>
        </Link>
      </div>
    </header>
  );
}
