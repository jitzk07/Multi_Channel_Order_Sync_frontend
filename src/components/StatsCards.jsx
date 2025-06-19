import React, { useEffect, useState } from 'react';
import { getStats } from '../services/api';

const StatsCards = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getStats();
      setStats(res.data);
    };
    fetchStats();
  }, []);

  const grouped = {};

  stats.forEach(({ _id, count }) => {
    const { channel, status } = _id;
    if (!grouped[channel]) grouped[channel] = {};
    grouped[channel][status] = count;
  });

  return (
    <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
      {Object.entries(grouped).map(([channel, statuses]) => (
        <div key={channel} className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold text-lg mb-2">{channel}</h3>
          <div className="flex justify-between">
            <span className="text-green-600">✅ Success: {statuses.success || 0}</span>
            <span className="text-red-600">❌ Failed: {statuses.failed || 0}</span>
            <span className="text-yellow-600">⏳ Pending: {statuses.pending || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
