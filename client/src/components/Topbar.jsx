import { Search, Bell, Settings } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Topbar = ({ title }) => {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="topbar">
      <h1 className="dash-greeting">
        {title || `HELLO, ${user?.name?.toUpperCase()}! ✿`}
      </h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div className="search-bar">
          <Search size={18} color="white" />
          <input type="text" placeholder="Search..." />
        </div>
        
        <button style={{ background: '#1E1E1E', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 0 1px #2E2E2E' }}>
          <Bell size={20} color="white" />
        </button>
        
        <button style={{ background: '#1E1E1E', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 0 1px #2E2E2E' }}>
          <Settings size={20} color="white" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
