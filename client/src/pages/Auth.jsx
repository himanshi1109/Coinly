import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, User, KeyRound, ArrowLeft } from 'lucide-react';

const Auth = ({ mode }) => {
  const [activeTab, setActiveTab] = useState(mode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (mode) {
      setActiveTab(mode);
    }
  }, [mode]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(tab === 'login' ? '/login' : '/register', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'login') {
        const res = await API.post('/auth/login', { email, password });
        login(res.data.token, res.data.user);
        toast.success('Welcome back!');
        if (res.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        const res = await API.post('/auth/register', { name, email, password });
        login(res.data.token, res.data.user);
        toast.success('Account created!');
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors[0].msg);
      } else {
        toast.error(err.response?.data?.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anim-fade-in" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: 'var(--bg)', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      {/* Decorative BG elements copied from Landing Page Header */}
      <div className="anim-float" style={{ position: 'absolute', top: '5%', left: '0%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, var(--purple) 0%, transparent 60%)', opacity: 0.2, filter: 'blur(60px)', zIndex: 0 }}></div>
      <div className="anim-float-rev delay-2" style={{ position: 'absolute', top: '15%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, var(--mustard) 0%, transparent 60%)', opacity: 0.15, filter: 'blur(60px)', zIndex: 0 }}></div>

      {/* Logo Link to go back to Landing */}
      <Link to="/" style={{
        position: 'absolute',
        top: '32px',
        left: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '24px',
        fontWeight: '800',
        color: 'var(--cream)',
        textDecoration: 'none',
        zIndex: 10,
        transition: 'transform 0.2s'
      }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
        <span style={{ fontSize: '32px' }}>
          💰
        </span>
        Coinly
      </Link>

      {/* Main Glassmorphism Auth Card */}
      <div className="anim-slide-up card-container" style={{
        display: 'flex',
        width: '90%',
        maxWidth: '880px',
        height: '560px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(25px) saturate(180%)',
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 1
      }}>

        {/* Left Side: Dynamic Tab Panel (Glass Overlay) */}
        <div className="side-panel" style={{
          width: '40%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.01)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          overflow: 'hidden',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'all 0.5s ease',
          paddingTop: '60px',
          paddingBottom: '32px'
        }}>
          
          {/* Subtle colored glow inside panel depending on mode */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: activeTab === 'login' 
              ? 'radial-gradient(circle, rgba(231, 109, 130, 0.25) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(73, 139, 129, 0.25) 0%, transparent 70%)',
            zIndex: 0,
            transition: 'background 0.5s ease'
          }}></div>

          {/* Image Illustration */}
          <div className="hide-on-mobile" style={{ 
            width: '100%', 
            height: '300px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1
          }}>
            <img 
              src={activeTab === 'login' ? '/login-new.png' : '/register-new.png'} 
              alt="Illustration" 
              style={{ 
                width: '100%', 
                height: '100%',
                objectFit: 'contain'
              }} 
            />
          </div>
  
          {/* Vertical Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', position: 'relative', zIndex: 1 }}>
            
            {/* Login Tab */}
            <div 
              onClick={() => handleTabChange('login')}
              className={`tab-btn ${activeTab === 'login' ? 'active-login' : ''}`}
              style={{
                width: '85%',
                padding: '14px 24px',
                background: activeTab === 'login' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                borderRadius: '30px 0 0 30px',
                color: activeTab === 'login' ? 'var(--cream)' : 'rgba(255,255,255,0.4)',
                borderLeft: activeTab === 'login' ? '4px solid var(--red)' : '4px solid transparent',
                fontWeight: '800',
                fontSize: '15px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: activeTab === 'login' ? '-8px 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
                alignSelf: 'flex-end',
                transition: 'all 0.3s ease'
              }}
            >
              LOGIN
            </div>
  
            {/* Register Tab */}
            <div 
              onClick={() => handleTabChange('register')}
              className={`tab-btn ${activeTab === 'register' ? 'active-register' : ''}`}
              style={{
                width: '85%',
                padding: '14px 24px',
                background: activeTab === 'register' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                borderRadius: '30px 0 0 30px',
                color: activeTab === 'register' ? 'var(--cream)' : 'rgba(255,255,255,0.4)',
                borderLeft: activeTab === 'register' ? '4px solid var(--teal)' : '4px solid transparent',
                fontWeight: '800',
                fontSize: '15px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: activeTab === 'register' ? '-8px 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
                alignSelf: 'flex-end',
                transition: 'all 0.3s ease'
              }}
            >
              SIGN UP
            </div>
  
          </div>
        </div>

      {/* Right Side: Form Area (Glass Overlay) */}
      <div className="form-panel" style={{
        width: '60%',
        height: '100%',
        backgroundColor: 'transparent',
        padding: '40px 56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative'
      }}>
          
          {/* Avatar Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: activeTab === 'login' ? 'linear-gradient(135deg, rgba(126, 128, 215, 0.2) 0%, rgba(231, 109, 130, 0.2) 100%)' : 'linear-gradient(135deg, rgba(73, 139, 129, 0.2) 0%, rgba(234, 175, 54, 0.2) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)', 
              marginBottom: '12px',
              transition: 'background 0.3s ease'
            }}>
              <User size={30} color="var(--cream)" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--cream)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {activeTab === 'login' ? 'Login' : 'Create Account'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Full Name (Only for Register) */}
            {activeTab === 'register' && (
              <div style={{ position: 'relative', width: '100%' }}>
                <User size={18} color="var(--muted)" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ 
                    width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', 
                    borderRadius: '99px', padding: '16px 20px 16px 52px', color: 'var(--cream)',
                    fontFamily: 'Quicksand', fontSize: '15px', fontWeight: '600', outline: 'none', transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  required 
                />
              </div>
            )}

            {/* Email Address */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Mail size={18} color="rgba(255, 255, 255, 0.4)" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', 
                  borderRadius: '99px', padding: '14px 20px 14px 52px', color: 'var(--cream)',
                  fontFamily: 'Quicksand', fontSize: '15px', fontWeight: '600', outline: 'none', transition: 'all 0.2s ease'
                }}
                onFocus={e => { e.target.style.borderColor = activeTab === 'login' ? 'var(--red)' : 'var(--teal)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                required 
              />
            </div>
            
            {/* Password */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Lock size={18} color="rgba(255, 255, 255, 0.4)" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', 
                  borderRadius: '99px', padding: '14px 20px 14px 52px', color: 'var(--cream)',
                  fontFamily: 'Quicksand', fontSize: '15px', fontWeight: '600', outline: 'none', transition: 'all 0.2s ease'
                }}
                onFocus={e => { e.target.style.borderColor = activeTab === 'login' ? 'var(--red)' : 'var(--teal)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                required 
                minLength={6}
              />
            </div>

            {/* Forgot Password Link (Only for Login) */}
            {activeTab === 'login' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--cream)'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>Forgot Password?</span>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" style={{ 
              marginTop: '8px', 
              width: '100%', 
              padding: '14px', 
              fontSize: '15px', 
              fontWeight: '800', 
              fontFamily: 'Quicksand',
              background: activeTab === 'login' 
                ? 'linear-gradient(135deg, rgba(126, 128, 215, 0.9) 0%, rgba(231, 109, 130, 0.9) 100%)' 
                : 'linear-gradient(135deg, rgba(73, 139, 129, 0.9) 0%, rgba(234, 175, 54, 0.9) 100%)',
              color: 'var(--cream)', 
              borderRadius: '99px', 
              border: 'none', 
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s', 
              boxShadow: activeTab === 'login' ? '0 8px 24px rgba(126, 128, 215, 0.3)' : '0 8px 24px rgba(73, 139, 129, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }} disabled={loading} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)';}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)';}}>
              {loading ? 'Processing...' : (activeTab === 'login' ? 'LOGIN' : 'REGISTER')}
            </button>
          </form>
        </div>
      </div>

      {/* Embedded CSS for responsiveness */}
      <style>{`
        .tab-btn.active-login {
          border-left: 4px solid var(--red) !important;
        }
        .tab-btn.active-register {
          border-left: 4px solid var(--teal) !important;
        }
        @media (max-width: 768px) {
          .card-container {
            flex-direction: column !important;
            height: auto !important;
            max-width: 440px !important;
          }
          .side-panel {
            width: 100% !important;
            height: 70px !important;
            flex-direction: row !important;
            justify-content: space-around !important;
            align-items: center !important;
            padding: 0 16px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          }
          .side-panel > div {
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 24px !important;
            width: auto !important;
          }
          .side-panel > div > div {
            width: auto !important;
            border-radius: 99px !important;
            padding: 8px 20px !important;
            border-left: none !important;
            border-bottom: 3px solid transparent !important;
          }
          .tab-btn.active-login {
            border-left: none !important;
            border-bottom: 3px solid var(--red) !important;
          }
          .tab-btn.active-register {
            border-left: none !important;
            border-bottom: 3px solid var(--teal) !important;
          }
          .form-panel {
            width: 100% !important;
            padding: 24px 20px !important;
          }
          .side-panel a {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Auth;
