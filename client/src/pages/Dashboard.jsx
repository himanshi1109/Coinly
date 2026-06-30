import { useState, useEffect } from 'react';
import API from '../api/axios';
import Topbar from '../components/Topbar';
import CircleRing from '../components/CircleRing';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORY_COLORS } from '../utils/categoryConfig';
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DecorativeBlob = ({ color, opacity = 0.2, top, right, bottom, left }) => (
  <div className="anim-float" style={{
    position: 'absolute', top, right, bottom, left,
    width: '120px', height: '120px', borderRadius: '50%',
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    opacity, filter: 'blur(20px)', zIndex: 0, pointerEvents: 'none'
  }} />
);

const CustomActiveDot = (props) => {
  const { cx, cy, stroke, value } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={stroke} stroke="var(--bg)" strokeWidth={3} />
      <rect x={cx - 24} y={cy - 36} width={48} height={22} fill={stroke} rx={4} />
      <text x={cx} y={cy - 21} fill="var(--bg)" fontSize={11} fontWeight={800} textAnchor="middle">{value}</text>
    </g>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [dashRes, budgetRes] = await Promise.all([
          API.get('/dashboard'),
          API.get('/budgets')
        ]);
        setData({ dashboard: dashRes.data.data, budgets: budgetRes.data.data });
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (!data) return <div className="empty-state">Failed to load</div>;

  const { dashboard, budgets } = data;
  
  // Dynamic chart data for Area Chart representing Balance History growth
  const areaData = dashboard.balance > 0 ? [
    { name: 'May', balance: Math.round(dashboard.balance * 0.4) },
    { name: 'Jun', balance: Math.round(dashboard.balance * 0.6) },
    { name: 'Jul', balance: Math.round(dashboard.balance * 0.5) },
    { name: 'Aug', balance: Math.round(dashboard.balance * 0.85) },
    { name: 'Sep', balance: Math.round(dashboard.balance) },
  ] : [
    { name: 'May', balance: 0 },
    { name: 'Jun', balance: 0 },
    { name: 'Jul', balance: 0 },
    { name: 'Aug', balance: 0 },
    { name: 'Sep', balance: 0 },
  ];

  // Fake chart data for Stacked Bar Chart (My Courses/Schedule style)
  const stackedBarData = [
    { name: 'Mon', income: 4000, expense: 2400 },
    { name: 'Tue', income: 3000, expense: 1398 },
    { name: 'Wed', income: 2000, expense: 4800 },
    { name: 'Thu', income: 2780, expense: 3908 },
    { name: 'Fri', income: 1890, expense: 4800 },
    { name: 'Sat', income: 2390, expense: 3800 },
    { name: 'Sun', income: 3490, expense: 4300 },
  ];

  // Calculate savings rate
  const savingsRate = dashboard.totalIncome > 0 
    ? Math.round(((dashboard.totalIncome - dashboard.totalExpenses) / dashboard.totalIncome) * 100) 
    : 0;

  // Calculate budget used
  const totalBudget = budgets.reduce((acc, b) => acc + b.limit, 0);
  const budgetUsed = totalBudget > 0 
    ? Math.round((dashboard.currentMonthExpenses / totalBudget) * 100) 
    : 0;
    
  // Monthly rating (simple mock)
  const rating = budgetUsed > 90 ? 40 : budgetUsed > 75 ? 70 : 95;

  return (
    <div className="anim-fade-in">
      <Topbar />

      <div className="dash-grid">
        {/* Left Column (2/3 width) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
            {/* Area Chart Card - Learning Progress style */}
            <div className="dash-card anim-slide-up" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', borderRadius: '32px' }}>
              <img 
                src="/assets/work.png.png" 
                alt="Work Hard Sticker" 
                className="anim-float delay-1" 
                style={{ position: 'absolute', top: '24px', right: '40px', width: '120px', transform: 'rotate(12deg)', zIndex: 50, pointerEvents: 'none' }} 
              />
              <div style={{ padding: '32px', paddingBottom: '0', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 227, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pink)' }}>
                    📈
                  </div>
                  <h3 className="dash-card-title" style={{ color: 'var(--cream)', margin: 0, fontSize: '20px' }}>Balance History</h3>
                </div>
                
                <div style={{ display: 'flex', gap: '32px' }}>
                  <div>
                    <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--cream)', lineHeight: 1, marginBottom: '4px' }}>{formatCurrency(dashboard.balance)}</p>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)' }}>Total Balance</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '24px', fontWeight: '800', color: savingsRate >= 0 ? 'var(--teal)' : 'var(--red)', lineHeight: 1, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ 
                        fontSize: '14px', 
                        background: savingsRate >= 0 ? 'rgba(73, 139, 129, 0.1)' : 'rgba(239, 71, 111, 0.1)', 
                        color: savingsRate >= 0 ? 'var(--teal)' : 'var(--red)',
                        padding: '2px 8px', 
                        borderRadius: '8px' 
                      }}>
                        {savingsRate >= 0 ? '+' : ''}{savingsRate}%
                      </span>
                    </p>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)' }}>Growth</p>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, minHeight: '160px', marginTop: '-10px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--pink)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--pink)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 2 }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'var(--surface)', color: 'var(--cream)', fontWeight: '700', boxShadow: '0 16px 32px rgba(0,0,0,0.5)' }} />
                    <Area type="monotone" dataKey="balance" stroke="var(--pink)" strokeWidth={4} fillOpacity={1} fill="url(#colorBalance)" activeDot={<CustomActiveDot />} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontWeight: 700, fontSize: 12 }} dy={10} padding={{ left: 20, right: 20 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Smart Insights Card */}
            <div className="dash-card anim-slide-up delay-1">
              <DecorativeBlob color="var(--orange)" top="-20px" right="-20px" />
              <h3 className="dash-card-title" style={{ color: 'var(--cream)', position: 'relative', zIndex: 1 }}>Smart Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
                
                {/* Insight 1 */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    background: 'rgba(234, 175, 54, 0.1)', 
                    color: 'var(--mustard)',
                    width: '36px', height: '36px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', flexShrink: 0
                  }}>
                    💡
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--cream)', margin: '0 0 4px 0' }}>Track Category Limits</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                      Setting up active limits in budgets helps you curb impulse spending by up to 25%.
                    </p>
                  </div>
                </div>

                {/* Insight 2 */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    background: 'rgba(73, 139, 129, 0.1)', 
                    color: 'var(--teal)',
                    width: '36px', height: '36px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', flexShrink: 0
                  }}>
                    📊
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--cream)', margin: '0 0 4px 0' }}>Monthly Savings Target</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                      Your current savings rate is healthy. Try putting 10% more into savings this week.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Stacked Bar Chart - Cashflow */}
            <div className="dash-card-mustard anim-slide-up delay-2">
              <h3 className="dash-card-title" style={{ color: 'var(--bg)' }}>Weekly Cashflow</h3>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--bg)' }}></div>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--bg)' }}>Income</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(0,0,0,0.2)' }}></div>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--bg)' }}>Expense</span>
                </div>
              </div>
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stackedBarData} barSize={20}>
                    <defs>
                      <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">
                        <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                      </pattern>
                    </defs>
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '16px', border: 'none', background: 'var(--bg)', color: 'var(--cream)', fontWeight: '700', boxShadow: '0 12px 24px rgba(0,0,0,0.2)' }} />
                    <Bar dataKey="income" stackId="a" fill="var(--bg)" radius={[0, 0, 10, 10]} />
                    <Bar dataKey="expense" stackId="a" fill="url(#diagonalHatch)" radius={[10, 10, 0, 0]} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(0,0,0,0.6)', fontWeight: 700, fontSize: 12 }} dy={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="dash-card anim-slide-up delay-3">
              <h3 className="dash-card-title" style={{ color: 'var(--cream)' }}>Recent Transactions</h3>
              {dashboard.recentTransactions?.slice(0, 4).map(tx => {
                const config = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.Other;
                return (
                  <div key={tx._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: config.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        {config.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--cream)' }}>{tx.notes || tx.category}</p>
                        <p style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600' }}>{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                      </div>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: tx.type === 'income' ? 'var(--teal)' : 'var(--red)' }}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width) - Vertical Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="dash-card-teal anim-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <DecorativeBlob color="var(--bg)" top="-20px" right="-20px" opacity={0.15} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 className="dash-card-title" style={{ color: 'rgba(255,255,255,0.7)' }}>Savings Rate</h3>
              <p className="dash-amount" style={{ color: 'var(--cream)' }}>{savingsRate}%</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', fontWeight: '700' }}>of total income</p>
            </div>
            <div style={{ position: 'relative', zIndex: 1, paddingBottom: '16px' }}>
              <CircleRing percent={savingsRate} stroke="var(--cream)" size={120} />
            </div>
          </div>

          <div className="dash-card-red anim-slide-up delay-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img 
              src="/assets/budget.png.png" 
              alt="Budget Sticker" 
              className="anim-float delay-2" 
              style={{ position: 'absolute', bottom: '20px', left: '120px', width: '90px', transform: 'rotate(-12deg)', zIndex: 50, pointerEvents: 'none' }} 
            />
            <DecorativeBlob color="var(--bg)" bottom="-20px" left="-20px" opacity={0.15} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 className="dash-card-title" style={{ color: 'rgba(255,255,255,0.7)' }}>Budget Used</h3>
              <p className="dash-amount" style={{ color: 'var(--cream)' }}>{budgetUsed}%</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', fontWeight: '700' }}>of total limit</p>
            </div>
            <div style={{ position: 'relative', zIndex: 1, paddingBottom: '16px' }}>
              <CircleRing percent={Math.min(budgetUsed, 100)} stroke="var(--cream)" size={120} />
            </div>
          </div>

          <div className="dash-card-orange anim-slide-up delay-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <DecorativeBlob color="var(--bg)" top="20%" right="50%" opacity={0.15} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 className="dash-card-title" style={{ color: 'rgba(0,0,0,0.5)' }}>Monthly Rating</h3>
              <p className="dash-amount" style={{ color: 'var(--bg)' }}>{rating}<span style={{ fontSize: '20px' }}>/100</span></p>
              <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', marginTop: '4px', fontWeight: '700' }}>Excellent Job 🌟</p>
            </div>
            <div style={{ position: 'relative', zIndex: 1, paddingBottom: '16px' }}>
              <CircleRing percent={rating} stroke="var(--bg)" size={120} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
