import React, { useState, useEffect } from "react";
import Header from "./Header";
import Login from "./Login";
import QueueList from "./QueueList";
import TokenManagement from "./TokenManagement";
import EmptyState from "./EmptyState";
import Dashboard from "./Dashboard";

const API_BASE = "http://localhost:5000/api";

const QueueManagementApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [activeView, setActiveView] = useState("queues");
  const [newQueueName, setNewQueueName] = useState("");
  const [newPersonName, setNewPersonName] = useState("");

  // --- Load all queues ---
  const loadQueues = async () => {
    try {
      const res = await fetch(`${API_BASE}/queues`);
      const data = await res.json();
      setQueues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading queues:", err);
    }
  };

  // --- Create queue ---
  const createQueue = async () => {
    if (!newQueueName.trim()) return alert("Enter queue name");
    try {
      const res = await fetch(`${API_BASE}/queues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newQueueName }),
      });
      const data = await res.json();
      setQueues(prev => [...prev, data]);
      setNewQueueName("");
    } catch (err) {
      console.error("Error creating queue:", err);
    }
  };

  // --- Select queue ---
  const selectQueue = async (queue) => {
    setSelectedQueue(queue);
    try {
      const res = await fetch(`${API_BASE}/queues/${queue._id}/tokens`);
      const data = await res.json();
      setTokens(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tokens:", err);
      setTokens([]);
    }
  };

  // --- Add token ---
  const addToken = async () => {
    if (!newPersonName.trim()) return alert("Enter person name");
    try {
      const res = await fetch(`${API_BASE}/queues/${selectedQueue._id}/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personName: newPersonName }),
      });
      const data = await res.json();
  
      if (Array.isArray(data)) {   
        setTokens(data);
        setSelectedQueue((prev) => prev ? { ...prev, tokens: data } : prev);
      }
  
      setNewPersonName("");
    } catch (err) {
      console.error("Error adding token:", err);
    }
  };
  

  // --- Move token up/down ---
  const moveToken = async (tokenId, direction) => {
    try {
      const res = await fetch(
        `${API_BASE}/queues/${selectedQueue._id}/tokens/${tokenId}/move`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ direction }),
        }
      );
      const data = await res.json();
      if (Array.isArray(data)) {   // backend returns an array
        setTokens(data);
        setSelectedQueue((prev) => prev ? { ...prev, tokens: data } : prev);
      }
    } catch (err) {
      console.error("Error moving token:", err);
    }
  };
  

  // --- Assign top token ---
  const assignToken = async () => {
    try {
      const res = await fetch(`${API_BASE}/queues/${selectedQueue._id}/assign`, { method: "PUT" });
      const data = await res.json();

      if (Array.isArray(data)) {   
        setTokens(data);
        setSelectedQueue((prev) => prev ? { ...prev, tokens: data } : prev);
      }
    } catch (err) {
      console.error("Error assigning token:", err);
    }
  };

  // --- Cancel token ---
  const cancelToken = async (tokenId) => {
    try {
      const res = await fetch(`${API_BASE}/queues/${selectedQueue._id}/tokens/${tokenId}`, { method: "DELETE" });
      const data = await res.json();

      if (Array.isArray(data)) {   
        setTokens(data);
        setSelectedQueue((prev) => prev ? { ...prev, tokens: data } : prev);
      }
    } catch (err) {
      console.error("Error cancelling token:", err);
    }
  };

  // --- Login handler ---
  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    loadQueues();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setSelectedQueue(null);
    setQueues([]);
    setTokens([]);
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <div className="app-container">
      <Header activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />

      <div className="main-content">
        {activeView === "dashboard" ? (
          <Dashboard analytics={{}} selectedQueue={selectedQueue} />
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
                tokens={Array.isArray(tokens) ? tokens : []} // ✅ safe mapping
                newPersonName={newPersonName}
                setNewPersonName={setNewPersonName}
                onAddToken={addToken}
                onMoveUp={(id) => moveToken(id, "up")}
                onMoveDown={(id) => moveToken(id, "down")}
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
