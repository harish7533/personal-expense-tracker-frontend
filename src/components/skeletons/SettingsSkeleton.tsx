export default function SettingsSkeleton() {
  return (
    <div style={styles.container}>
      <div style={styles.title} className="skeleton" />

      {[1, 2, 3].map((i) => (
        <div key={i} style={styles.card} className="skeleton" />
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "24px",
  },
  title: {
    height: 28,
    width: "220px",
    marginBottom: 24,
    borderRadius: 8,
  },
  card: {
    height: 64,
    borderRadius: 12,
    marginBottom: 16,
  },
};
