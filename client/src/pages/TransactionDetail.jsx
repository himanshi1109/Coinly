import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import PageHeader from '../components/PageHeader';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORY_COLORS } from '../utils/categoryConfig';

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/transactions/${id}`);
        setData(res.data.data);
      } catch (e) {
        toast.error('Failed to load transaction');
        navigate('/transactions');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const executeDelete = async () => {
    try {
      await API.delete(`/transactions/${id}`);
      toast.success('Transaction deleted');
      navigate('/transactions');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <Loader />;
  if (!data) return null;

  const isIncome = data.type === 'income';
  const config = CATEGORY_COLORS[data.category] || CATEGORY_COLORS.Other;

  return (
    <div>
      <PageHeader title="Transaction Details" />

      <div className="card-white" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: 'var(--r-md)',
          backgroundColor: config.bg, color: config.text,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '40px', margin: '0 auto 24px'
        }}>
          {config.icon}
        </div>

        <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: '800', marginBottom: '8px' }}>{data.category}</h2>
        
        <p style={{ 
          fontSize: 'var(--fs-3xl)', 
          fontWeight: '900', 
          color: isIncome ? 'var(--income)' : 'var(--expense)',
          marginBottom: '24px'
        }}>
          {isIncome ? '+' : '-'} {formatCurrency(data.amount)}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <span className="input-label">Date</span>
            <span style={{ fontWeight: '700' }}>{new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <span className="input-label">Notes</span>
            <span style={{ fontWeight: '700' }}>{data.notes || '—'}</span>
          </div>
        </div>

        <button onClick={() => setConfirmOpen(true)} className="btn" style={{ background: 'var(--pink-bg)', color: 'var(--pink)', width: '100%', padding: '16px' }}>
          Delete Transaction
        </button>
      </div>

      <ConfirmModal 
        isOpen={confirmOpen} 
        onClose={() => setConfirmOpen(false)} 
        onConfirm={executeDelete} 
        title="Delete Transaction" 
        message="Are you sure you want to permanently delete this transaction record? This action cannot be undone." 
      />
    </div>
  );
};

export default TransactionDetail;
