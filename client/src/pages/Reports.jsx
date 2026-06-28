import { useState, useEffect } from 'react';
import API from '../api/axios';
import PageHeader from '../components/PageHeader';
import Loader from '../components/Loader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';

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

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/reports?months=6');
        setData(res.data.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (!data) return <div className="empty-state">Failed to load reports</div>;

  const { monthlyTrends, expenseByCategory } = data;

  const barData = monthlyTrends.map(item => ({
    name: item._id, 
    Income: item.income,
    Expense: item.expense
  })).reverse();

  const pieData = expenseByCategory.map(item => ({
    name: item._id,
    value: item.total
  }));

  const totalIncome6M = barData.reduce((acc, curr) => acc + curr.Income, 0);
  const totalExpense6M = barData.reduce((acc, curr) => acc + curr.Expense, 0);
  const maxExpenseMonth = barData.reduce((prev, curr) => (prev.Expense > curr.Expense) ? prev : curr, {name: 'N/A', Expense: 0});
  const PIE_COLORS = ['var(--orange)', 'var(--purple)', 'var(--red)', 'var(--teal)', 'var(--mustard)'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--surface)', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 16px 32px rgba(0,0,0,0.5)' }}>
          <p style={{ fontWeight: '800', marginBottom: '12px', color: 'var(--cream)', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>{label}</p>
          {payload.map(entry => (
            <div key={entry.name} style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginBottom: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color }}></div>
                <span style={{ color: 'var(--muted)', fontWeight: '700', fontSize: '13px' }}>{entry.name}</span>
              </div>
              <span style={{ color: 'var(--cream)', fontWeight: '800', fontSize: '14px' }}>₹{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="anim-fade-in">
      <PageHeader title="Reports" subtitle="Analyze your spending habits." />

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        
        {/* Income vs Expense Card */}
        <div className="dash-card anim-slide-up" style={{ padding: '32px', borderRadius: '32px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(73, 139, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
              📊
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--cream)', margin: 0 }}>Income vs Expense</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={16}>
              <defs>
                <pattern id="diagonalHatchReports" patternUnits="userSpaceOnUse" width="8" height="8">
                  <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                </pattern>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12, fontWeight: 700, fontFamily: 'Quicksand' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12, fontWeight: 700, fontFamily: 'Quicksand' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar dataKey="Income" fill="var(--teal)" radius={[8, 8, 0, 0]} maxBarSize={24} />
              <Bar dataKey="Expense" fill="url(#diagonalHatchReports)" radius={[8, 8, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '700' }}>6-Month Income</p>
              <p style={{ color: 'var(--teal)', fontSize: '20px', fontWeight: '800' }}>₹{totalIncome6M.toLocaleString()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '700' }}>6-Month Expense</p>
              <p style={{ color: 'var(--red)', fontSize: '20px', fontWeight: '800' }}>₹{totalExpense6M.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Expense by Category Card */}
        <div className="dash-card anim-slide-up delay-1" style={{ padding: '32px', borderRadius: '32px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(234, 175, 54, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mustard)' }}>
              🍕
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--cream)', margin: 0 }}>Expense by Category</h3>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {pieData.length === 0 ? (
              <div className="empty-state" style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p>No expense data available.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie data={pieData} innerRadius={0} outerRadius={85} paddingAngle={2} dataKey="value" stroke="var(--surface)" strokeWidth={4} cornerRadius={0}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                <div style={{ width: '50%', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pieData.map((entry, index) => (
                    <div key={entry.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                        <span style={{ color: 'var(--cream)', fontSize: '14px', fontWeight: '700' }}>{entry.name}</span>
                      </div>
                      <span style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '800' }}>₹{entry.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trend Area Chart */}
      <div className="dash-card anim-slide-up delay-2" style={{ padding: '32px', borderRadius: '32px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(126, 128, 215, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple)' }}>
            📈
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--cream)', margin: 0 }}>Monthly Expense Trend</h3>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--orange)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--orange)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12, fontWeight: 700, fontFamily: 'Quicksand' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12, fontWeight: 700, fontFamily: 'Quicksand' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="Expense" stroke="var(--orange)" strokeWidth={4} fill="url(#colorExpense)" activeDot={<CustomActiveDot />} />
          </AreaChart>
        </ResponsiveContainer>
        
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(234, 175, 54, 0.1)', color: 'var(--mustard)', padding: '6px 12px', borderRadius: 'var(--r-pill)', fontSize: '12px', fontWeight: '800' }}>Insight</div>
          <p style={{ color: 'var(--cream)', fontSize: '14px', fontWeight: '600', margin: 0 }}>
            Your highest spending month in this period was <strong style={{ color: 'var(--mustard)' }}>{maxExpenseMonth.name}</strong> at <strong style={{ color: 'var(--mustard)' }}>₹{maxExpenseMonth.Expense.toLocaleString()}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
