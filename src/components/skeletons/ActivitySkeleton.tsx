export default function ActivitySkeleton() {
  return (
    <div className="activity-skeleton">
      <div className="sk-title" />

      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="sk-activity-card">
          <div className="sk-line short" />
          <div className="sk-line long" />
        </div>
      ))}
    </div>
  );
}
