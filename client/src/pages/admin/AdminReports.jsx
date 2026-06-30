import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Topbar from '../../components/Topbar';
import Loader from '../../components/Loader';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid 
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import { ArrowDownLeft, ArrowUpRight, Users, Wallet, Receipt } from 'lucide-react';

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const statsRes = await API.get('/admin/stats');
        setData(statsRes.data.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (!data) return <div className="empty-state">Failed to load platform reports</div>;

  // Format data for Recharts
  const trendData = (data.monthlyTrends || []).map(item => ({
    name: item._id, 
    Income: item.income, 
    Expense: item.expense
  })).reverse();

  const pieData = (data.topCategories || []).map(item => ({
    name: item._id,
    value: item.total
  }));

  // Clean colors for Pie Chart segments based on categoryConfig or defaults
  const COLORS = ['#7E80D7', '#E76D82', '#498B81', '#EAAF36', '#FFA264'];

  return (
    <div className="anim-fade-in">
      <Topbar title="PLATFORM REPORTS" />

      {/* Overview Cards */}
      <div className="grid-4" style={{ marginBottom: '24px', marginTop: '24px' }}>
        <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(126, 128, 215, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} color="var(--purple)" />
          </div>
          <div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '700' }}>Platform Users</p>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--cream)' }}>{data.totalUsers}</h3>
          </div>
        </div>

        <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(73, 139, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowUpRight size={24} color="var(--teal)" />
          </div>
          <div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '700' }}>Total Income Volume</p>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--teal)' }}>{formatCurrency(data.totalIncomeVolume)}</h3>
          </div>
        </div>

        <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(231, 109, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowDownLeft size={24} color="var(--red)" />
          </div>
          <div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '700' }}>Total Expense Volume</p>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--red)' }}>{formatCurrency(data.totalExpenseVolume)}</h3>
          </div>
        </div>

        <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(234, 175, 54, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={24} color="var(--mustard)" />
          </div>
          <div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '700' }}>Total Budget Caps</p>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--mustard)' }}>{formatCurrency(data.totalBudgetVolume)}</h3>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="dash-grid" style={{ marginBottom: '24px' }}>
        
        {/* Line Chart: Monthly Trends */}
        <div className="dash-card" style={{ minHeight: '380px' }}>
          <h3 className="dash-card-title" style={{ color: 'var(--cream)', marginBottom: '24px' }}>
            Monthly Income vs Expense Trend
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={val => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px' }}
                  labelStyle={{ fontWeight: '800', color: 'var(--cream)' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" dataKey="Income" stroke="var(--teal)" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Expense" stroke="var(--red)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Top Expense Categories */}
        <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
          <h3 className="dash-card-title" style={{ color: 'var(--cream)', marginBottom: '16px' }}>
            Expense share by Category
          </h3>
          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={val => formatCurrency(val)}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Pie Chart Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
            {pieData.map((item, idx) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span style={{ fontWeight: '700', color: 'var(--cream)' }}>{item.name}</span>
                </div>
                <span style={{ color: 'var(--muted)', fontWeight: '600' }}>{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminReports;
