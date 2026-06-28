const CircleRing = ({ percent, stroke, size = 100 }) => {
  const r = 40;
  const circumference = Math.PI * r;
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;
  
  return (
    <svg width={size} height={size / 2 + 10} viewBox="0 0 100 60">
      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="12" strokeLinecap="round" />
      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={stroke} strokeWidth="12" strokeLinecap="round" 
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
};

export default CircleRing;
