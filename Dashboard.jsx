import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState('deposit');
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Please log in to access your dashboard.</h2>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleTransaction = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      setMessage({ type: 'error', text: 'Kripya sahi amount enter karein!' });
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex((u) => u.email === currentUser.email);

    if (userIndex === -1) {
      setMessage({ type: 'error', text: 'User nahi mila!' });
      return;
    }

    let currentBalance = Number(users[userIndex].balance) || 0;
    let transactions = users[userIndex].transactions || [];

    if (activeTab === 'withdraw' && numAmount > currentBalance) {
      setMessage({ type: 'error', text: 'Insufficient Balance! Aapke account mein itne paise nahi hain.' });
      return;
    }

    const newBalance = activeTab === 'deposit' ? currentBalance + numAmount : currentBalance - numAmount;

    const newTransaction = {
      id: Date.now(),
      type: activeTab === 'deposit' ? 'Deposit' : 'Withdraw',
      amount: numAmount,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
    };

    users[userIndex].balance = newBalance;
    users[userIndex].transactions = [newTransaction, ...transactions];

    // Save in LocalStorage & Context
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

    // Page state refresh karne ke liye page reload kar dein
    setMessage({
      type: 'success',
      text: `Successfully ${activeTab === 'deposit' ? 'Deposited' : 'Withdrawn'} PKR ${numAmount}!`,
    });
    setAmount('');
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-wide">DIGITAL BANK</h1>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-sm bg-blue-800 px-3 py-1 rounded-full text-blue-200">
              User: <strong className="text-white">{currentUser.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm font-medium">Account Holder</p>
            <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
            <p className="text-xs text-gray-400">{currentUser.email}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm font-medium">Total Balance</p>
            <h2 className="text-3xl font-extrabold text-blue-900">
              PKR {Number(currentUser.balance || 0).toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Action Panel: Deposit & Withdraw */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex space-x-4 border-b pb-4 mb-4">
            <button
              onClick={() => { setActiveTab('deposit'); setMessage({ type: '', text: '' }); }}
              className={`px-4 py-2 font-semibold rounded-md transition ${
                activeTab === 'deposit'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Deposit Money
            </button>
            <button
              onClick={() => { setActiveTab('withdraw'); setMessage({ type: '', text: '' }); }}
              className={`px-4 py-2 font-semibold rounded-md transition ${
                activeTab === 'withdraw'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Withdraw Money
            </button>
          </div>

          {message.text && (
            <div
              className={`p-3 rounded mb-4 text-sm ${
                message.type === 'error'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleTransaction} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Amount to {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'} (PKR)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2.5 rounded-md text-white font-semibold transition ${
                activeTab === 'deposit'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {activeTab === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdraw'}
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Transaction History</h3>
          {!currentUser.transactions || currentUser.transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">Abhi tak koi transaction nahi hui.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {currentUser.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            tx.type === 'Deposit'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-gray-800">
                        PKR {tx.amount.toLocaleString()}
                      </td>
                      <td className="p-3 text-gray-500">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;