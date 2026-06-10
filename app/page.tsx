'use client';
import { useState } from 'react';
import Dashboard from './dashboard/Dashboard';

export default function Home() {
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <Dashboard username={username} />;

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
        <div className="text-5xl mb-4">⚽</div>
        <h1 className="text-white text-3xl font-bold mb-2">World Cup Tracker</h1>
        <p className="text-gray-400 mb-6">Enter your username to get started</p>
        <input
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && username.trim() && setSubmitted(true)}
          className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 outline-none mb-4"
        />
        <button
          onClick={() => username.trim() && setSubmitted(true)}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition"
        >
          Let's Go!
        </button>
      </div>
    </main>
  );
}