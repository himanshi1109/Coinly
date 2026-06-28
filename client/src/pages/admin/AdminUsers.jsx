import { useState, useEffect } from 'react';
import API from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data.data);
    } catch (e) {
      toast.error('Failed to load users');
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await API.put(`/admin/users/${userId}`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (e) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete user ${name} and all their data? This action cannot be undone.`)) {
      return;
    }
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (e) {
      toast.error('Failed to delete user');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <PageHeader title="All Users" />

      <div className="card-white" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '20px', fontWeight: '800' }}>Name</th>
              <th style={{ padding: '20px', fontWeight: '800' }}>Email</th>
              <th style={{ padding: '20px', fontWeight: '800' }}>Role</th>
              <th style={{ padding: '20px', fontWeight: '800' }}>Joined</th>
              <th style={{ padding: '20px', fontWeight: '800', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '20px', fontWeight: '700' }}>{u.name}</td>
                <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{u.email}</td>
                <td style={{ padding: '20px' }}>
                  <span style={{ 
                    background: u.role === 'admin' ? 'var(--purple)' : 'rgba(255,255,255,0.1)', 
                    color: 'var(--cream)', 
                    fontSize: '10px', 
                    fontWeight: '800', 
                    padding: '6px 12px', 
                    borderRadius: '99px', 
                    textTransform: 'uppercase'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '20px', color: 'var(--text-muted)' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '20px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => handleRoleToggle(u._id, u.role)}
                    style={{ background: 'var(--surface)', color: 'var(--cream)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                    {u.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(u._id, u.name)}
                    style={{ background: 'rgba(239, 71, 111, 0.1)', color: 'var(--red)', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
