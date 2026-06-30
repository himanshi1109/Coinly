import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORY_COLORS } from '../utils/categoryConfig';

const TransactionItem = ({ transaction, userName }) => {
  const isIncome = transaction.type === 'income';
  const config = CATEGORY_COLORS[transaction.category] || CATEGORY_COLORS.Other;

  return (
    <div className="dash-card" style={{ 
      padding: '16px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '16px', 
      marginBottom: '12px',
      transition: 'all 0.2s ease-in-out'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '#32363d';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'var(--surface)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      
      {/* User Name (if provided) */}
      {userName && (
        <div style={{ 
          width: '120px', 
          fontWeight: '800', 
          color: 'var(--cream)', 
          fontSize: 'var(--fs-sm)', 
          borderRight: '1px solid rgba(255,255,255,0.1)', 
          paddingRight: '16px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {userName}
        </div>
      )}

      {/* Icon Circle */}
      <div style={{
        width: '48px', height: '48px', borderRadius: 'var(--r-md)',
        backgroundColor: config.bg, color: config.text,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        fontSize: '24px'
      }}>
        {config.icon}
      </div>

      {/* Details */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontWeight: '800', fontSize: 'var(--fs-md)' }}>{transaction.category}</span>
          <span style={{ 
            fontWeight: '900', 
            fontSize: 'var(--fs-md)',
            color: isIncome ? 'var(--income)' : 'var(--expense)' 
          }}>
            {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
            {transaction.notes || 'No notes'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              padding: '2px 8px', borderRadius: 'var(--r-pill)', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase',
              backgroundColor: isIncome ? 'var(--green-bg)' : 'var(--pink-bg)',
              color: isIncome ? 'var(--green)' : 'var(--pink)'
            }}>
              {transaction.type}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
              {new Date(transaction.createdAt || transaction.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
