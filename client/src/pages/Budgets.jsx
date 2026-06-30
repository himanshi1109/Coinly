import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import BudgetCard from '../components/BudgetCard';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const location = useLocation();

  const fetchBudgets = async () => {
    try {
      const res = await API.get('/budgets');
      setBudgets(res.data.data);
    } catch (e) {
      toast.error('Failed to load budgets');
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchBudgets();
      try {
        const catRes = await API.get('/categories');
        setCategories(catRes.data.data);
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (location.state?.openAdd && !loading) {
      setEditId(null);
      setCategory(location.state.category || '');
      setLimit('');
      setIsModalOpen(true);
    }
  }, [location, loading]);

  const openModal = (b = null) => {
    if (b) {
      setEditId(b._id);
      setCategory(b.category);
      setLimit(b.limit);
    } else {
      setEditId(null);
      setCategory('');
      setLimit('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/budgets/${editId}`, { limit: Number(limit) });
        toast.success('Budget updated');
      } else {
        await API.post('/budgets', { category, limit: Number(limit) });
        toast.success('Budget created');
      }
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save budget');
    }
  };

  const triggerDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await API.delete(`/budgets/${deleteId}`);
      toast.success('Budget deleted');
      fetchBudgets();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <PageHeader title="Budgets" subtitle="Keep your spending in check." />
        <button onClick={() => openModal()} className="btn btn-primary" style={{ padding: '10px 20px' }}>
          + Add Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👛</div>
          <h3>No budgets found</h3>
          <p>You haven't set any budgets yet.</p>
        </div>
      ) : (
        <div className="grid-3">
          {budgets.map(b => (
            <BudgetCard 
              key={b._id} 
              budget={b} 
              spent={b.spent} 
              onEdit={openModal} 
              onDelete={triggerDelete} 
            />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? 'Edit Budget' : 'Add Budget'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="input-label">Category</label>
            <select 
              className="input-field" 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              disabled={!!editId}
              required
            >
              <option value="">Select a category</option>
              {categories
                .filter(c => !['salary', 'freelance', 'investments', 'rental', 'bonus', 'gifts'].includes(c.name.toLowerCase()))
                .map(c => <option key={c._id} value={c.name}>{c.name}</option>)
              }
            </select>
          </div>
          <div>
            <label className="input-label">Monthly Limit (₹)</label>
            <input 
              type="number" 
              className="input-field" 
              value={limit} 
              onChange={e => setLimit(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Save Budget
          </button>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={confirmOpen} 
        onClose={() => setConfirmOpen(false)} 
        onConfirm={executeDelete} 
        title="Delete Budget" 
        message="Are you sure you want to permanently delete this budget? This will remove the spending limit category warnings." 
      />
    </div>
  );
};

export default Budgets;
