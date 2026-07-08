import styles from './Navbar.module.css';
import Button from './ui/Button';

type NavbarProps = {
  navScrolled: boolean;
};

export default function Navbar({ navScrolled }: NavbarProps) {
  return (
    <header className={`${styles.nav} ${navScrolled ? styles.navScrolled : styles.navOverlay}`}>
      <a href="#" className={styles.logo}>
        <svg className={styles.logoMark} viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="14" stroke="#0077B6" strokeWidth="2.5" />
          <path d="M6 15h5l2-6 4 12 2-6h5" stroke="#4169E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span>spot.</span>
      </a>

      <nav className={styles.navLinks}>
        <a className={styles.navLink} href="#">Home</a>
        <a className={styles.navLink} href="#plans">Conditions we treat</a>
        <a className={styles.navLink} href="#products">Pharmacy</a>
        <a className={styles.navLink} href="#">About mizo</a>
        <a className={styles.navLink} href="#">Journal</a>
      </nav>

      <div className={styles.navRight}>
        <Button variant="icon" className={styles.iconBtn} aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Button>

        <Button variant="icon" className={styles.iconBtn} aria-label="Cart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16l-1.5 10.5a2 2 0 01-2 1.5H7.5a2 2 0 01-2-1.5L4 6z" stroke="currentColor" strokeWidth="2" />
            <path d="M8 6V5a4 4 0 018 0v1" stroke="currentColor" strokeWidth="2" />
          </svg>
        </Button>

        <a className={styles.signIn} href="#">Log in</a>
        <Button variant="gradient">Join mizo</Button>
      </div>
    </header>
  );
}