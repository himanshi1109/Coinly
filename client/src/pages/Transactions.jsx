import { useState, useEffect } from 'react';
import API from '../api/axios';
import PageHeader from '../components/PageHeader';
import TransactionItem from '../components/TransactionItem';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/formatCurrency';

const Transactions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await API.get('/transactions');
        setData(res.data.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="empty-state"><h3>Error</h3><p>{error}</p></div>;

  const filtered = data.filter(tx => filter === 'All' || tx.type === filter.toLowerCase());

  const totalIncome = data
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = data
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div>
      <PageHeader title="Transactions" subtitle="All your history in one place." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="dash-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(73, 139, 129, 0.05)', border: '1.5px solid rgba(73, 139, 129, 0.1)', borderRadius: '24px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Income</span>
            <p style={{ fontSize: '24px', fontWeight: '900', color: 'var(--teal)', margin: '4px 0 0 0' }}>{formatCurrency(totalIncome)}</p>
          </div>
          <div style={{ fontSize: '28px' }}>📈</div>
        </div>

        <div className="dash-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(239, 71, 111, 0.05)', border: '1.5px solid rgba(239, 71, 111, 0.1)', borderRadius: '24px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Expense</span>
            <p style={{ fontSize: '24px', fontWeight: '900', color: 'var(--red)', margin: '4px 0 0 0' }}>{formatCurrency(totalExpense)}</p>
          </div>
          <div style={{ fontSize: '28px' }}>💸</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '6px 4px 12px 4px', margin: '-6px -4px 16px -4px' }}>
        {['All', 'Income', 'Expense'].map(f => (
          <div 
            key={f}
            className={`pill ${filter === f ? 'pill-active' : 'pill-idle'}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </div>
        ))}
      </div>

      <div>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💸</div>
            <h3>No transactions found</h3>
            <p>You haven't made any transactions yet.</p>
          </div>
        ) : (
          filtered.map(tx => (
            <TransactionItem key={tx._id} transaction={tx} />
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
