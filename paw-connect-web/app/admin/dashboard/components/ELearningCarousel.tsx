import styles from './ELearningCarousel.module.css';

const E_LEARNING_MODULES = [
  { id: 1, tag: 'ANIMAL CARE', title: 'Advanced Canine Dietary Protocols', length: '45 mins', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400' },
  { id: 2, tag: 'LEGAL', title: 'Understanding Local Animal Welfare Laws', length: '60 mins', image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400' },
  { id: 3, tag: 'RESCUE', title: 'Safe Field Capture & Handling Tactics', length: '30 mins', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400' },
  { id: 4, tag: 'ADOPTION', title: 'Applicant Screening Best Practices', length: '40 mins', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400' },
  { id: 5, tag: 'MEDICAL', title: 'Identifying Early Feline Viral Symptoms', length: '50 mins', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400' },
];

export default function ELearningCarousel() {
  return (
    <section className={styles.carouselSection}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>E-Learning Framework</h2>
          <p className={styles.sectionSubtitle}>Active professional development certifications</p>
        </div>
      </div>

      <div className={styles.carouselWrapper}>
        <div className={styles.carouselTrack}>
          {/* Duplicated 3x back-to-back so the looping animation has full track coverage */}
          {[...E_LEARNING_MODULES, ...E_LEARNING_MODULES, ...E_LEARNING_MODULES].map((module, index) => (
            <div key={`${module.id}-${index}`} className={styles.learningCard}>
              <div className={styles.imageWrapper}>
                <img src={module.image} alt={module.title} className={styles.moduleImage} />
                <span className={styles.moduleTag}>{module.tag}</span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={module.title.length > 32 ? styles.moduleTitleLong : styles.moduleTitle}>
                  {module.title}
                </h3>
                <div className={styles.moduleFooter}>
                  <span className={styles.moduleLength}>{module.length}</span>
                  <span className={styles.moduleLink}>Launch Module</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}