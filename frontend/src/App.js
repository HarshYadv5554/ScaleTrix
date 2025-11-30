import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Sessions from './components/Sessions';
import Analytics from './components/Analytics';
import Recommendations from './components/Recommendations';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App">
      <header className="app-header">
        <h1>WhatsApp Quiz Bot - Admin Panel</h1>
        <p>Home Security Quiz Analytics & Management</p>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'sessions' ? 'active' : ''}
          onClick={() => setActiveTab('sessions')}
        >
          Sessions
        </button>
        <button
          className={activeTab === 'recommendations' ? 'active' : ''}
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </button>
        <button
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'sessions' && <Sessions />}
        {activeTab === 'recommendations' && <Recommendations />}
        {activeTab === 'analytics' && <Analytics />}
      </main>
    </div>
  );
}

export default App;

