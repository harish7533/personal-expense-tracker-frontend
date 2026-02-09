export default function DashboardSkeleton() {
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title} className="skeleton" />
        <div style={styles.subtitle} className="skeleton" />
      </div>

      {/* Stats cards */}
      <div style={styles.cards}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={styles.card} className="skeleton" />
        ))}
      </div>

      {/* Charts */}
      <div style={styles.charts}>
        <div style={styles.chart} className="skeleton" />
        <div style={styles.chart} className="skeleton" />
      </div>

      {/* Recent Activity */}
      <div style={styles.activity}>
        <div style={styles.sectionTitle} className="skeleton" />
        {[1, 2, 3].map((i) => (
          <div key={i} style={styles.activityRow}>
            <div style={styles.activityIcon} className="skeleton" />
            <div style={styles.activityText}>
              <div style={styles.lineShort} className="skeleton" />
              <div style={styles.lineLong} className="skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px",
  },

  header: {
    marginBottom: 32,
  },
  title: {
    width: 260,
    height: 32,
    borderRadius: 10,
    marginBottom: 12,
  },
  subtitle: {
    width: 180,
    height: 16,
    borderRadius: 6,
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  card: {
    height: 110,
    borderRadius: 16,
  },

  charts: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    marginBottom: 40,
  },
  chart: {
    height: 280,
    borderRadius: 16,
  },

  activity: {
    marginTop: 20,
  },
  sectionTitle: {
    width: 160,
    height: 22,
    borderRadius: 8,
    marginBottom: 20,
  },
  activityRow: {
    display: "flex",
    gap: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: "50%",
  },
  activityText: {
    flex: 1,
  },
  lineShort: {
    height: 14,
    width: "35%",
    borderRadius: 6,
    marginBottom: 8,
  },
  lineLong: {
    height: 14,
    width: "70%",
    borderRadius: 6,
  },
};
