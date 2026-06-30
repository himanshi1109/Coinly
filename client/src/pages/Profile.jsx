import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { User, Mail, Shield, LogOut, Settings, Bell, Key, Phone, CheckCircle } from 'lucide-react';

const DecorativeBlob = ({ color, opacity = 0.1, top, right, bottom, left }) => (
  <div className="anim-float" style={{
    position: 'absolute', top, right, bottom, left,
    width: '160px', height: '160px', borderRadius: '50%',
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    opacity, filter: 'blur(25px)', zIndex: 0, pointerEvents: 'none'
  }} />
);

const Profile = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editStatus, setEditStatus] = useState(user?.status || 'active');
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditPhone(user?.phone || '');
    setEditStatus(user?.status || 'active');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editName.trim()) return toast.error('Name is required');
    if (!editEmail.trim()) return toast.error('Email is required');
    
    try {
      setSaving(true);
      const res = await API.put('/auth/update', {
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        status: editStatus
      });
      updateUser(res.data.user);
      setIsEditing(false);
      toast.success('Profile details updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="anim-fade-in">
      <PageHeader title="Profile" subtitle="Manage your account settings." />

      <div className="grid-2" style={{ gap: '24px' }}>
        
        {/* Left Column - Main Profile Card */}
        <div className="dash-card anim-slide-up" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }}>
          <DecorativeBlob color="var(--teal)" top="-40px" left="-40px" />
          <DecorativeBlob color="var(--purple)" bottom="-40px" right="-40px" opacity={0.15} />
          
          <div style={{ position: 'relative', zIndex: 1, marginBottom: '16px' }}>
            <div style={{
              width: '90px', height: '90px', borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(73, 139, 129, 0.2), rgba(126, 128, 215, 0.2))',
              color: 'var(--cream)', fontSize: '36px', fontWeight: '900',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 16px 32px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {/* Online Status Dot */}
            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', background: 'var(--bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: (isEditing ? editStatus : user?.status) === 'active' ? 'var(--teal)' : 'var(--muted)', 
                borderRadius: '50%', 
                boxShadow: (isEditing ? editStatus : user?.status) === 'active' ? '0 0 12px var(--teal)' : 'none',
                transition: 'all 0.2s'
              }}></div>
            </div>
          </div>
          
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px', color: 'var(--cream)', position: 'relative', zIndex: 1 }}>{user?.name}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px', fontWeight: '700', position: 'relative', zIndex: 1 }}>{user?.email}</p>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
            <div style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.05)', color: 'var(--cream)', borderRadius: '99px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {user?.role} Account
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
                <button onClick={handleSave} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setIsEditing(false)} className="btn" style={{ padding: '8px 20px', fontSize: '13px', background: 'rgba(255,255,255,0.05)', color: 'var(--cream)' }}>
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '12px', width: '100%' }}>
                <button onClick={startEdit} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  Edit Profile
                </button>
                <button 
                  onClick={logout} 
                  className="btn" 
                  style={{ 
                    background: 'rgba(239, 71, 111, 0.05)', 
                    color: 'var(--red)', 
                    border: '1px solid rgba(239, 71, 111, 0.15)', 
                    padding: '8px 20px', 
                    fontSize: '13px',
                    fontWeight: '700',
                    borderRadius: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 71, 111, 0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(239, 71, 111, 0.05)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Settings and Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Account Details */}
          <div className="dash-card anim-slide-up delay-1" style={{ padding: '24px', borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: 'var(--cream)' }}>Account Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Full Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(234, 175, 54, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mustard)', flexShrink: 0 }}>
                  <User size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', marginBottom: '2px' }}>Full Name</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="input-field"
                      style={{ padding: '6px 12px', fontSize: '13px', width: '100%', background: 'var(--bg)', border: '1px solid rgba(255,255,255,0.05)', margin: 0 }}
                    />
                  ) : (
                    <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--cream)' }}>{user?.name}</p>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(126, 128, 215, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple)', flexShrink: 0 }}>
                  <Mail size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', marginBottom: '2px' }}>Email Address</p>
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="input-field"
                      style={{ padding: '6px 12px', fontSize: '13px', width: '100%', background: 'var(--bg)', border: '1px solid rgba(255,255,255,0.05)', margin: 0 }}
                    />
                  ) : (
                    <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--cream)' }}>{user?.email}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(73, 139, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', flexShrink: 0 }}>
                  <Phone size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', marginBottom: '2px' }}>Phone Number</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      placeholder="Add phone number" 
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      className="input-field"
                      style={{ padding: '6px 12px', fontSize: '13px', width: '100%', background: 'var(--bg)', border: '1px solid rgba(255,255,255,0.05)', margin: 0 }}
                    />
                  ) : (
                    <p style={{ fontSize: '14px', fontWeight: '800', color: user?.phone ? 'var(--cream)' : 'var(--text-muted)' }}>
                      {user?.phone || 'Not Provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Active Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(73, 139, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', flexShrink: 0 }}>
                  <CheckCircle size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', marginBottom: '2px' }}>Active Status</p>
                  {isEditing ? (
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
                      className="input-field"
                      style={{ padding: '6px 12px', fontSize: '13px', width: '100%', background: 'var(--bg)', border: '1px solid rgba(255,255,255,0.05)', margin: 0 }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    <p style={{ fontSize: '14px', fontWeight: '800', color: user?.status === 'inactive' ? 'var(--red)' : 'var(--teal)' }}>
                      {user?.status === 'inactive' ? 'Inactive' : 'Active'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Profile;
