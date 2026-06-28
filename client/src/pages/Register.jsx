import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post('/auth/register', { name, email, password });
      login(res.data.token, res.data.user);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors[0].msg);
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anim-fade-in" style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--bg)', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative Orbs */}
      <div className="anim-float" style={{ position: 'absolute', top: '5%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, var(--teal) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(40px)', zIndex: 0 }}></div>
      <div className="anim-float-rev" style={{ position: 'absolute', bottom: '5%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, var(--orange) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(40px)', zIndex: 0 }}></div>

      {/* Back Button */}
      <Link to="/" style={{ position: 'absolute', top: '24px', left: '24px', width: '48px', height: '48px', borderRadius: '16px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cream)', textDecoration: 'none', zIndex: 10, border: '1px solid var(--border)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
        <ArrowLeft size={24} />
      </Link>

      <div className="anim-slide-up" style={{ 
        width: '100%', 
        maxWidth: '900px', 
        height: '520px', /* Fixed height */
        background: 'var(--surface)', 
        borderRadius: '40px', 
        position: 'relative', 
        zIndex: 1, 
        boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        display: 'flex',
        border: '1px solid var(--border)'
      }}>
        
        {/* Left Side (Illustration) */}
        <div className="hide-on-mobile" style={{ flex: 1, background: 'var(--teal)', borderRadius: '40px 0 0 40px', padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', fontWeight: '800', color: 'var(--bg)', zIndex: 1 }}>
            <span style={{ fontSize: '28px' }}>💰</span>
            Coinly
          </div>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <img src="/finance-illustration.png" alt="Finance" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'white', opacity: 0.2, filter: 'blur(20px)' }}></div>
        </div>

        <style>{`
          @media (max-width: 767px) {
            .hide-on-mobile { display: none !important; }
          }
        `}</style>

        {/* Right Side (Form) */}
        <div style={{ flex: 1, padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--cream)', marginBottom: '8px' }}>Register</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px', fontWeight: '600' }}>Join Coinly to master your money.</p>
          
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Account Type</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, background: 'var(--teal)', color: 'var(--bg)', padding: '12px', borderRadius: '12px', fontWeight: '800', textAlign: 'center', fontSize: '14px', border: '2px solid var(--teal)', cursor: 'default' }}>
                  User
                </div>
                <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', color: 'var(--muted)', padding: '12px', borderRadius: '12px', fontWeight: '700', textAlign: 'center', fontSize: '14px', border: '2px solid rgba(255,255,255,0.05)', opacity: 0.5, cursor: 'not-allowed' }} title="Admin registration is restricted to internal team only">
                  Admin
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ 
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px', padding: '12px 20px', color: 'var(--cream)',
                  fontFamily: 'Quicksand', fontSize: '15px', fontWeight: '600', outline: 'none', transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.border = '1px solid var(--teal)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.05)'}
                required 
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Email</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px', padding: '12px 20px', color: 'var(--cream)',
                  fontFamily: 'Quicksand', fontSize: '15px', fontWeight: '600', outline: 'none', transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.border = '1px solid var(--teal)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.05)'}
                required 
              />
            </div>
            
            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px', padding: '12px 20px', color: 'var(--cream)',
                  fontFamily: 'Quicksand', fontSize: '15px', fontWeight: '600', outline: 'none', transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.border = '1px solid var(--teal)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.05)'}
                required 
                minLength={6}
              />
            </div>

            <button type="submit" style={{ 
              marginTop: '12px', width: '100%', padding: '16px', fontSize: '16px', fontWeight: '800', fontFamily: 'Quicksand',
              background: 'var(--teal)', color: 'var(--bg)', borderRadius: '16px', border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(73, 139, 129, 0.4)', transition: 'transform 0.2s'
            }} disabled={loading} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: '600' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: '800' }}>
                Login
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
