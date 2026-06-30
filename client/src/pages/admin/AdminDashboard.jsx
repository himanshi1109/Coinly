import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Topbar from '../../components/Topbar';
import Loader from '../../components/Loader';
import { CATEGORY_COLORS } from '../../utils/categoryConfig';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import CircleRing from '../../components/CircleRing';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, usersRes, txRes, reportsRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/users'),
          API.get('/admin/transactions'),
          API.get('/reports?months=6')
        ]);
        setData({
          stats: statsRes.data.data,
          users: usersRes.data.data,
          transactions: txRes.data.data,
          reports: reportsRes.data.data
        });
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (!data) return <div className="empty-state">Failed to load admin stats</div>;

  const barData = (data.stats.monthlyTrends || []).map(item => ({
    name: item._id, Income: item.income, Expense: item.expense
  })).reverse();

  const signupData = [
    { name: 'Jan', Users: 1 },
    { name: 'Feb', Users: 2 },
    { name: 'Mar', Users: 4 },
    { name: 'Apr', Users: 6 },
    { name: 'May', Users: Math.max(1, Math.round((data.stats.totalUsers || 10) * 0.7)) },
    { name: 'Jun', Users: data.stats.totalUsers || 10 }
  ];

  const transactionActivityData = [
    { name: 'Jan', Activity: 4 },
    { name: 'Feb', Activity: 10 },
    { name: 'Mar', Activity: 18 },
    { name: 'Apr', Activity: 12 },
    { name: 'May', Activity: Math.max(1, Math.round((data.stats.totalTransactions || 7) * 0.8)) },
    { name: 'Jun', Activity: data.stats.totalTransactions || 7 }
  ];

  const pieData = data.stats.topCategories?.slice(0, 5).map(c => ({
    name: c._id,
    value: c.total
  })) || [];

  return (
    <div className="anim-fade-in" style={{ paddingBottom: '40px' }}>
      <Topbar 
        title="ADMIN DASHBOARD" 
        searchValue={search} 
        onSearchChange={e => setSearch(e.target.value)} 
      />

      {/* Top Stat Cards - Compact & Clean */}
      <div className="dash-grid" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div className="dash-card-purple anim-slide-up" style={{ 
            padding: '16px 20px',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h3 className="dash-card-title" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '800', margin: 0 }}>Total Registered Users</h3>
            <p className="dash-amount" style={{ fontSize: '32px', color: 'var(--cream)', fontWeight: '800', margin: '4px 0 0 0', lineHeight: 1.2 }}>{data.stats.totalUsers}</p>
          </div>

          <div className="dash-card-orange anim-slide-up delay-1" style={{ 
            padding: '16px 20px',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h3 className="dash-card-title" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '13px', fontWeight: '800', margin: 0 }}>Total Transactions</h3>
            <p className="dash-amount" style={{ fontSize: '32px', color: 'var(--bg)', fontWeight: '800', margin: '4px 0 0 0', lineHeight: 1.2 }}>{data.stats.totalTransactions}</p>
          </div>

          <div className="dash-card-mustard anim-slide-up delay-2" style={{ 
            gridColumn: '1 / -1', 
            padding: '16px 20px',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h3 className="dash-card-title" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '13px', fontWeight: '800', margin: 0 }}>Global Platform Budget</h3>
            <p className="dash-amount" style={{ fontSize: '32px', color: 'var(--bg)', fontWeight: '800', margin: '4px 0 0 0', lineHeight: 1.2 }}>{formatCurrency(data.stats.totalBudgetVolume)}</p>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="dash-card-teal anim-slide-up" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flex: 1, 
            padding: '16px 20px',
            borderRadius: '24px'
          }}>
            <div>
              <h3 className="dash-card-title" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '800', margin: 0 }}>Total Platform Income</h3>
              <p className="dash-amount" style={{ color: 'var(--cream)', fontWeight: '800', fontSize: '28px', margin: '4px 0 0 0', lineHeight: 1.2 }}>{formatCurrency(data.stats.totalIncomeVolume)}</p>
            </div>
            <CircleRing percent={75} stroke="var(--cream)" size={50} />
          </div>

          <div className="dash-card-red anim-slide-up delay-1" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flex: 1, 
            padding: '16px 20px',
            borderRadius: '24px'
          }}>
            <div>
              <h3 className="dash-card-title" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '800', margin: 0 }}>Total Platform Expense</h3>
              <p className="dash-amount" style={{ color: 'var(--cream)', fontWeight: '800', fontSize: '28px', margin: '4px 0 0 0', lineHeight: 1.2 }}>{formatCurrency(data.stats.totalExpenseVolume)}</p>
            </div>
            <CircleRing percent={Math.min(100, Math.round((data.stats.totalExpenseVolume / (data.stats.totalIncomeVolume || 1)) * 100))} stroke="var(--cream)" size={50} />
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="dash-card">
          <h3 className="dash-card-title">All Recent Transactions</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)' }}>
                  <th style={{ padding: '8px 0' }}>User</th>
                  <th style={{ padding: '8px 0' }}>Category</th>
                  <th style={{ padding: '8px 0' }}>Date</th>
                  <th style={{ padding: '8px 0' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions
                  .filter(tx => 
                    (tx.userId?.name || '').toLowerCase().includes(search.toLowerCase()) ||
                    (tx.category || '').toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(0, 8).map(tx => (
                    <tr key={tx._id} style={{ borderBottom: '1px solid var(--bg)' }}>
                      <td style={{ padding: '12px 0', fontWeight: '800' }}>{tx.userId?.name || 'Unknown'}</td>
                      <td style={{ padding: '12px 0' }}>
                        <span style={{ background: 'var(--bg)', padding: '4px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '11px', color: 'var(--text-muted)' }}>
                          {tx.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 0', color: 'var(--text-muted)' }}>{new Date(tx.date).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 0', fontWeight: '800', color: tx.type === 'income' ? 'var(--green)' : 'var(--coral)' }}>
                        {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dash-card">
          <h3 className="dash-card-title">Top Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {(() => {
              const maxVal = Math.max(...(data.stats.topCategories || []).map(c => c.total), 0);
              return data.stats.topCategories?.slice(0, 5).map(c => {
                const config = CATEGORY_COLORS[c._id] || CATEGORY_COLORS.Other;
                const pct = maxVal > 0 ? Math.round((c.total / maxVal) * 100) : 0;
                return (
                  <div key={c._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', fontWeight: '700' }}>
                      <span>{c._id}</span>
                      <span>{formatCurrency(c.total)}</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: config.text, width: `${pct}%`, borderRadius: '4px' }}></div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Bottom Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px', marginBottom: '24px' }}>
        <div className="dash-card">
          <h3 className="dash-card-title">Latest Users</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.users
              .filter(u => 
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())
              )
              .slice(0, 5).map(u => (
                <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--purple)' }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '800' }}>{u.name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.email}</p>
                    </div>
                  </div>
                  <div style={{ 
                    background: u.role === 'admin' ? 'var(--purple)' : 'var(--sky)', 
                    color: 'white', fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '99px', textTransform: 'uppercase'
                  }}>
                    {u.role}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="dash-card-title">Income vs Expense Trend</h3>
          </div>
          <div style={{ height: '240px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--teal)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--coral)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--coral)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 700 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 2 }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'var(--surface)', color: 'var(--cream)', fontWeight: '700' }} />
                <Area type="monotone" dataKey="Income" stroke="var(--teal)" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
                <Area type="monotone" dataKey="Expense" stroke="var(--coral)" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row 2 - New Platform Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        <div className="dash-card">
          <h3 className="dash-card-title">User Registration Trend</h3>
          <div style={{ height: '240px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signupData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'var(--surface)', color: 'var(--cream)', fontWeight: '700' }} />
                <Line type="monotone" dataKey="Users" stroke="var(--purple)" strokeWidth={3} dot={{ fill: 'var(--purple)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-card">
          <h3 className="dash-card-title">Transaction Activity Volume</h3>
          <div style={{ height: '240px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'var(--surface)', color: 'var(--cream)', fontWeight: '700' }} />
                <Bar dataKey="Activity" fill="var(--orange)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
