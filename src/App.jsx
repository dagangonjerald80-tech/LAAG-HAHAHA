import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function App() {
  // Toggle visibility of the main card
  const [showCard, setShowCard] = useState(false);

  // Room Sync States
  const [roomCode, setRoomCode] = useState(() => localStorage.getItem('laag_room_code') || '');
  const [tempRoomCode, setTempRoomCode] = useState(() => localStorage.getItem('laag_room_code') || '');
  const [isSyncingLive, setIsSyncingLive] = useState(false);

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
          });
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [roomCode]);

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
    const newItem = { id: newId, text: inputVal.trim() };
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
    </div>
  );
}
