import React, { useState, useEffect } from 'react';

export default function App() {
  // Toggle visibility of the main card
  const [showCard, setShowCard] = useState(false);

  // Laag Details States
  const [laagDate, setLaagDate] = useState(() => localStorage.getItem('laag_date') || 'Sunday');
  const [participants, setParticipants] = useState(() => localStorage.getItem('laag_participants') || 'murag 5 persons haha');
  const [service, setService] = useState(() => localStorage.getItem('laag_service') || '3 motors');
  const [meetupArea, setMeetupArea] = useState(() => localStorage.getItem('laag_meetup_area') || 'TBA HAHA');
  const [meetupTime, setMeetupTime] = useState(() => localStorage.getItem('laag_meetup_time') || '8:00 AM – Meet up daw forsure 9 nasad ka abot haha');

  // Food Items List (with IDs for mount animations)
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
  const [addedItemId, setAddedItemId] = useState(null); // Track recently added item for highlight animation

  // Sync details to local storage
  useEffect(() => {
    localStorage.setItem('laag_date', laagDate);
    localStorage.setItem('laag_participants', participants);
    localStorage.setItem('laag_service', service);
    localStorage.setItem('laag_meetup_area', meetupArea);
    localStorage.setItem('laag_meetup_time', meetupTime);
  }, [laagDate, participants, service, meetupArea, meetupTime]);

  // Sync food list to local storage
  useEffect(() => {
    localStorage.setItem('laag_foods_crud_v2', JSON.stringify(items));
  }, [items]);

  // Create
  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const newId = `food_${Date.now()}`;
    const newItem = { id: newId, text: inputVal.trim() };
    
    setItems([...items, newItem]);
    setAddedItemId(newId); // Flag this ID as newly added
    setInputVal('');

    // Clear the highlight flag after animation finishes
    setTimeout(() => {
      setAddedItemId(null);
    }, 1000);
  };

  // Delete
  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Delete this item?');
    if (confirmDelete) {
      setItems(items.filter(item => item.id !== id));
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
    setItems(items.map(item => item.id === id ? { ...item, text: editingVal.trim() } : item));
    setEditingId(null);
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
                  onChange={(e) => setLaagDate(e.target.value)}
                />
              </div>

              <div className="details-item">
                <span className="details-icon">👥</span>
                <span className="details-label">Participants:</span>
                <input 
                  type="text" 
                  className="details-input" 
                  value={participants} 
                  onChange={(e) => setParticipants(e.target.value)}
                />
              </div>

              <div className="details-item">
                <span className="details-icon">🚗</span>
                <span className="details-label">Service:</span>
                <input 
                  type="text" 
                  className="details-input" 
                  value={service} 
                  onChange={(e) => setService(e.target.value)}
                />
              </div>

              <div className="details-item">
                <span className="details-icon">📍</span>
                <span className="details-label">Meet-up Area:</span>
                <input 
                  type="text" 
                  className="details-input" 
                  value={meetupArea} 
                  onChange={(e) => setMeetupArea(e.target.value)}
                />
              </div>

              <div className="details-item">
                <span className="details-icon">🕒</span>
                <span className="details-label">Meet-up Time:</span>
                <input 
                  type="text" 
                  className="details-input" 
                  value={meetupTime} 
                  onChange={(e) => setMeetupTime(e.target.value)}
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
