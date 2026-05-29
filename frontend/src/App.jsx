import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://laag-backend.onrender.com';

export default function App() {
  // Toggle visibility of the main card
  const [showCard, setShowCard] = useState(false);

  // Nickname (simple user identity – stored in localStorage)
  const [nickname, setNickname] = useState(() => localStorage.getItem('laag_nickname') || '');
  const [tempNickname, setTempNickname] = useState('');

  // Room Sync States
  const [roomCode, setRoomCode] = useState(() => localStorage.getItem('laag_room_code') || 'laag-squad');
  const [tempRoomCode, setTempRoomCode] = useState(() => localStorage.getItem('laag_room_code') || 'laag-squad');
  const [isSyncingLive, setIsSyncingLive] = useState(false);

  // Active users in the room
  const [activeUsers, setActiveUsers] = useState([]);

  // Laag Details States
  const [laagDate, setLaagDate] = useState(() => localStorage.getItem('laag_date') || 'Saturday');
  const [participants, setParticipants] = useState(() => localStorage.getItem('laag_participants') || 'murag 5 persons haha');
  const [service, setService] = useState(() => localStorage.getItem('laag_service') || '3 motors');
  const [meetupArea, setMeetupArea] = useState(() => localStorage.getItem('laag_meetup_area') || 'TBA HAHA');
  const [meetupTime, setMeetupTime] = useState(() => localStorage.getItem('laag_meetup_time') || '8:00 AM – Meet up daw forsure 9 nasad ka abot haha');

  // Food Items List
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('laag_foods_crud_v2');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'JERALD -LECHON MANOK TUNGA HAHA' },
      { id: '2', text: 'Pork Liempo for sinugba' },
      { id: '3', text: 'Puso (Hanging Rice) - 20 pcs' },
      { id: '4', text: 'Softdrinks & Mineral Water' },
      { id: '5', text: 'Charcoal (Uling)' }
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingVal, setEditingVal] = useState('');
  const [addedItemId, setAddedItemId] = useState(null);

  // Local sync to fallback storage on changes
  useEffect(() => {
    if (!roomCode) {
      localStorage.setItem('laag_date', laagDate);
      localStorage.setItem('laag_participants', participants);
      localStorage.setItem('laag_service', service);
      localStorage.setItem('laag_meetup_area', meetupArea);
      localStorage.setItem('laag_meetup_time', meetupTime);
    }
  }, [laagDate, participants, service, meetupArea, meetupTime, roomCode]);

  useEffect(() => {
    if (!roomCode) {
      localStorage.setItem('laag_foods_crud_v2', JSON.stringify(items));
    }
  }, [items, roomCode]);

  // DATABASE SYNC MANAGER
  useEffect(() => {
    if (!roomCode) {
      setIsSyncingLive(false);
      setActiveUsers([]);
      // Re-load offline cache values when disconnecting
      setLaagDate(localStorage.getItem('laag_date') || 'Saturday');
      setParticipants(localStorage.getItem('laag_participants') || 'murag 5 persons haha');
      setService(localStorage.getItem('laag_service') || '3 motors');
      setMeetupArea(localStorage.getItem('laag_meetup_area') || 'TBA HAHA');
      setMeetupTime(localStorage.getItem('laag_meetup_time') || '8:00 AM – Meet up daw forsure 9 nasad ka abot haha');
      const savedFoods = localStorage.getItem('laag_foods_crud_v2');
      if (savedFoods) setItems(JSON.parse(savedFoods));
      return;
    }

    let isMounted = true;

    // Fetch initial database room details
    const initRoomSync = async () => {
      try {
        const response = await fetch(`${API_URL}/api/rooms/${roomCode}/`);
        if (!isMounted) return;

        if (response.status === 200) {
          const data = await response.json();
          setLaagDate(data.laag_date);
          setParticipants(data.participants);
          setService(data.service);
          setMeetupArea(data.meetup_area);
          setMeetupTime(data.meetup_time);
          setItems(data.food_items || []);
          setActiveUsers(data.active_users || []);
          setIsSyncingLive(true);
        } else if (response.status === 404) {
          // Room not found, create new room entry with current on-screen states
          const createResponse = await fetch(`${API_URL}/api/rooms/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              room_code: roomCode,
              laag_date: laagDate,
              participants: participants,
              service: service,
              meetup_area: meetupArea,
              meetup_time: meetupTime,
              food_items: items
            })
          });
          
          if (!isMounted) return;
          if (createResponse.ok) {
            setIsSyncingLive(true);
          } else {
            console.error('Failed to create new room in Django backend');
            setIsSyncingLive(false);
          }
        } else {
          console.error('Failed to connect to room in Django backend');
          setIsSyncingLive(false);
        }
      } catch (error) {
        console.error('Failed to connect to Django backend:', error);
        if (isMounted) setIsSyncingLive(false);
      }
    };

    initRoomSync();

    // Polling for live updates from other users
    const pollInterval = setInterval(() => {
      if (isMounted) {
        fetch(`${API_URL}/api/rooms/${roomCode}/`)
          .then(res => {
            if (res.status === 200) return res.json();
            throw new Error('Room not found or server error');
          })
          .then(data => {
            if (!isMounted) return;
            setLaagDate(data.laag_date);
            setParticipants(data.participants);
            setService(data.service);
            setMeetupArea(data.meetup_area);
            setMeetupTime(data.meetup_time);
            setActiveUsers(data.active_users || []);
            setIsSyncingLive(true);
            
            const newFoodList = data.food_items || [];
            setItems(prevItems => {
              if (JSON.stringify(prevItems) !== JSON.stringify(newFoodList)) {
                const prevIds = prevItems.map(i => i.id);
                const addedItem = newFoodList.find(i => !prevIds.includes(i.id));
                if (addedItem) {
                   setAddedItemId(addedItem.id);
                   setTimeout(() => setAddedItemId(null), 1000);
                }
                return newFoodList;
              }
              return prevItems;
            });
          })
          .catch(err => {
            console.warn('Polling status info:', err.message);
            if (isMounted) setIsSyncingLive(false);
          });
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [roomCode]);

  // HEARTBEAT: Send nickname + room_code every 10 seconds to keep user "active"
  useEffect(() => {
    if (!roomCode || !nickname) return;

    const sendHeartbeat = () => {
      fetch(`${API_URL}/api/rooms/heartbeat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_code: roomCode, nickname })
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setActiveUsers(data.active_users || []);
        })
        .catch(err => console.warn('Heartbeat error:', err.message));
    };

    // Send immediately on connect
    sendHeartbeat();
    const heartbeatInterval = setInterval(sendHeartbeat, 10000);

    return () => clearInterval(heartbeatInterval);
  }, [roomCode, nickname]);

  // Push single update parameter to DB
  const syncToDB = async (fieldsToUpdate) => {
    if (!roomCode) return;
    try {
      await fetch(`${API_URL}/api/rooms/${roomCode}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldsToUpdate)
      });
    } catch (error) {
      console.error('Failed to sync changes to Django:', error);
    }
  };

  // Save nickname
  const handleSetNickname = (e) => {
    e.preventDefault();
    const name = tempNickname.trim();
    if (!name) return;
    setNickname(name);
    localStorage.setItem('laag_nickname', name);
  };

  const handleChangeNickname = () => {
    setNickname('');
    setTempNickname('');
    localStorage.removeItem('laag_nickname');
  };

  const handleConnectRoom = (e) => {
    e.preventDefault();
    const code = tempRoomCode.trim();
    if (!code) return;
    setRoomCode(code);
    localStorage.setItem('laag_room_code', code);
  };

  const handleDisconnectRoom = () => {
    setRoomCode('');
    setTempRoomCode('');
    localStorage.removeItem('laag_room_code');
  };

  // Create Item
  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const newId = `food_${Date.now()}`;
    const newItem = { 
      id: newId, 
      text: inputVal.trim(),
      addedBy: nickname || 'Anon'
    };
    const updatedItems = [...items, newItem];
    
    setItems(updatedItems);
    setAddedItemId(newId);
    setInputVal('');

    if (roomCode) {
      syncToDB({ food_items: updatedItems });
    }

    setTimeout(() => {
      setAddedItemId(null);
    }, 1000);
  };

  // Delete Item
  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Delete this item?');
    if (confirmDelete) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      if (roomCode) {
        syncToDB({ food_items: updatedItems });
      }
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  // Update - start
  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditingVal(item.text);
  };

  // Update - save
  const handleSaveEdit = (e, id) => {
    e.preventDefault();
    if (!editingVal.trim()) return;
    const updatedItems = items.map(item => item.id === id ? { ...item, text: editingVal.trim() } : item);
    setItems(updatedItems);
    if (roomCode) {
      syncToDB({ food_items: updatedItems });
    }
    setEditingId(null);
  };

  // Inline details sync triggers
  const handleDetailChange = (field, val, dbField) => {
    if (field === 'date') setLaagDate(val);
    if (field === 'participants') setParticipants(val);
    if (field === 'service') setService(val);
    if (field === 'area') setMeetupArea(val);
    if (field === 'time') setMeetupTime(val);

    if (roomCode) {
      syncToDB({ [dbField]: val });
    }
  };

  // ── NICKNAME PROMPT SCREEN ──
  if (!nickname) {
    return (
      <div className="app-viewport">
        <div className="landing-screen">
          <div className="nickname-prompt animate-scale-up">
            <h2 className="nickname-title">👋 Unsa imong nickname?</h2>
            <p className="nickname-sub">Enter your name para makita ka sa ubang users sa room.</p>
            <form onSubmit={handleSetNickname} className="nickname-form">
              <input
                type="text"
                className="nickname-input"
                placeholder="e.g. Jerald, Bossing, Kuya J..."
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value)}
                autoFocus
                maxLength={30}
              />
              <button type="submit" className="nickname-btn">Let's Go! 🚀</button>
            </form>
          </div>
        </div>

        <style jsx="true">{`
          .nickname-prompt {
            background: rgba(18, 30, 26, 0.95);
            border: 1px solid rgba(16, 185, 129, 0.25);
            border-radius: 20px;
            padding: 48px 40px;
            max-width: 440px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(16,185,129,0.08);
          }
          .nickname-title {
            font-size: 28px;
            margin-bottom: 8px;
            color: var(--text-white);
          }
          .nickname-sub {
            font-size: 14px;
            color: var(--text-muted);
            margin-bottom: 28px;
          }
          .nickname-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .nickname-input {
            padding: 14px 18px;
            border-radius: 12px;
            border: 1px solid rgba(16,185,129,0.3);
            background: rgba(0,0,0,0.3);
            color: var(--text-white);
            font-size: 18px;
            text-align: center;
            outline: none;
            transition: all 0.3s;
          }
          .nickname-input:focus {
            border-color: var(--text-emerald);
            box-shadow: 0 0 20px rgba(16,185,129,0.15);
          }
          .nickname-input::placeholder {
            color: var(--text-muted);
            opacity: 0.6;
          }
          .nickname-btn {
            padding: 14px 24px;
            border-radius: 12px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            font-size: 16px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
          }
          .nickname-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(16,185,129,0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-viewport">
      {!showCard ? (
        // Landing Screen with Centered "Click Me" button
        <div className="landing-screen">
          <button 
            className="click-me-btn animate-pulse-glow"
            onClick={() => setShowCard(true)}
          >
            Click Me
          </button>
        </div>
      ) : (
        // The main system card
        <div className="simple-system-container animate-scale-up">
          {/* Back button to return to landing */}
          <button className="back-btn" onClick={() => setShowCard(false)}>
            ← Back
          </button>

          {/* User Identity Bar */}
          <div className="user-identity-bar">
            <span className="user-avatar">👤</span>
            <span className="user-name">{nickname}</span>
            <button className="change-nick-btn" onClick={handleChangeNickname}>
              (Change Name)
            </button>
          </div>

          {/* Database Room Sync UI Panel */}
          <div className="room-sync-bar">
            {roomCode ? (
              <div className="room-active-status">
                <span className={`status-dot ${isSyncingLive ? 'live' : 'local'}`}></span>
                <span className="room-info-txt">
                  {isSyncingLive ? `Live Room: ${roomCode}` : 'Connecting...'}
                </span>
                <button className="room-action-link" onClick={handleDisconnectRoom}>
                  (Disconnect)
                </button>
              </div>
            ) : (
              <form onSubmit={handleConnectRoom} className="room-connect-form">
                <input 
                  type="text" 
                  className="room-code-input" 
                  placeholder="Enter Squad Room Code (e.g. CDO-Squad)" 
                  value={tempRoomCode} 
                  onChange={(e) => setTempRoomCode(e.target.value)}
                />
                <button type="submit" className="room-connect-btn">Connect Live</button>
              </form>
            )}
          </div>

          {/* Active Users Panel */}
          {roomCode && isSyncingLive && activeUsers.length > 0 && (
            <div className="active-users-panel">
              <span className="active-users-label">🟢 Online ({activeUsers.length}):</span>
              <div className="active-users-list">
                {activeUsers.map((u, i) => (
                  <span key={i} className={`user-chip ${u.nickname.toLowerCase() === nickname.toLowerCase() ? 'user-chip-me' : ''}`}>
                    {u.nickname}
                    {u.nickname.toLowerCase() === nickname.toLowerCase() && <span className="me-tag"> (you)</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Heading Section */}
          <h1 className="system-title">Sinulom Falls & Bolao Cold Spring</h1>
          
          <div className="location-info">
            <p>Located sa Talakag, Bukidnon</p>
            <p>Around 1.5–2.5 hours travel gikan sa Cagayan de Oro depende sa traffic ug sakyanan.</p>
            <p>Naay portions nga rough road ug trekking gamay paingon sa falls.</p>
          </div>

          <div className="section-block">
            <h3 className="details-header">LAAG DETAILS</h3>
            
            {/* Editable Details List */}
            <div className="details-list">
              <div className="details-item">
                <span className="details-icon">🗓️</span>
                <span className="details-label">Date:</span>
                <input 
                  type="text" 
                  className="details-input" 
                  value={laagDate} 
                  onChange={(e) => handleDetailChange('date', e.target.value, 'laag_date')}
                />
              </div>

              <div className="details-item">
                <span className="details-icon">👥</span>
                <span className="details-label">Participants:</span>
                <input 
                  type="text" 
                  className="details-input" 
                  value={participants} 
                  onChange={(e) => handleDetailChange('participants', e.target.value, 'participants')}
                />
              </div>

              <div className="details-item">
                <span className="details-icon">🚗</span>
                <span className="details-label">Service:</span>
                <input 
                  type="text" 
                  className="details-input" 
                  value={service} 
                  onChange={(e) => handleDetailChange('service', e.target.value, 'service')}
                />
              </div>

              <div className="details-item">
                <span className="details-icon">📍</span>
                <span className="details-label">Meet-up Area:</span>
                <input 
                  type="text" 
                  className="details-input" 
                  value={meetupArea} 
                  onChange={(e) => handleDetailChange('area', e.target.value, 'meetup_area')}
                />
              </div>

              <div className="details-item">
                <span className="details-icon">🕒</span>
                <span className="details-label">Meet-up Time:</span>
                <input 
                  type="text" 
                  className="details-input" 
                  value={meetupTime} 
                  onChange={(e) => handleDetailChange('time', e.target.value, 'meetup_time')}
                />
              </div>
            </div>

            <h2 className="system-subtitle">what to bring foods</h2>
            
            {/* CRUD Input Form */}
            <form onSubmit={handleAdd} className="fillup-form">
              <div className="input-group">
                <label htmlFor="fill-up" className="input-label font-small">
                  fill-up diri ing ani fromat (ex. JERALD -LECHON MANOK TUNGA HAHA)
                </label>
                <input
                  id="fill-up"
                  type="text"
                  className="system-input focus-highlight"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type item..."
                  autoFocus
                />
              </div>
              <button type="submit" className="system-btn-add">Add</button>
            </form>

            {/* Numbered CRUD List with Animations */}
            <div className="food-numbered-list">
              {items.map((item, index) => (
                <div 
                  className={`list-item-row ${item.id === addedItemId ? 'animate-new-item' : ''}`} 
                  key={item.id}
                >
                  {editingId === item.id ? (
                    // Edit mode
                    <form onSubmit={(e) => handleSaveEdit(e, item.id)} className="edit-inline-form">
                      <span className="item-number">{index + 1}.</span>
                      <input
                        type="text"
                        className="system-input-edit"
                        value={editingVal}
                        onChange={(e) => setEditingVal(e.target.value)}
                        autoFocus
                      />
                      <button type="submit" className="action-btn-text save">Save</button>
                      <button type="button" className="action-btn-text cancel" onClick={() => setEditingId(null)}>Cancel</button>
                    </form>
                  ) : (
                    // View mode
                    <>
                      <div className="item-content">
                        <span className="item-number">{index + 1}.</span>
                        <span className="item-text">{item.text}</span>
                        {item.addedBy && (
                          <span className="item-added-by">
                            👤 {item.addedBy}
                          </span>
                        )}
                      </div>
                      <div className="item-actions">
                        <button className="action-btn-text edit" onClick={() => handleStartEdit(item)}>edit</button>
                        <span className="action-divider">|</span>
                        <button className="action-btn-text delete" onClick={() => handleDelete(item.id)}>delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inline styles for user-related UI */}
      <style jsx="true">{`
        .user-identity-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 12px;
          margin-bottom: 12px;
        }
        .user-avatar {
          font-size: 18px;
        }
        .user-name {
          font-weight: 700;
          color: var(--text-emerald);
          font-size: 15px;
        }
        .change-nick-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 12px;
          cursor: pointer;
          margin-left: auto;
          transition: color 0.2s;
        }
        .change-nick-btn:hover {
          color: var(--text-blue);
        }

        .active-users-panel {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.12);
          border-radius: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .active-users-label {
          font-size: 13px;
          color: var(--text-emerald);
          font-weight: 600;
          white-space: nowrap;
        }
        .active-users-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .user-chip {
          padding: 4px 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          font-size: 13px;
          color: var(--text-light);
          font-weight: 500;
          transition: all 0.2s;
        }
        .user-chip-me {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.3);
          color: var(--text-emerald);
        }
        .me-tag {
          font-size: 11px;
          opacity: 0.7;
        }
        
        .item-added-by {
          font-size: 11px;
          color: var(--text-emerald);
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          padding: 2px 8px;
          border-radius: 999px;
          margin-left: 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}

