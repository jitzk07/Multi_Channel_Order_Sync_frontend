/* eslint-disable no-unused-vars */
import { syncOrders } from '../services/api';
import toast from 'react-hot-toast';
import { FaSync } from 'react-icons/fa';

const SyncButton = ({ channel, onSyncComplete }) => {
  const handleSync = async () => {
    try {
      toast.loading(`Syncing ${channel} orders...`, { id: 'sync' });
      const res = await syncOrders(channel);
      toast.success(`Synced ${res.data.data.length} ${channel} orders`, { id: 'sync' }, { duration: 5000 });
      onSyncComplete(); 
    } catch (err) {
      toast.error(`Failed to sync ${channel}`, { id: 'sync' });
    }
  };

  return (
    <button
      onClick={handleSync}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
    >
      <FaSync />
      Sync {channel}
    </button>
  );
};

export default SyncButton;
