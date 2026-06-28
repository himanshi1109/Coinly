import { useState, useEffect } from 'react';
import API from '../api/axios';
import PageHeader from '../components/PageHeader';
import TransactionItem from '../components/TransactionItem';
import Loader from '../components/Loader';

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

  return (
    <div>
      <PageHeader title="Transactions" subtitle="All your history in one place." />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
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
