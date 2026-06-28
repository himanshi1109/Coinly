import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { User, Mail, Shield, LogOut, Settings, Bell, Key } from 'lucide-react';

const DecorativeBlob = ({ color, opacity = 0.1, top, right, bottom, left }) => (
  <div className="anim-float" style={{
    position: 'absolute', top, right, bottom, left,
    width: '160px', height: '160px', borderRadius: '50%',
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    opacity, filter: 'blur(25px)', zIndex: 0, pointerEvents: 'none'
  }} />
);

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="anim-fade-in">
      <PageHeader title="Profile" subtitle="Manage your account settings." />

      <div className="grid-2" style={{ gap: '32px' }}>
        
        {/* Left Column - Main Profile Card */}
        <div className="dash-card anim-slide-up" style={{ padding: '40px', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }}>
          <DecorativeBlob color="var(--teal)" top="-40px" left="-40px" />
          <DecorativeBlob color="var(--purple)" bottom="-40px" right="-40px" opacity={0.15} />
          
          <div style={{ position: 'relative', zIndex: 1, marginBottom: '24px' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '32px',
              background: 'linear-gradient(135deg, rgba(73, 139, 129, 0.2), rgba(126, 128, 215, 0.2))',
              color: 'var(--cream)', fontSize: '48px', fontWeight: '900',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 16px 32px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {/* Online Status Dot */}
            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '24px', height: '24px', background: 'var(--bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '16px', height: '16px', background: 'var(--teal)', borderRadius: '50%', boxShadow: '0 0 12px var(--teal)' }}></div>
            </div>
          </div>
          
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'var(--cream)', position: 'relative', zIndex: 1 }}>{user?.name}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '32px', fontWeight: '700', position: 'relative', zIndex: 1 }}>{user?.email}</p>
          
          <div style={{ position: 'relative', zIndex: 1, padding: '10px 24px', background: 'rgba(255,255,255,0.05)', color: 'var(--cream)', borderRadius: '99px', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {user?.role} Account
          </div>
        </div>

        {/* Right Column - Settings and Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Account Details */}
          <div className="dash-card anim-slide-up delay-1" style={{ padding: '32px', borderRadius: '32px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: 'var(--cream)' }}>Account Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(234, 175, 54, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mustard)' }}>
                  <User size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', marginBottom: '4px' }}>Full Name</p>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--cream)' }}>{user?.name}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(126, 128, 215, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', marginBottom: '4px' }}>Email Address</p>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--cream)' }}>{user?.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(73, 139, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
                  <Shield size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', marginBottom: '4px' }}>Account Security</p>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--teal)' }}>Excellent</p>
                </div>
                <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--cream)', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Manage</button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="dash-card anim-slide-up delay-2" style={{ padding: '32px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: 'var(--cream)' }}>Quick Actions</h3>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <button style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', color: 'var(--cream)', fontWeight: '700', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                <Settings size={20} color="var(--muted)" />
                Preferences
              </button>
              <button style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', color: 'var(--cream)', fontWeight: '700', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                <Bell size={20} color="var(--muted)" />
                Notifications
              </button>
              <button style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', color: 'var(--cream)', fontWeight: '700', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                <Key size={20} color="var(--muted)" />
                Password
              </button>
            </div>

            <button onClick={logout} className="btn" style={{ 
              color: 'var(--red)', background: 'rgba(231,109,130,0.1)', border: '1px solid rgba(231,109,130,0.2)',
              width: '100%', padding: '16px', fontSize: '15px', fontWeight: '800', borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s'
            }} onMouseOver={e=> { e.currentTarget.style.background='var(--red)'; e.currentTarget.style.color='var(--bg)'; }} onMouseOut={e=> { e.currentTarget.style.background='rgba(231,109,130,0.1)'; e.currentTarget.style.color='var(--red)'; }}>
              <LogOut size={18} />
              Sign Out of Coinly
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
