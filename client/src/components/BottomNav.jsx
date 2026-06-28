import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Plus, PieChart, Wallet } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="bottom-nav">
      <NavItem to="/dashboard" icon={LayoutDashboard} label="Home" />
      <NavItem to="/transactions" icon={ReceiptText} label="Transact" />
      
      <NavLink to="/add" className="bottom-nav-add">
        <Plus size={28} />
      </NavLink>

      <NavItem to="/budgets" icon={Wallet} label="Budgets" />
      <NavItem to="/reports" icon={PieChart} label="Reports" />
    </div>
  );
};

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink to={to} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end={to === '/'}>
    <Icon className="nav-icon" />
    <span>{label}</span>
  </NavLink>
);

export default BottomNav;
