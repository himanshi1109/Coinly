import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORY_COLORS } from '../utils/categoryConfig';
import { Edit2, Trash2, TrendingUp } from 'lucide-react';

const BudgetCard = ({ budget, spent, onDelete, onEdit }) => {
  const percent = Math.min((spent / budget.limit) * 100, 100);
  
  const remaining = budget.limit - spent;
  const config = CATEGORY_COLORS[budget.category] || CATEGORY_COLORS.Other;
  
  // Progress bar changes color dynamically
  const barColor = percent >= 100 ? 'var(--red)' : percent >= 80 ? 'var(--orange)' : config.text;

  return (
    <div className="dash-card anim-slide-up" style={{ 
      marginBottom: '16px', 
      background: 'var(--surface)', 
      padding: '20px',
      borderRadius: '24px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.03)',
      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease'
    }} onMouseOver={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = `0 12px 24px rgba(0,0,0,0.5)`;
    }} onMouseOut={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
    }}>
      
      {/* Soft Glow Background based on category color */}
      <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: `radial-gradient(circle, ${config.text} 0%, transparent 70%)`, opacity: 0.15, filter: 'blur(20px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            fontSize: '24px', 
            background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))`,
            width: '48px', 
            height: '48px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05)'
          }}>
            {config.icon}
          </div>
          <div>
            <h3 style={{ fontWeight: '800', fontSize: '18px', color: 'var(--cream)', margin: 0, letterSpacing: '-0.2px' }}>{budget.category}</h3>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600' }}>Monthly</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          {onEdit && <button onClick={() => onEdit(budget)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--muted)', padding: '8px', borderRadius: '12px', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}><Edit2 size={14} /></button>}
          {onDelete && <button onClick={() => onDelete(budget._id)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--muted)', padding: '8px', borderRadius: '12px', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(231,109,130,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}><Trash2 size={14} /></button>}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'flex-end' }}>
          <div>
            <span style={{ fontWeight: '800', fontSize: '20px', color: 'var(--cream)', display: 'block', lineHeight: 1 }}>
              {formatCurrency(spent)}
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>of {formatCurrency(budget.limit)}</span>
          </div>
          <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontWeight: '800', fontSize: '13px', color: barColor }}>{Math.round(percent)}%</span>
          </div>
        </div>

        {/* Custom Progress Bar Implementation */}
        <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '99px', marginBottom: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)', padding: '2px' }}>
          <div style={{ width: `${percent}%`, height: '100%', backgroundColor: barColor, borderRadius: '99px', transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: `0 0 8px ${barColor}` }} />
        </div>

        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', 
          background: remaining < 0 ? 'rgba(231,109,130,0.1)' : 'rgba(255,255,255,0.02)', 
          border: `1px solid ${remaining < 0 ? 'rgba(231,109,130,0.2)' : 'rgba(255,255,255,0.05)'}`, 
          borderRadius: '16px' 
        }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: remaining < 0 ? 'rgba(231,109,130,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: remaining < 0 ? 'var(--red)' : 'var(--cream)' }}>
            <TrendingUp size={12} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: remaining < 0 ? 'var(--red)' : 'var(--cream)' }}>
            {remaining < 0 ? `${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} left`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
