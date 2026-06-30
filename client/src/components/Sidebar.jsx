import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Plus, PieChart, Wallet, Shield, LogOut, Users, Grid } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>💰</span>
        <div>Coinly</div>
      </Link>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {isAdmin ? (
          <>
            <NavItem to="/admin" icon={Shield} label="Dashboard" />
            <NavItem to="/admin/users" icon={Users} label="Users" />
            <NavItem to="/admin/transactions" icon={ReceiptText} label="Transactions" />
            <NavItem to="/admin/categories" icon={Grid} label="Categories" />
            <NavItem to="/admin/reports" icon={PieChart} label="Reports" />
          </>
        ) : (
          <>
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/transactions" icon={ReceiptText} label="Transactions" />
            <NavItem to="/add" icon={Plus} label="Add" />
            <NavItem to="/budgets" icon={Wallet} label="Budgets" />
            <NavItem to="/reports" icon={PieChart} label="Reports" />
          </>
        )}
      </div>

      <div className="sidebar-user" style={{ marginTop: 'auto' }}>
        <NavLink to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '16px', textDecoration: 'none', color: 'inherit', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className={({isActive}) => isActive ? 'sidebar-user-active' : ''}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--teal)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: '800', fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: 'var(--cream)', margin: 0 }}>{user?.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', margin: 0 }}>View Profile</p>
          </div>
        </NavLink>
        <button onClick={logout} className="nav-item" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', padding: '13px 16px', color: 'var(--coral)' }}>
          <LogOut className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end={to === '/' || to === '/admin'}>
    {({ isActive }) => (
      <>
        <Icon className="nav-icon" color={isActive ? '#111111' : 'white'} />
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

export default Sidebar;
