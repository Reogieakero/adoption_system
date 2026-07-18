import StatsGrid from './components/StatsGrid';
import ELearningCarousel from './components/ELearningCarousel';
import AnalyticsPanel from './components/AnalyticsPanel';
import ReportSideCards from './components/ReportSideCards';
import styles from './page.module.css';

export default function AdminDashboardPage() {
  return (
    <div className={styles.workspace}>
      {/* 1. Metric Cards */}
      <StatsGrid />

      {/* 2. Analytics & Reports */}
      <div className={styles.dataSplit}>
        <AnalyticsPanel />
        <ReportSideCards />
      </div>

      {/* 3. Seamless E-Learning Infinite Loop */}
      <ELearningCarousel />
    </div>
  );
}
