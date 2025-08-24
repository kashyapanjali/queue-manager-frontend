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
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        try {
          // Validate token with backend
          const res = await fetch(`${API_BASE}/auth/verify`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          
          if (res.ok) {
            const user = JSON.parse(userData);
            setUser(user);
            setIsLoggedIn(true);
            await loadQueues();
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // --- Load all queues ---
  const loadQueues = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/queues`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
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
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/queues`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
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
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/queues/${queue._id}/tokens`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
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
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/queues/${selectedQueue._id}/tokens`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ personName: newPersonName }),
      });
      const data = await res.json();
  
      if (Array.isArray(data)) {   
        setTokens(data);
        setSelectedQueue(prev => prev ? { ...prev, tokens: data } : prev);
        setQueues(prevQueues =>
          prevQueues.map(q =>
            q._id === selectedQueue._id ? { ...q, tokens: data } : q
          )
        );
      }
  
      setNewPersonName("");
    } catch (err) {
      console.error("Error adding token:", err);
    }
  };
  

  // --- Move token up/down ---
  const moveToken = async (tokenId, direction) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/queues/${selectedQueue._id}/tokens/${tokenId}/move`,
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ direction }),
        }
      );
      const data = await res.json();
      if (Array.isArray(data)) {   // backend returns an array
        setTokens(data);
        setSelectedQueue(prev => prev ? { ...prev, tokens: data } : prev);
        setQueues(prevQueues =>
          prevQueues.map(q =>
            q._id === selectedQueue._id ? { ...q, tokens: data } : q
          )
        );
      }
    } catch (err) {
      console.error("Error moving token:", err);
    }
  };
  

  // --- Assign top token ---
  const assignToken = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/queues/${selectedQueue._id}/assign`, { 
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (Array.isArray(data)) {   
        setTokens(data);
        setSelectedQueue(prev => prev ? { ...prev, tokens: data } : prev);
        setQueues(prevQueues =>
          prevQueues.map(q =>
            q._id === selectedQueue._id ? { ...q, tokens: data } : q
          )
        );
      }
    } catch (err) {
      console.error("Error assigning token:", err);
    }
  };

  // --- Cancel token ---
  const cancelToken = async (tokenId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/queues/${selectedQueue._id}/tokens/${tokenId}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (Array.isArray(data)) {   
        setTokens(data);
        setSelectedQueue(prev => prev ? { ...prev, tokens: data } : prev);
        setQueues(prevQueues =>
          prevQueues.map(q =>
            q._id === selectedQueue._id ? { ...q, tokens: data } : q
          )
        );
      }
    } catch (err) {
      console.error("Error cancelling token:", err);
    }
  };

  //complete the token--served
  const completeToken = async () => {
    if (!selectedQueue) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/queues/${selectedQueue._id}/complete`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setTokens(data);
        setSelectedQueue(prev => prev ? { ...prev, tokens: data } : prev);

        // Update queues state to refresh analytics
        setQueues(prevQueues =>
          prevQueues.map(q =>
            q._id === selectedQueue._id ? { ...q, tokens: data } : q
          )
        );
      }
    } catch (err) {
      console.error("Error completing token:", err);
    }
  };

  // --- Login handler ---
  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // Store user data and token in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    loadQueues();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setSelectedQueue(null);
    setQueues([]);
    setTokens([]);
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <div className="app-container">
      <Header activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />

      <div className="main-content">
          {activeView === "dashboard" ? (
            <Dashboard queues={queues} selectedQueue={selectedQueue} />
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
                tokens={Array.isArray(tokens) ? tokens : []} // safe mapping
                newPersonName={newPersonName}
                setNewPersonName={setNewPersonName}
                onAddToken={addToken}
                onMoveUp={(id) => moveToken(id, "up")}
                onMoveDown={(id) => moveToken(id, "down")}
                onAssignToken={assignToken}
                onCancelToken={cancelToken}
                onCompleteToken={completeToken}
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
