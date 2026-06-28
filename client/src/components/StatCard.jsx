const StatCard = ({ label, value, color, icon }) => {
  // color should be pink|green|yellow|purple|orange|blue
  return (
    <div className={`card-${color}`}>
      <p className="card-stat-label">{label}</p>
      <p className="card-stat-value">{value}</p>
      {icon && (
        <span style={{
          fontSize: '48px', 
          opacity: 0.25, 
          position: 'absolute', 
          right: '20px', 
          bottom: '16px',
          lineHeight: 1
        }}>
          {icon}
        </span>
      )}
    </div>
  );
};

export default StatCard;
