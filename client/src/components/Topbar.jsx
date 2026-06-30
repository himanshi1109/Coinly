import { Search, Bell, Settings } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';

const Topbar = ({ title, searchValue, onSearchChange, showSearch = true }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data.data);
    } catch (e) {}
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleBellClick = async () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      try {
        await API.put('/notifications/read');
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      } catch (e) {}
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="topbar" style={{ position: 'relative' }}>
      <h1 className="dash-greeting">
        {title || `HELLO, ${user?.name?.toUpperCase()}! ✿`}
      </h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {showSearch && (
          <div className="search-bar">
            <Search size={18} color="white" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchValue || ''}
              onChange={onSearchChange}
            />
          </div>
        )}
        
        {/* Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={handleBellClick}
            style={{ 
              background: '#1E1E1E', 
              border: 'none', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              boxShadow: '0 0 0 1px #2E2E2E',
              position: 'relative'
            }}
          >
            <Bell size={20} color="white" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--red)',
                color: 'white',
                fontSize: '9px',
                fontWeight: '900',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px rgba(239, 71, 111, 0.4)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '320px',
              background: 'var(--surface)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '20px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              zIndex: 1000,
              padding: '16px 0',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <div style={{ padding: '0 16px 12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '800', color: 'var(--cream)', fontSize: '14px' }}>Notifications</span>
                {unreadCount > 0 && <span style={{ fontSize: '11px', color: 'var(--teal)', fontWeight: '700' }}>{unreadCount} new</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No notifications yet ✿
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n._id} 
                      style={{ 
                        padding: '12px 16px', 
                        borderBottom: '1px solid rgba(255,255,255,0.02)',
                        background: n.isRead ? 'transparent' : 'rgba(255,255,255,0.02)',
                        transition: 'background 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                      onMouseOut={e=>e.currentTarget.style.background=n.isRead ? 'transparent' : 'rgba(255,255,255,0.02)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ 
                          fontWeight: '800', 
                          fontSize: '12px', 
                          color: n.type === 'danger' ? 'var(--red)' : n.type === 'warning' ? 'var(--mustard)' : 'var(--cream)' 
                        }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4', fontWeight: '500' }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => navigate('/profile')}
          style={{ background: '#1E1E1E', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 0 1px #2E2E2E' }}
        >
          <Settings size={20} color="white" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
