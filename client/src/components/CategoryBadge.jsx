import { CATEGORY_COLORS } from '../utils/categoryConfig';

const CategoryBadge = ({ name }) => {
  const config = CATEGORY_COLORS[name] || CATEGORY_COLORS.Other;
  
  return (
    <span style={{
      backgroundColor: config.bg,
      color: config.text,
      padding: '5px 12px',
      borderRadius: 'var(--r-pill)',
      fontSize: 'var(--fs-sm)',
      fontWeight: '700',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    }}>
      <span style={{ fontSize: '14px' }}>{config.icon}</span>
      {name}
    </span>
  );
};

export default CategoryBadge;
