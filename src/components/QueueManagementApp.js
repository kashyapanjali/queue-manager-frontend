import React, { useState } from 'react';
import Header from './Header';
import Login from './Login';
import QueueList from './QueueList';
import TokenManagement from './TokenManagement';
import EmptyState from './EmptyState';
import Dashboard from './Dashboard';
import '../App.css';

// Backend simulation
let queuesData = [];
let tokensData = [];
let analyticsData = [];
let currentUser = null;

const QueueManagementApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [activeView, setActiveView] = useState('queues');
  const [newQueueName, setNewQueueName] = useState('');
  const [newPersonName, setNewPersonName] = useState('');

  // Authentication
  const handleLogin = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if ((username === 'admin' && password === 'admin') || (users[username] && users[username] === password)) {
      currentUser = { id: Date.now(), username };
      setIsLoggedIn(true);
      loadQueues();
    } else {
      alert('Invalid credentials. Use admin/admin or sign up first.');
    }
  };

  const handleLogout = () => {
    currentUser = null;
    setIsLoggedIn(false);
    setSelectedQueue(null);
    setQueues([]);
    setTokens([]);
  };

  // Queue functions
  const loadQueues = () => setQueues([...queuesData]);
  const createQueue = () => {
    if (!newQueueName.trim()) return alert('Please enter a queue name');
    const newQueue = {
      id: Date.now(),
      name: newQueueName.trim(),
      createdAt: new Date(),
      managerId: currentUser.id
    };
    queuesData.push(newQueue);
    setQueues([...queuesData]);
    setNewQueueName('');
  };
  const selectQueue = (queue) => {
    setSelectedQueue(queue);
    loadTokens(queue.id);
  };

  // Token functions
  const loadTokens = (queueId) => {
    const queueTokens = tokensData.filter(
      token => token.queueId === queueId && token.status !== 'cancelled'
    );
    setTokens(queueTokens.sort((a, b) => a.position - b.position));
  };

  const addToken = () => {
    if (!newPersonName.trim()) return alert('Please enter a person name');
    const newToken = {
      id: Date.now(),
      queueId: selectedQueue.id,
      personName: newPersonName.trim(),
      position: tokens.length + 1,
      status: 'waiting',
      createdAt: new Date()
    };
    tokensData.push(newToken);
    loadTokens(selectedQueue.id);
    setNewPersonName('');

    analyticsData.push({
      queueId: selectedQueue.id,
      action: 'token_added',
      timestamp: new Date()
    });
  };

  const moveTokenUp = (tokenId) => {
    const tokenIndex = tokens.findIndex(t => t.id === tokenId);
    if (tokenIndex <= 0) return;
    const updatedTokens = [...tokens];
    [updatedTokens[tokenIndex], updatedTokens[tokenIndex - 1]] = [updatedTokens[tokenIndex - 1], updatedTokens[tokenIndex]];
    updatedTokens.forEach((token, index) => {
      token.position = index + 1;
      const tokenInData = tokensData.find(t => t.id === token.id);
      if (tokenInData) tokenInData.position = index + 1;
    });
    setTokens(updatedTokens);
  };

  const moveTokenDown = (tokenId) => {
    const tokenIndex = tokens.findIndex(t => t.id === tokenId);
    if (tokenIndex >= tokens.length - 1) return;
    const updatedTokens = [...tokens];
    [updatedTokens[tokenIndex], updatedTokens[tokenIndex + 1]] = [updatedTokens[tokenIndex + 1], updatedTokens[tokenIndex]];
    updatedTokens.forEach((token, index) => {
      token.position = index + 1;
      const tokenInData = tokensData.find(t => t.id === token.id);
      if (tokenInData) tokenInData.position = index + 1;
    });
    setTokens(updatedTokens);
  };

  const assignToken = () => {
    if (tokens.length === 0) return;
    const topToken = tokens[0];
    const tokenInData = tokensData.find(t => t.id === topToken.id);
    if (tokenInData) {
      tokenInData.status = 'served';
      tokenInData.servedAt = new Date();
    }
    analyticsData.push({
      queueId: selectedQueue.id,
      action: 'token_served',
      timestamp: new Date(),
      waitTime: (new Date() - topToken.createdAt) / 1000 / 60
    });
    loadTokens(selectedQueue.id);
  };

  const cancelToken = (tokenId) => {
    const tokenInData = tokensData.find(t => t.id === tokenId);
    if (tokenInData) tokenInData.status = 'cancelled';
    analyticsData.push({
      queueId: selectedQueue.id,
      action: 'token_cancelled',
      timestamp: new Date()
    });
    loadTokens(selectedQueue.id);
  };

  const getAnalytics = () => {
    const queueAnalytics = analyticsData.filter(a => selectedQueue ? a.queueId === selectedQueue.id : true);
    const avgWaitTime = queueAnalytics
      .filter(a => a.action === 'token_served' && a.waitTime)
      .reduce((sum, a) => sum + a.waitTime, 0) / 
      queueAnalytics.filter(a => a.action === 'token_served' && a.waitTime).length || 0;
    
    const totalTokensServed = queueAnalytics.filter(a => a.action === 'token_served').length;
    const currentQueueLength = selectedQueue ? tokens.length : 0;
    
    return {
      avgWaitTime: avgWaitTime.toFixed(1),
      totalTokensServed,
      currentQueueLength,
      totalQueues: queuesData.length
    };
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  const analytics = getAnalytics();

  return (
    <div className="app-container">
      <Header activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />

      <div className="main-content">
        {activeView === 'dashboard' ? (
          <Dashboard analytics={analytics} selectedQueue={selectedQueue} />
        ) : (
          <div className="grid-layout">
            <QueueList 
              queues={queues}
              selectedQueue={selectedQueue}
              onSelectQueue={selectQueue}
              newQueueName={newQueueName}
              setNewQueueName={setNewQueueName}
              onCreateQueue={createQueue}
            />
            {selectedQueue ? (
              <TokenManagement
                selectedQueue={selectedQueue}
                tokens={tokens}
                newPersonName={newPersonName}
                setNewPersonName={setNewPersonName}
                onAddToken={addToken}
                onMoveUp={moveTokenUp}
                onMoveDown={moveTokenDown}
                onAssignToken={assignToken}
                onCancelToken={cancelToken}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueManagementApp;
