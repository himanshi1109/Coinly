import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Topbar from '../../components/Topbar';
import Loader from '../../components/Loader';
import { CATEGORY_COLORS } from '../../utils/categoryConfig';
import { toast } from 'react-hot-toast';
import { Trash2, Edit2, Plus, X, Check, Search } from 'lucide-react';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get('/categories');
      setCategories(res.data.data);
    } catch (e) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Category name is required');
    
    try {
      setSubmitting(true);
      const res = await API.post('/categories', { name: name.trim() });
      setCategories([...categories, res.data.data]);
      setName('');
      setIsModalOpen(false);
      toast.success('Category added successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return toast.error('Name cannot be empty');
    try {
      const res = await API.put(`/categories/${id}`, { name: editName.trim() });
      setCategories(categories.map(c => c._id === id ? res.data.data : c));
      setEditingId(null);
      setEditName('');
      toast.success('Category updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category');
    }
  };

  const triggerDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await API.delete(`/categories/${deleteId}`);
      setCategories(categories.filter(c => c._id !== deleteId));
      toast.success('Category deleted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Loader />;

  return (
    <div className="anim-fade-in">
      <Topbar title="MANAGE CATEGORIES" />

      {/* Main Categories Card */}
      <div className="dash-card" style={{ marginTop: '24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h3 className="dash-card-title" style={{ color: 'var(--cream)', margin: 0, fontSize: '20px' }}>Category Database</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '6px 0 0 0', fontWeight: '500' }}>Manage and edit all platform-wide transaction categories</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Search Bar */}
            <div className="search-bar" style={{ 
              width: '220px', 
              padding: '10px 16px', 
              background: 'var(--bg)', 
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <Search size={16} color="var(--muted)" />
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ fontSize: '13px' }}
              />
            </div>

            {/* Add Category Button Triggering Modal */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary" 
              style={{ 
                padding: '10px 20px', 
                fontSize: '13px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <Plus size={16} /> Add Category
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                <th style={{ padding: '16px', color: 'var(--muted)', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Icon</th>
                <th style={{ padding: '16px', color: 'var(--muted)', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category Name</th>
                <th style={{ padding: '16px', color: 'var(--muted)', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Created At</th>
                <th style={{ padding: '16px', color: 'var(--muted)', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>
                    No categories found in the database.
                  </td>
                </tr>
              ) : (
                filtered.map(c => {
                  const config = CATEGORY_COLORS[c.name] || CATEGORY_COLORS.Other;
                  const isEditing = editingId === c._id;
                  return (
                    <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} className="table-row-hover">
                      <td style={{ padding: '16px' }}>
                        <div style={{
                          width: '42px', height: '42px', borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex', justifyContent: 'center', alignItems: 'center',
                          fontSize: '20px',
                          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.02)'
                        }}>
                          {config.icon}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="input-field"
                            style={{ padding: '8px 12px', width: '200px', margin: 0 }}
                            autoFocus
                          />
                        ) : (
                          <span style={{ fontWeight: '700', color: 'var(--cream)', fontSize: '15px' }}>{c.name}</span>
                        )}
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        {isEditing ? (
                          <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => handleUpdate(c._id)}
                              style={{ 
                                background: 'rgba(73, 139, 129, 0.05)', 
                                border: '1px solid rgba(73, 139, 129, 0.15)', 
                                width: '36px', height: '36px', 
                                borderRadius: '10px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                cursor: 'pointer', color: 'var(--teal)',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={e => { e.currentTarget.style.background = 'rgba(73, 139, 129, 0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                              onMouseOut={e => { e.currentTarget.style.background = 'rgba(73, 139, 129, 0.05)'; e.currentTarget.style.transform = 'none'; }}
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => { setEditingId(null); setEditName(''); }}
                              style={{ 
                                background: 'rgba(239, 71, 111, 0.05)', 
                                border: '1px solid rgba(239, 71, 111, 0.15)', 
                                width: '36px', height: '36px', 
                                borderRadius: '10px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                cursor: 'pointer', color: 'var(--red)',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 71, 111, 0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                              onMouseOut={e => { e.currentTarget.style.background = 'rgba(239, 71, 111, 0.05)'; e.currentTarget.style.transform = 'none'; }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => { setEditingId(c._id); setEditName(c.name); }}
                              style={{ 
                                background: 'rgba(255,255,255,0.02)', 
                                border: '1px solid rgba(255,255,255,0.06)', 
                                width: '36px', height: '36px', 
                                borderRadius: '10px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                cursor: 'pointer', color: 'var(--cream)',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'none'; }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => triggerDelete(c._id)}
                              style={{ 
                                background: 'rgba(239, 71, 111, 0.05)', 
                                border: '1px solid rgba(239, 71, 111, 0.15)', 
                                width: '36px', height: '36px', 
                                borderRadius: '10px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                cursor: 'pointer', color: 'var(--red)',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 71, 111, 0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                              onMouseOut={e => { e.currentTarget.style.background = 'rgba(239, 71, 111, 0.05)'; e.currentTarget.style.transform = 'none'; }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal Dialog */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setName(''); }} title="Add Category">
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="input-label">Category Name</label>
            <input 
              type="text" 
              placeholder="Enter category name..." 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={confirmOpen} 
        onClose={() => setConfirmOpen(false)} 
        onConfirm={executeDelete} 
        title="Delete Category" 
        message="Are you sure you want to delete this category? This action might affect existing transaction history and budgets." 
      />
    </div>
  );
};

export default AdminCategories;
