import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, subtitle }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isMobile = window.innerWidth < 768;

  return (
    <div className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        {isMobile && title === 'Dashboard' ? (
          <>
            <h1 className="page-title">Hi, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="page-subtitle">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long' })}
            </p>
          </>
        ) : (
          <>
            <h1 className="page-title" style={{ fontSize: '40px', letterSpacing: '-1px' }}>{title}</h1>
            {subtitle && <p className="page-subtitle" style={{ fontSize: '18px' }}>{subtitle}</p>}
          </>
        )}
      </div>

      {isMobile && (
        <div 
          onClick={() => navigate('/profile')}
          style={{ 
            width: '48px', height: '48px', borderRadius: '16px', background: 'var(--teal)', 
            color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: '900', fontSize: '20px', cursor: 'pointer', boxShadow: '0 8px 16px rgba(73, 139, 129, 0.4)' 
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
