export function Legend() {
  return (
    <div className="graph-footer">
      <div className="legend">
        <div className="legend-item">
          <div className="legend-node staged"></div>
          <span>Staged</span>
        </div>
        <div className="legend-item">
          <div className="legend-node committed"></div>
          <span>Committed</span>
        </div>
        <div className="legend-item">
          <div className="legend-label">main</div>
          <span>Branch</span>
        </div>
      </div>
    </div>
  )
}
