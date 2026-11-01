import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = (e) => {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = existingUsers.some((u) => u.email === email);
    if (userExists) {
      setError('Yeh email pehle se registered hai!');
      return;
    }

    const newAccount = {
      id: Date.now(),
      name,
      email,
      password,
      balance: Number(initialDeposit) || 0,
      transactions: [
        {
          id: Date.now(),
          type: 'Deposit',
          amount: Number(initialDeposit) || 0,
          date: new Date().toLocaleDateString(),
        },
      ],
    };

    existingUsers.push(newAccount);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    alert('Account successfully create ho gaya! Ab aap login kar sakti hain.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create New Bank Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Amna Irfan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Set Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Initial Deposit Balance (PKR)</label>
            <input
              type="number"
              required
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 5000"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold"
          >
            Create Account Now
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};
export default CreateAccount;