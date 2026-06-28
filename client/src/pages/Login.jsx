import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anim-fade-in" style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--bg)', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative Orbs */}
      <div className="anim-float" style={{ position: 'absolute', top: '5%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, var(--purple) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(40px)', zIndex: 0 }}></div>
      <div className="anim-float-rev" style={{ position: 'absolute', bottom: '5%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, var(--teal) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(40px)', zIndex: 0 }}></div>

      {/* Back Button */}
      <Link to="/" style={{ position: 'absolute', top: '24px', left: '24px', width: '48px', height: '48px', borderRadius: '16px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cream)', textDecoration: 'none', zIndex: 10, border: '1px solid var(--border)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
        <ArrowLeft size={24} />
      </Link>

      <div className="anim-slide-up" style={{ 
        width: '100%', 
        maxWidth: '900px', 
        height: '520px', /* Fixed height to prevent scrolling */
        background: 'var(--surface)', 
        borderRadius: '40px', 
        position: 'relative', 
        zIndex: 1, 
        boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        display: 'flex',
        border: '1px solid var(--border)'
      }}>
        
        {/* Left Side (White/Illustration) */}
        <div className="hide-on-mobile" style={{ flex: 1, background: 'var(--pink)', borderRadius: '40px 0 0 40px', padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', fontWeight: '800', color: 'var(--bg)', zIndex: 1 }}>
            <span style={{ fontSize: '28px' }}>💰</span>
            Coinly
          </div>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <img src="/finance-illustration.png" alt="Finance" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'white', opacity: 0.2, filter: 'blur(20px)' }}></div>
        </div>

        <style>{`
          @media (max-width: 767px) {
            .hide-on-mobile { display: none !important; }
          }
        `}</style>

        {/* Right Side (Form) */}
        <div style={{ flex: 1, padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--cream)', marginBottom: '8px' }}>Login</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '32px', fontWeight: '600' }}>Welcome back to your playful finance hub.</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>Email</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px', 
                  padding: '14px 20px', 
                  color: 'var(--cream)',
                  fontFamily: 'Quicksand',
                  fontSize: '15px',
                  fontWeight: '600',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.border = '1px solid var(--purple)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.05)'}
                required 
              />
            </div>
            
            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px', 
                  padding: '14px 20px', 
                  color: 'var(--cream)',
                  fontFamily: 'Quicksand',
                  fontSize: '15px',
                  fontWeight: '600',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.border = '1px solid var(--purple)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.05)'}
                required 
              />
            </div>

            <button type="submit" style={{ 
              marginTop: '12px', 
              width: '100%', 
              padding: '16px', 
              fontSize: '16px', 
              fontWeight: '800',
              fontFamily: 'Quicksand',
              background: 'var(--purple)', 
              color: 'var(--cream)', 
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(126, 128, 215, 0.4)',
              transition: 'transform 0.2s'
            }} disabled={loading} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: '600' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--purple)', textDecoration: 'none', fontWeight: '800' }}>
                Register
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
