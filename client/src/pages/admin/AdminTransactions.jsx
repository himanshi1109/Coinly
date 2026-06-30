import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import TransactionItem from '../../components/TransactionItem';
import Loader from '../../components/Loader';

const AdminTransactions = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const userIdFilter = searchParams.get('userId') || '';

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Fetch transactions with userId query parameter if set, and fetch all users for dropdown
        const [txRes, usersRes] = await Promise.all([
          API.get(`/admin/transactions${userIdFilter ? `?userId=${userIdFilter}` : ''}`),
          API.get('/admin/users')
        ]);
        setData(txRes.data.data);
        setUsers(usersRes.data.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, [userIdFilter]);

  const handleUserChange = (e) => {
    const val = e.target.value;
    if (val) {
      setSearchParams({ userId: val });
    } else {
      setSearchParams({});
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <PageHeader title="All Platform Transactions" />
        
        {/* User Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)' }}>Filter by User:</span>
          <select
            value={userIdFilter}
            onChange={handleUserChange}
            style={{
              background: 'var(--surface)',
              color: 'var(--cream)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '8px 16px',
              borderRadius: '24px',
              outline: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              minWidth: '200px'
            }}
          >
            <option value="">All Users</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        {data.length === 0 ? (
          <div className="empty-state">No transactions found for this selection</div>
        ) : (
          data.map(tx => (
            <TransactionItem key={tx._id} transaction={tx} userName={tx.userId?.name || 'Unknown User'} />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTransactions;
