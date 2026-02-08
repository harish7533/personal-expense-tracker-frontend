export default function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      {/* Header */}
      <div className="sk-title" />

      {/* Stats */}
      <div className="sk-stats">
        <div className="sk-stat" />
        <div className="sk-stat" />
        <div className="sk-stat" />
      </div>

      {/* Chart */}
      <div className="sk-chart" />

      {/* Recent bills */}
      <div className="sk-list">
        <div className="sk-row" />
        <div className="sk-row" />
        <div className="sk-row" />
      </div>
    </div>
  );
}
