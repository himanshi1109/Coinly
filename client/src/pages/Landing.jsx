import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Target, Lock } from 'lucide-react';

const Landing = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="anim-fade-in" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Decorative BG elements for Hero */}
      <div className="anim-float" style={{ position: 'absolute', top: '5%', left: '0%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, var(--purple) 0%, transparent 60%)', opacity: 0.2, filter: 'blur(60px)', zIndex: 0 }}></div>
      <div className="anim-float-rev delay-2" style={{ position: 'absolute', top: '15%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, var(--mustard) 0%, transparent 60%)', opacity: 0.15, filter: 'blur(60px)', zIndex: 0 }}></div>

      {/* Navbar */}
      <nav className="anim-reveal-up" style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--teal)', color: 'var(--bg)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 8px 24px rgba(73, 139, 129, 0.4)' }}>
            💰
          </div>
          Coinly
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{ padding: '14px 32px', background: 'var(--cream)', color: 'var(--bg)', borderRadius: 'var(--r-pill)', fontWeight: '800', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: '0 8px 24px rgba(255,255,255,0.2)' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ padding: '12px 24px', fontWeight: '700', textDecoration: 'none', color: 'var(--muted)', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--cream)'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>
                Log in
              </Link>
              <Link to="/register" style={{ padding: '14px 32px', background: 'var(--cream)', color: 'var(--bg)', borderRadius: 'var(--r-pill)', fontWeight: '800', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: '0 8px 24px rgba(255,255,255,0.2)' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ padding: '80px 48px', position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '64px', alignItems: 'center' }}>
          
          {/* Left Text */}
          <div style={{ flex: 1.2 }}>
            <div className="anim-reveal-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--r-pill)', color: 'var(--teal)', fontWeight: '700', fontSize: '14px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--teal)', boxShadow: '0 0 10px var(--teal)' }}></span>
              Coinly 2.0 is Live
            </div>
            <h1 className="anim-reveal-up delay-1" style={{ fontSize: '72px', fontWeight: '800', lineHeight: 1.1, color: 'var(--cream)', marginBottom: '24px', letterSpacing: '-2px' }}>
              Financial clarity, <br/>
              <span style={{ color: 'var(--purple)' }}>without the chaos.</span>
            </h1>
            <p className="anim-reveal-up delay-2" style={{ fontSize: '20px', color: 'var(--muted)', fontWeight: '600', marginBottom: '48px', lineHeight: 1.6, maxWidth: '90%' }}>
              Take control of your money with our playful, intelligent expense manager. Designed to make hitting your financial goals actually enjoyable.
            </p>
            <div className="anim-reveal-up delay-3" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Link to={user ? "/dashboard" : "/register"} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 40px', fontSize: '18px', background: 'var(--teal)', color: 'var(--bg)', borderRadius: 'var(--r-pill)', fontWeight: '800', textDecoration: 'none', boxShadow: '0 16px 32px rgba(73, 139, 129, 0.4)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-4px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                Start Tracking Free <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Right Floating Cards (Parallax/Staggered) */}
          <div className="anim-reveal-up delay-2 hide-on-mobile" style={{ flex: 1, position: 'relative', height: '600px' }}>
            
            {/* Main Center Card */}
            <div className="anim-float" style={{ position: 'absolute', top: '100px', right: '40px', width: '340px', background: 'var(--surface)', padding: '32px', borderRadius: '40px', boxShadow: '0 32px 64px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.05)', zIndex: 3 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 color="var(--mustard)" />
                </div>
                <span style={{ background: 'var(--mustard)', color: 'var(--bg)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>+12%</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Total Savings</p>
              <h3 style={{ fontSize: '40px', fontWeight: '800', color: 'var(--cream)', lineHeight: 1 }}>$14,020</h3>
              
              {/* Fake Graph */}
              <div style={{ marginTop: '32px', display: 'flex', gap: '8px', alignItems: 'flex-end', height: '80px' }}>
                {[40, 60, 30, 80, 50, 100, 70].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: h === 100 ? 'var(--mustard)' : 'rgba(255,255,255,0.1)', borderRadius: '8px' }}></div>
                ))}
              </div>
            </div>

            {/* Accent Card Top Left */}
            <div className="anim-float-rev" style={{ position: 'absolute', top: '20px', left: '-20px', width: '220px', background: 'var(--purple)', padding: '24px', borderRadius: '32px', boxShadow: '0 24px 48px rgba(126, 128, 215, 0.3)', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--cream)', color: 'var(--purple)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={16} /></div>
                <span style={{ color: 'var(--cream)', fontWeight: '800', fontSize: '14px' }}>Quick Log</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div style={{ width: '70%', height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}></div>
            </div>

            {/* Accent Card Bottom Left */}
            <div className="anim-float" style={{ animationDelay: '-3s', position: 'absolute', bottom: '80px', left: '-40px', width: '240px', background: 'var(--pink)', padding: '24px', borderRadius: '32px', boxShadow: '0 24px 48px rgba(255, 227, 255, 0.2)', zIndex: 4 }}>
              <p style={{ color: 'var(--bg)', fontSize: '13px', fontWeight: '800', marginBottom: '4px' }}>WEEKLY BUDGET</p>
              <h4 style={{ color: 'var(--bg)', fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>On Track!</h4>
              <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: 'var(--teal)', borderRadius: '6px' }}></div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Infinite Marquee Section */}
      <div className="marquee-container" style={{ padding: '32px 0', background: 'var(--teal)', borderTop: '2px solid rgba(0,0,0,0.1)', borderBottom: '2px solid rgba(0,0,0,0.1)', transform: 'rotate(-2deg) scale(1.05)', zIndex: 20 }}>
        <div className="marquee-content" style={{ color: 'var(--bg)', fontWeight: '800', fontSize: '28px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          {Array(8).fill("Playful Finances • Smart Tracking • Secure Data • Beautiful Charts •").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hide-on-mobile { display: none !important; }
        }
      `}</style>

      {/* Bento Box Features Section */}
      <section style={{ padding: '120px 48px', position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 className="anim-reveal-up" style={{ fontSize: '48px', fontWeight: '800', color: 'var(--cream)', marginBottom: '20px', letterSpacing: '-1px' }}>
            Everything you need to <br/><span style={{ color: 'var(--mustard)' }}>master your money.</span>
          </h2>
          <p className="anim-reveal-up delay-1" style={{ fontSize: '18px', color: 'var(--muted)', fontWeight: '600', maxWidth: '600px', margin: '0 auto' }}>
            We've combined powerful analytics with an interface so delightfully playful, you'll actually look forward to budgeting.
          </p>
        </div>

        {/* CSS Grid Bento */}
        <div className="anim-reveal-up delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'minmax(250px, auto)', gap: '24px' }}>
          
          {/* Bento Item 1 - Large Left */}
          <div style={{ gridColumn: 'span 8', background: 'var(--surface)', borderRadius: '48px', padding: '48px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, var(--pink) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(30px)' }}></div>
            <div style={{ background: 'var(--bg)', width: '64px', height: '64px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <BarChart3 size={32} color="var(--pink)" />
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--cream)', marginBottom: '16px' }}>Highly Visual Analytics</h3>
            <p style={{ color: 'var(--muted)', fontSize: '18px', fontWeight: '600', maxWidth: '80%', lineHeight: 1.6 }}>Understand your spending habits at a glance with incredibly playful, color-coded charts and interactive diagrams.</p>
          </div>

          {/* Bento Item 2 - Small Right Top */}
          <div style={{ gridColumn: 'span 4', background: 'var(--teal)', borderRadius: '48px', padding: '40px', display: 'flex', flexDirection: 'column', color: 'var(--bg)' }}>
            <div style={{ background: 'var(--bg)', width: '56px', height: '56px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <ShieldCheck size={28} color="var(--teal)" />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Bank-Level Security</h3>
            <p style={{ fontSize: '15px', fontWeight: '700', opacity: 0.9 }}>Your financial data is encrypted and securely stored. We never sell your data.</p>
          </div>

          {/* Bento Item 3 - Small Left Bottom */}
          <div style={{ gridColumn: 'span 4', background: 'var(--orange)', borderRadius: '48px', padding: '40px', display: 'flex', flexDirection: 'column', color: 'var(--bg)' }}>
            <div style={{ background: 'var(--bg)', width: '56px', height: '56px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Target size={28} color="var(--orange)" />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Custom Budgets</h3>
            <p style={{ fontSize: '15px', fontWeight: '700', opacity: 0.9 }}>Set rigid or flexible budgets for different categories and track your limits.</p>
          </div>

          {/* Bento Item 4 - Large Right Bottom */}
          <div style={{ gridColumn: 'span 8', background: 'var(--surface)', borderRadius: '48px', padding: '48px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--mustard) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(30px)' }}></div>
            <div style={{ background: 'var(--bg)', width: '64px', height: '64px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Zap size={32} color="var(--mustard)" />
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--cream)', marginBottom: '16px' }}>Lightning Fast Logging</h3>
            <p style={{ color: 'var(--muted)', fontSize: '18px', fontWeight: '600', maxWidth: '80%', lineHeight: 1.6 }}>Add transactions on the fly. Coinly is optimized for speed so you can record your expenses and get back to living.</p>
          </div>

        </div>
      </section>

      {/* Massive CTA Section */}
      <section style={{ padding: '0 48px 120px 48px', maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        <div className="anim-reveal-up delay-1" style={{ background: 'var(--purple)', borderRadius: '64px', padding: '80px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'var(--cream)', borderRadius: '50%', opacity: 0.1, filter: 'blur(50px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', background: 'var(--bg)', borderRadius: '50%', opacity: 0.2, filter: 'blur(40px)' }}></div>

          <h2 style={{ fontSize: '56px', fontWeight: '800', color: 'var(--cream)', marginBottom: '24px', letterSpacing: '-1px', position: 'relative', zIndex: 2 }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px auto', position: 'relative', zIndex: 2 }}>
            Join thousands of users who have transformed their financial lives with Coinly's intuitive design.
          </p>
          <Link to={user ? "/dashboard" : "/register"} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '24px 48px', fontSize: '20px', background: 'var(--cream)', color: 'var(--purple)', borderRadius: 'var(--r-pill)', fontWeight: '800', textDecoration: 'none', boxShadow: '0 24px 48px rgba(0,0,0,0.2)', transition: 'transform 0.2s', position: 'relative', zIndex: 2 }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
            Create your free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '64px 48px', background: 'var(--bg)', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '48px' }}>
          
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '28px', fontWeight: '800', color: 'var(--cream)', marginBottom: '16px' }}>
              💰 Coinly
            </div>
            <p style={{ color: 'var(--muted)', fontWeight: '600', fontSize: '15px', maxWidth: '300px', lineHeight: 1.6 }}>
              The modern, playful personal finance app designed for humans, not accountants.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ color: 'var(--cream)', fontWeight: '800', fontSize: '16px', marginBottom: '8px' }}>Product</h4>
              <span style={{ color: 'var(--muted)', cursor: 'pointer', fontWeight: '600' }}>Features</span>
              <span style={{ color: 'var(--muted)', cursor: 'pointer', fontWeight: '600' }}>Security</span>
              <span style={{ color: 'var(--muted)', cursor: 'pointer', fontWeight: '600' }}>Pricing</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ color: 'var(--cream)', fontWeight: '800', fontSize: '16px', marginBottom: '8px' }}>Company</h4>
              <span style={{ color: 'var(--muted)', cursor: 'pointer', fontWeight: '600' }}>About Us</span>
              <span style={{ color: 'var(--muted)', cursor: 'pointer', fontWeight: '600' }}>Careers</span>
              <span style={{ color: 'var(--muted)', cursor: 'pointer', fontWeight: '600' }}>Contact</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ color: 'var(--cream)', fontWeight: '800', fontSize: '16px', marginBottom: '8px' }}>Legal</h4>
              <span style={{ color: 'var(--muted)', cursor: 'pointer', fontWeight: '600' }}>Privacy Policy</span>
              <span style={{ color: 'var(--muted)', cursor: 'pointer', fontWeight: '600' }}>Terms of Service</span>
            </div>
          </div>
          
        </div>
        
        <div style={{ maxWidth: '1200px', margin: '64px auto 0 auto', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted)', fontSize: '14px', fontWeight: '600' }}>
          <span>&copy; 2026 Coinly Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ cursor: 'pointer' }}>Twitter</span>
            <span style={{ cursor: 'pointer' }}>Instagram</span>
            <span style={{ cursor: 'pointer' }}>Dribbble</span>
          </div>
        </div>
      </footer>

      {/* Global CSS fixes for Bento Grid Responsiveness */}
      <style>{`
        @media (max-width: 900px) {
          section > div[style*="gridTemplateColumns"] {
            display: flex !important;
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;
