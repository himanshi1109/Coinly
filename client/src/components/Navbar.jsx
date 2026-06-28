import { NavLink } from 'react-router-dom';
import { Home, ReceiptText, Plus, PieChart, User } from 'lucide-react';

const Navbar = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'var(--color-card)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0 10px',
      zIndex: 50,
      maxWidth: '430px',
      margin: '0 auto'
    }}>
      <NavIcon to="/" icon={Home} label="Home" />
      <NavIcon to="/transactions" icon={ReceiptText} label="Transact" />
      
      {/* FAB Add Button */}
      <NavLink to="/add" style={{
        position: 'relative',
        top: '-15px',
        width: '56px',
        height: '56px',
        backgroundColor: 'var(--color-pink)',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'var(--shadow-btn)',
        color: 'white'
      }}>
        <Plus size={28} />
      </NavLink>

      <NavIcon to="/reports" icon={PieChart} label="Reports" />
      <NavIcon to="/profile" icon={User} label="Profile" />
    </div>
  );
};

const NavIcon = ({ to, icon: Icon, label }) => (
  <NavLink 
    to={to} 
    style={({ isActive }) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      textDecoration: 'none',
      color: isActive ? 'var(--color-pink)' : 'var(--color-subtext)',
      width: '60px'
    })}
  >
    <Icon size={22} />
    <span style={{ fontSize: '10px', fontWeight: '600' }}>{label}</span>
  </NavLink>
);

export default Navbar;
