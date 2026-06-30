import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import Loader from '../components/Loader';
import { CATEGORY_COLORS } from '../utils/categoryConfig';

const AddTransaction = () => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingConfig, setFetchingConfig] = useState(true);
  const [customCategory, setCustomCategory] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [catRes, budgetRes] = await Promise.all([
          API.get('/categories'),
          API.get('/budgets')
        ]);
        setCategories(catRes.data.data);
        setBudgets(budgetRes.data.data);
      } catch (e) {
        toast.error('Failed to load transaction settings');
      } finally {
        setFetchingConfig(false);
      }
    })();
  }, []);

  const handleCategorySelect = (catName) => {
    if (type === 'expense' && catName !== 'Other') {
      const hasBudget = budgets.some(b => b.category.toLowerCase() === catName.toLowerCase());
      if (!hasBudget) {
        toast.error(`Please set up a budget for "${catName}" first! Redirecting...`);
        setTimeout(() => {
          navigate('/budgets', { state: { openAdd: true, category: catName } });
        }, 1200);
        return;
      }
    }
    setCategory(catName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return toast.error('Enter a valid amount');
    
    const finalCategory = category === 'Other' && customCategory.trim() ? customCategory.trim() : category;
    if (!finalCategory) return toast.error('Select a category');
    
    try {
      setLoading(true);
      await API.post('/transactions', { type, amount: Number(amount), category: finalCategory, date, notes });
      toast.success('Transaction saved!');
      navigate('/transactions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingConfig) return <Loader />;

  return (
    <div>
      <PageHeader title="Add Transaction" />

      <div className="dash-card" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Type Toggle */}
        <div style={{ display: 'flex', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: 'var(--r-pill)' }}>
          <button 
            type="button"
            className="btn"
            style={{ flex: 1, backgroundColor: type === 'income' ? 'var(--teal)' : 'transparent', color: type === 'income' ? 'var(--bg)' : 'var(--muted)', transition: 'all 0.3s' }}
            onClick={() => setType('income')}
          >
            Income
          </button>
          <button 
            type="button"
            className="btn"
            style={{ flex: 1, backgroundColor: type === 'expense' ? 'var(--red)' : 'transparent', color: type === 'expense' ? 'var(--bg)' : 'var(--muted)', transition: 'all 0.3s' }}
            onClick={() => setType('expense')}
          >
            Expense
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Amount */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 'var(--fs-2xl)', fontWeight: '900', color: 'var(--text-muted)' }}>₹</span>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              style={{
                fontSize: 'var(--fs-3xl)',
                fontWeight: '900',
                border: 'none',
                background: 'transparent',
                textAlign: 'center',
                width: '200px',
                outline: 'none',
                color: type === 'income' ? 'var(--teal)' : 'var(--red)',
                borderBottom: '2px solid rgba(255,255,255,0.1)',
                paddingBottom: '8px'
              }}
            />
          </div>

          {/* Categories */}
          <div>
            <label className="input-label">Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {categories.map(c => {
                const isSelected = category === c.name;
                const config = CATEGORY_COLORS[c.name] || CATEGORY_COLORS.Other;
                return (
                  <div 
                    key={c._id}
                    onClick={() => handleCategorySelect(c.name)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--r-pill)',
                      fontSize: 'var(--fs-base)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: isSelected ? config.text : 'var(--surface)',
                      color: isSelected ? 'var(--bg)' : 'var(--text)',
                      border: `1.5px solid ${isSelected ? config.text : 'var(--border)'}`,
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{config.icon}</span>
                    {c.name}
                  </div>
                );
              })}
            </div>
            {category === 'Other' && (
              <div style={{ marginTop: '16px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Type custom category name..." 
                  value={customCategory} 
                  onChange={(e) => setCustomCategory(e.target.value)} 
                  autoFocus
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label className="input-label">Notes</label>
              <input type="text" className="input-field" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Lunch, rent, etc." />
            </div>
            <div style={{ width: '180px' }}>
              <label className="input-label">Date</label>
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: 'var(--fs-md)' }} disabled={loading}>
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
