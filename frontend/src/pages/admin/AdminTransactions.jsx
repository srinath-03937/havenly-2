import { useState, useEffect } from 'react';
import { Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [roomTransactions, setRoomTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'byRoom'
  const [expandedRooms, setExpandedRooms] = useState([]);

  useEffect(() => {
    fetchData();
  }, [viewMode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (viewMode === 'all') {
        const response = await adminAPI.getTransactions();
        setTransactions(response.data);
      } else {
        const response = await adminAPI.getTransactionsByRoom();
        setRoomTransactions(response.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRoom = (roomId) => {
    setExpandedRooms(
      expandedRooms.includes(roomId)
        ? expandedRooms.filter(id => id !== roomId)
        : [...expandedRooms, roomId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Financial Management</h1>
          <p className="text-slate-600 mt-2">Track and manage all financial transactions</p>
        </div>
      </div>

      {/* Toggle View */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="view"
            value="all"
            checked={viewMode === 'all'}
            onChange={(e) => setViewMode(e.target.value)}
            className="w-4 h-4"
          />
          <span className="font-medium text-slate-900">All Transactions</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="view"
            value="byRoom"
            checked={viewMode === 'byRoom'}
            onChange={(e) => setViewMode(e.target.value)}
            className="w-4 h-4"
          />
          <span className="font-medium text-slate-900">View by Room</span>
        </label>
      </div>

      {/* All Transactions View */}
      {viewMode === 'all' && (
        <div className="card overflow-x-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">All Transactions</h2>

          {transactions.length === 0 ? (
            <p className="text-slate-600 text-center py-8">No transactions found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Room</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Month</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {transaction.user_id?.name || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {transaction.room_id?.room_number || 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      ₹{transaction.amount}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{transaction.month}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${
                        transaction.status === 'Paid' ? 'badge-paid' : 'badge-pending-due'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* View by Room */}
      {viewMode === 'byRoom' && (
        <div className="space-y-4">
          {roomTransactions.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-slate-600 text-lg">No rooms found</p>
            </div>
          ) : (
            roomTransactions.map((roomData) => (
              <div key={roomData.room.id} className="card border-l-4 border-indigo-600">
                <button
                  onClick={() => toggleRoom(roomData.room.id)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900">
                      Room {roomData.room.room_number} - Wing {roomData.room.wing}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {roomData.room.type} • ₹{roomData.room.price}/month
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">Total Pending Dues</p>
                      <p className="text-2xl font-bold text-red-600">₹{roomData.totalDues}</p>
                    </div>
                    {expandedRooms.includes(roomData.room.id) ? (
                      <ChevronUp className="text-indigo-600" size={24} />
                    ) : (
                      <ChevronDown className="text-slate-400" size={24} />
                    )}
                  </div>
                </button>

                {expandedRooms.includes(roomData.room.id) && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    {roomData.transactions.length === 0 ? (
                      <p className="text-slate-600 text-center py-4">No transactions for this room</p>
                    ) : (
                      <div className="space-y-3">
                        {roomData.transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-slate-900">
                                {transaction.user_id?.name}
                              </p>
                              <p className="text-sm text-slate-600">
                                {transaction.month}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">₹{transaction.amount}</p>
                              <span className={`badge text-xs inline-block ${
                                transaction.status === 'Paid' ? 'badge-paid' : 'badge-pending-due'
                              }`}>
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
