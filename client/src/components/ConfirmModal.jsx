import Modal from './Modal';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', type = 'danger' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6', fontWeight: '500' }}>
          {message || 'Are you sure you want to perform this action?'}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button 
            type="button"
            onClick={onClose} 
            className="btn" 
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              color: 'var(--cream)', 
              border: '1.5px solid rgba(255,255,255,0.05)',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="btn" 
            style={{ 
              background: type === 'danger' ? 'var(--red)' : 'var(--teal)', 
              color: 'var(--bg)', 
              border: 'none',
              padding: '10px 24px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
