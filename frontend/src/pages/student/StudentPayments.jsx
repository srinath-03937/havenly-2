import { useState, useEffect } from 'react';
import { Loader, CreditCard, Check } from 'lucide-react';
import { studentAPI } from '../../utils/api';

const StudentPayments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayTransaction = async (id) => {
    try {
      setPayingId(id);
      // Simulate payment processing
      setTimeout(async () => {
        try {
          await studentAPI.payTransaction(id);
          await fetchTransactions();
          alert('Payment successful!');
        } catch (error) {
          alert('Error processing payment: ' + error.message);
        } finally {
          setPayingId(null);
        }
      }, 1500);
    } catch (error) {
      setPayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  const pendingTransactions = transactions.filter(t => t.status === 'Pending');
  const paidTransactions = transactions.filter(t => t.status === 'Paid');
  const overdueTransactions = transactions.filter(t => {
    if (t.status !== 'Pending') return false;
    const dueDate = new Date(t.due_date);
    return dueDate < new Date();
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Payments & Dues</h1>
        <p className="text-slate-600 mt-2">Manage your hostel fee payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-sm text-slate-600 mb-2">Total Payments</p>
          <p className="text-3xl font-bold text-slate-900">₹{transactions.reduce((sum, t) => sum + t.amount, 0)}</p>
        </div>
        <div className="card border-2 border-red-200 bg-red-50">
          <p className="text-sm text-slate-600 mb-2">Pending Dues</p>
          <p className="text-3xl font-bold text-red-600">
            ₹{pendingTransactions.reduce((sum, t) => sum + t.amount, 0)}
          </p>
        </div>
        <div className="card border-2 border-orange-200 bg-orange-50">
          <p className="text-sm text-slate-600 mb-2">Overdue</p>
          <p className="text-3xl font-bold text-orange-600">
            ₹{overdueTransactions.reduce((sum, t) => sum + t.amount, 0)}
          </p>
        </div>
        <div className="card border-2 border-green-200 bg-green-50">
          <p className="text-sm text-slate-600 mb-2">Amount Paid</p>
          <p className="text-3xl font-bold text-green-600">
            ₹{paidTransactions.reduce((sum, t) => sum + t.amount, 0)}
          </p>
        </div>
      </div>

      {/* Pending Dues */}
      {pendingTransactions.length > 0 && (
        <div className="card border-2 border-red-200 bg-red-50">
          <h2 className="text-2xl font-bold text-red-900 mb-6">Outstanding Dues</h2>

          <div className="space-y-3">
            {pendingTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{transaction.month}</p>
                  <p className="text-sm text-slate-600">
                    {transaction.room_id?.room_number ? `Room ${transaction.room_id.room_number}` : 'N/A'}
                  </p>
                  {transaction.due_date && (
                    <p className="text-xs text-slate-500">
                      Due: {new Date(transaction.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right mr-4">
                  <p className="font-bold text-red-600">₹{transaction.amount}</p>
                  <p className="text-xs text-slate-600">
                    {(transaction.date && (transaction.date.toDate ? transaction.date.toDate() : new Date(transaction.date))).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handlePayTransaction(transaction.id)}
                  disabled={payingId === transaction.id}
                  className={`px-4 py-2 rounded-lg font-medium transition flex items-center space-x-2 ${
                    payingId === transaction.id
                      ? 'bg-slate-300 text-slate-700 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {payingId === transaction.id ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      <span>Pay Now</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment History</h2>

        {paidTransactions.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No payments made yet</p>
        ) : (
          <div className="space-y-2 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Month</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Room</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Paid On</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {paidTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{transaction.month}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {transaction.room_id?.room_number ? `Room ${transaction.room_id.room_number}` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">₹{transaction.amount}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {transaction.paidDate ? new Date(transaction.paidDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge badge-paid">
                        <Check size={14} className="mr-1" />
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPayments;
