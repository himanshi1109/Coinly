import { useState, useEffect } from 'react';
import API from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import TransactionItem from '../../components/TransactionItem';
import Loader from '../../components/Loader';

const AdminTransactions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/admin/transactions');
        setData(res.data.data);
      } catch (e) {} finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <PageHeader title="All Platform Transactions" />

      <div>
        {data.length === 0 ? (
          <div className="empty-state">No transactions</div>
        ) : (
          data.map(tx => (
            <div key={tx._id} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '120px', fontWeight: '800', color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                {tx.userId?.name || 'Unknown User'}
              </div>
              <div style={{ flex: 1 }}>
                <TransactionItem transaction={tx} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTransactions;
