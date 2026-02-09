export default function ActivitySkeleton() {
  return (
    <div style={styles.container}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={styles.row}>
          <div style={styles.icon} className="skeleton" />
          <div style={styles.text}>
            <div style={styles.lineShort} className="skeleton" />
            <div style={styles.lineLong} className="skeleton" />
          </div>
        </div>
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
  row: {
    display: "flex",
    gap: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: "50%",
  },
  text: {
    flex: 1,
  },
  lineShort: {
    height: 14,
    width: "40%",
    borderRadius: 6,
    marginBottom: 8,
  },
  lineLong: {
    height: 14,
    width: "70%",
    borderRadius: 6,
  },
};
