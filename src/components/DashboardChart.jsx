import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = {
  success: '#60A5FA', // Blue
  failed: '#F87171',  // Red
  pending: '#FBBF24', // Yellow
};

const DashboardChart = ({ data }) => {
  const grouped = data.reduce((acc, order) => {
    const { channel, status } = order;
    if (!acc[channel]) acc[channel] = { channel }; 
    acc[channel][status] = (acc[channel][status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.values(grouped);

  return (
    <div className="w-full h-80 p-4">
      <h3 className="text-lg font-semibold mb-2 text-blue-800">Order Status by Channel</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="channel" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="success" stackId="a" fill={COLORS.success} />
          <Bar dataKey="failed" stackId="a" fill={COLORS.failed} />
          <Bar dataKey="pending" stackId="a" fill={COLORS.pending} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
