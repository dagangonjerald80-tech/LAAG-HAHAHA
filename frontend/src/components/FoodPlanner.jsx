import React, { useState, useEffect, useRef } from 'react';
// Added fetch for initial room data
import { RotateCcw, AlertCircle, Sparkles } from 'lucide-react';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocal 
  ? 'http://127.0.0.1:8000' 
  : (import.meta.env.VITE_API_URL || 'https://laag-backend.onrender.com');

const DEFAULT_ITEMS = [
  'Liempo (Pork Belly) for Sinugba',
  'Puso (Hanging Rice)',
  'Lechon Manok (Roasted Chicken)',
  'Kinilaw na Isda (Fish Salad)',
  'Softdrinks & Cold Water',
  'Charcoal (Uling)',
  'Paper plates, cups & napkins'
];

export default function FoodPlanner() {
  const queryParams = new URLSearchParams(window.location.search);
  const ROOM_CODE = queryParams.get('room') || localStorage.getItem('laag_room_code') || 'laag-squad';
  // Load list from local storage or use defaults
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('laag_plan_simple_foods');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_ITEMS;
      }
    }
    return DEFAULT_ITEMS;
  });

  // ----- NEW: Fetch shared room data on component mount -----
  useEffect(() => {
    fetch(`${API_URL}/api/rooms/${ROOM_CODE}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (response) => {
        if (!response.ok) {
          // If room does not exist, create it via POST later when items change
          console.warn('Room not found, will be created on first save');
          return null;
        }
        const data = await response.json();
        // Expect the backend to return a field named `foods` (list of strings)
        if (Array.isArray(data.foods) && data.foods.length) {
          setItems(data.foods);
          localStorage.setItem('laag_plan_simple_foods', JSON.stringify(data.foods));
        }
      })
      .catch((error) => {
        console.error('Error fetching room data:', error);
      });
  }, []);

  // Track the index of the input we want to focus
  const [focusIndex, setFocusIndex] = useState(null);
  const inputRefs = useRef([]);

  // Sync to local storage & Django API
  const syncRoomFoods = (currentItems) => {
    localStorage.setItem('laag_plan_simple_foods', JSON.stringify(currentItems));
    fetch(`${API_URL}/api/rooms/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_code: ROOM_CODE, foods: currentItems })
    })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Django sync error:', errorText);
      }
    })
    .catch((error) => {
      console.error('Django sync connection error:', error);
    });
  };

  // Handle focusing when focusIndex changes
  useEffect(() => {
    if (focusIndex !== null && inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
      setFocusIndex(null);
    }
  }, [focusIndex]);

  const handleChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    localStorage.setItem('laag_plan_simple_foods', JSON.stringify(newItems));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Insert a new empty line right after the current one
      const newItems = [...items];
      newItems.splice(index + 1, 0, '');
      setItems(newItems);
      setFocusIndex(index + 1);
      syncRoomFoods(newItems);
    } else if (e.key === 'Backspace' && items[index] === '') {
      // Remove line if empty and backspace is pressed
      if (items.length > 1) {
        e.preventDefault();
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
        setFocusIndex(index > 0 ? index - 1 : 0);
        syncRoomFoods(newItems);
      }
    } else if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowDown' && index < items.length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1].focus();
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset to default CDO picnic foods?')) {
      setItems(DEFAULT_ITEMS);
      setFocusIndex(0);
      syncRoomFoods(DEFAULT_ITEMS);
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all items?')) {
      const cleared = [''];
      setItems(cleared);
      setFocusIndex(0);
      syncRoomFoods(cleared);
    }
  };

  return (
    <div id="food-planner" className="simple-planner-container animate-fade-in">
      <div className="simple-planner-header">
        <h2>What to Bring (Foods & Supplies)</h2>
        <p className="section-subtitle">Type directly on the lines. Press Enter to add a new line, and Backspace to delete.</p>
      </div>

      <div className="notepad-wrapper">
        <div className="notepad-card glass-card">
          {/* Notepad Header */}
          <div className="notepad-title-row">
            <span className="notepad-title">what to bring</span>
            <div className="notepad-line-accent"></div>
          </div>

          {/* Lined Paper Lines */}
          <div className="notepad-lines">
            {items.map((item, index) => (
              <div className="notepad-line" key={index}>
                <span className="line-number">{index + 1}</span>
                <input
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  className="line-input"
                  value={item}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onBlur={() => syncRoomFoods(items)}
                  placeholder="Type food or supply here..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notepad Controls */}
        <div className="notepad-controls-bar">
          <button className="btn btn-secondary btn-sm" onClick={handleReset}>
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button className="btn btn-secondary btn-sm btn-danger-hover" onClick={handleClear}>
            Clear All
          </button>
        </div>

        <div className="notepad-help">
          <AlertCircle size={14} className="text-blue" />
          <span>This notepad auto-saves. You can print this page using the Print Trip Plan button in the Trip Planner tab.</span>
        </div>
      </div>

      <style jsx="true">{`
        .simple-planner-container {
          padding: 60px 24px;
          max-width: 760px;
          margin: 0 auto;
          width: 100%;
        }

        .simple-planner-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .simple-planner-header h2 {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .notepad-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .notepad-card {
          padding: 40px 32px;
          background: rgba(18, 30, 26, 0.9);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
        }

        .notepad-title-row {
          margin-bottom: 24px;
          position: relative;
        }

        .notepad-title {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 700;
          color: var(--text-white);
          letter-spacing: -0.5px;
        }

        .notepad-line-accent {
          height: 2px;
          background: var(--text-emerald);
          margin-top: 8px;
          width: 120px;
          border-radius: 9999px;
        }

        .notepad-lines {
          display: flex;
          flex-direction: column;
        }

        .notepad-line {
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(16, 185, 129, 0.08);
          padding: 12px 0;
          transition: var(--transition-smooth);
        }

        .notepad-line:hover {
          border-color: rgba(16, 185, 129, 0.2);
        }

        .line-number {
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 700;
          color: var(--text-emerald);
          width: 32px;
          flex-shrink: 0;
          user-select: none;
        }

        .line-input {
          flex-grow: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-white);
          font-family: var(--font-body);
          font-size: 16px;
          padding: 0;
          transition: var(--transition-smooth);
        }

        .line-input::placeholder {
          color: var(--text-muted);
          opacity: 0.5;
        }

        .line-input:focus {
          color: var(--text-blue);
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.15);
          box-shadow: none;
        }

        .notepad-controls-bar {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-danger-hover:hover {
          background: rgba(239, 68, 68, 0.15) !important;
          border-color: rgba(239, 68, 68, 0.3) !important;
          color: #f87171 !important;
        }

        .notepad-help {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
          justify-content: center;
        }

        @media print {
          .simple-planner-container {
            max-width: 100% !important;
            padding: 0 !important;
          }
          .notepad-card {
            background: white !important;
            color: black !important;
            border: 1px solid #ccc !important;
            box-shadow: none !important;
          }
          .notepad-title {
            color: black !important;
          }
          .line-input {
            color: black !important;
          }
          .notepad-line {
            border-bottom: 1px solid #ccc !important;
          }
          .notepad-controls-bar, .notepad-help {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
