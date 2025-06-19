/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import SyncButton from './components/SyncButton';
import DashboardChart from './components/DashboardChart';
import { getOrders, retryOrder } from './services/api';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';


const App = () => {
  const [orders, setOrders] = useState([]);
  const [showFailedOnly, setShowFailedOnly] = useState(false);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('all');

  const fetchOrders = useCallback(async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    }
  }, []);


  // Fetch once on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Fetch every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 120000);

    return () => clearInterval(interval);
  }, [fetchOrders]);



  const filteredOrders = orders.filter((order) => {
    const matchesFailed = showFailedOnly ? order.status === 'failed' : true;
    const matchesPending = showPendingOnly ? order.status === 'pending' : true;

    // Ensure only one filter (failed or pending) is active at a time
    const statusMatch =
      showFailedOnly ? matchesFailed :
        showPendingOnly ? matchesPending :
          true;

    const matchesChannel = selectedChannel === 'all' ? true : order.channel === selectedChannel;

    return statusMatch && matchesChannel;
  });


  const uniqueChannels = [...new Set(orders.map((o) => o.channel))];

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center mb-4 text-blue-900">
        🧾 Multi-Channel Order Sync Tracker
      </h1>

      {/* Top Sync Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <SyncButton channel="shopify" onSyncComplete={fetchOrders} />
        <SyncButton channel="amazon" onSyncComplete={fetchOrders} />
        <SyncButton channel="flipkart" onSyncComplete={fetchOrders} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Table Section */}
        <div className="lg:w-3/5 bg-white p-4 rounded-xl shadow-lg">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-xl font-semibold text-blue-800">Synced Orders</h2>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:items-center">
              {/* Show All Orders */}
              <button
                onClick={() => {
                  setShowFailedOnly(false);
                  setShowPendingOnly(false);
                }}
                disabled={!showFailedOnly && !showPendingOnly}
                className={`text-sm px-3 py-1 rounded w-full sm:w-auto ${!showFailedOnly && !showPendingOnly
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                Show All Orders
              </button>

              {/* Show Pending Orders */}
              <button
                onClick={() => {
                  setShowPendingOnly(true);
                  setShowFailedOnly(false);
                }}
                disabled={showPendingOnly}
                className={`text-sm px-3 py-1 rounded w-full sm:w-auto ${showPendingOnly
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
              >
                Show Pending Orders
              </button>

              {/* Show Failed Orders */}
              <button
                onClick={() => {
                  setShowFailedOnly(true);
                  setShowPendingOnly(false);
                }}
                disabled={showFailedOnly}
                className={`text-sm px-3 py-1 rounded w-full sm:w-auto ${showFailedOnly
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
              >
                Show Failed Orders
              </button>

              {/* Channel Filter Dropdown */}
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="text-sm px-2 py-1 border rounded text-blue-800 w-full sm:w-auto"
              >
                <option value="all">All Channels</option>
                {uniqueChannels.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
            </div>
          </div>


          <div className="max-h-[400px] overflow-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-blue-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 border text-left text-blue-900">Channel</th>
                  <th className="p-3 border text-left text-blue-900">Order ID</th>
                  <th className="p-3 border text-left text-blue-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="text-left hover:bg-blue-50 transition-all"
                  >
                    <td className="border p-3">{order.channel}</td>
                    <td className="border p-3">{order.orderId}</td>
                    <td className="border p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-white text-xs ${order.status === 'success'
                            ? 'bg-green-400'
                            : order.status === 'failed'
                              ? 'bg-red-400'
                              : 'bg-yellow-400'
                            }`}
                        >
                          {order.status}
                        </span>
                        {order.status === 'failed' && (
                          <button
                            onClick={async () => {
                              try {
                                toast.loading('Retrying...', { id: 'retry' });
                                await retryOrder(order.orderId);
                                toast.success('Retry successful', { id: 'retry' });
                                fetchOrders();
                              } catch (err) {
                                toast.error('Retry failed', { id: 'retry' });
                              }
                            }}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                          >
                            Retry
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 p-4">
                      No orders to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Chart Section */}
        <div className="lg:w-2/5 bg-white rounded-xl shadow-lg p-4">
          <DashboardChart data={orders} />
        </div>
      </div>
      <Toaster position="top-right" />
    </div>

  );
};

export default App;
