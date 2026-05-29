import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, RotateCcw, AlertCircle, CheckSquare, Sparkles } from 'lucide-react';

export default function PackChecklist({ activities, checklistItems, setChecklistItems }) {
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('essentials');

  // Toggle item status
  const toggleItem = (itemId) => {
    setChecklistItems(prev =>
      prev.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item)
    );
  };

  // Add custom item
  const addItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem = {
      id: `custom_${Date.now()}`,
      text: newItemText.trim(),
      category: newItemCategory,
      checked: false,
      isCustom: true
    };

    setChecklistItems(prev => [...prev, newItem]);
    setNewItemText('');
  };

  // Delete custom item
  const deleteItem = (itemId) => {
    setChecklistItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Reset checklist to original items
  const resetChecklist = () => {
    if (window.confirm('Reset checklist? This will clear custom items and reset progress.')) {
      localStorage.removeItem('laag_plan_checklist');
      // Let parent set it or trigger a page reload / default state load
      window.location.reload();
    }
  };

  // Group items by category
  const categories = {
    essentials: 'Essentials & Clean Up',
    apparel: 'Clothing & Swimming Apparel',
    gear: 'Electronics & Adventure Gear',
    cash: 'Money & Documents'
  };

  const getFilteredItems = (catKey) => {
    return checklistItems.filter(item => item.category === catKey);
  };

  // Activity recommendations helper
  const getActivityRecommendations = () => {
    const recs = [];
    if (activities.includes('swimming')) {
      recs.push({
        title: 'Swimming Gear Highlight',
        text: 'Since swimming is selected, make sure to bring a dry bag, towels, swimwear, and water shoes for the rocky river bed.'
      });
    }
    if (activities.includes('trekking')) {
      recs.push({
        title: 'River Trekking Safety',
        text: 'For CDO River crossing, sturdy strap-on sandals or water shoes are absolutely mandatory (slippery river rocks). Bring a waterproof phone pouch.'
      });
    }
    if (activities.includes('photography')) {
      recs.push({
        title: 'Content Creator Checklist',
        text: 'Electricity is scarce at Bolao. Make sure your power bank is fully loaded and bring an action camera or waterproof sleeve.'
      });
    }
    return recs;
  };

  const activeRecs = getActivityRecommendations();

  return (
    <div id="checklist" className="checklist-container animate-fade-in">
      <div className="checklist-header">
        <h2>Smart Packing Checklist</h2>
        <p className="section-subtitle">A comprehensive list of travel gear. Checked items are saved to your browser session.</p>
      </div>

      {activeRecs.length > 0 && (
        <div className="recs-box glass-card">
          <h3 className="recs-header-title">
            <Sparkles size={18} className="text-gold animate-pulse" />
            Activity-Based Recommendations
          </h3>
          <div className="recs-grid">
            {activeRecs.map((rec, idx) => (
              <div className="rec-card" key={idx}>
                <strong>{rec.title}</strong>
                <p>{rec.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="checklist-grid">
        {/* Left column: Categories */}
        <div className="checklist-columns">
          {Object.keys(categories).map((catKey) => {
            const items = getFilteredItems(catKey);
            const completedCount = items.filter(i => i.checked).length;
            const totalCount = items.length;

            return (
              <div className="category-card glass-card" key={catKey}>
                <div className="category-header">
                  <h3>{categories[catKey]}</h3>
                  <span className="category-count">
                    {completedCount} / {totalCount}
                  </span>
                </div>
                
                <div className="progress-bar mini-bar">
                  <div 
                    className="progress-fill fill-emerald" 
                    style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                  ></div>
                </div>

                <div className="items-list">
                  {items.length === 0 ? (
                    <p className="empty-category-text">No items in this category.</p>
                  ) : (
                    items.map((item) => (
                      <div className="item-row" key={item.id}>
                        <label className={`custom-checkbox ${item.checked ? 'completed' : ''}`}>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleItem(item.id)}
                          />
                          <span className="checkmark"></span>
                          <span>
                            {item.text}
                            {item.recommended && (
                              <span className="recommended-tag">Recommended</span>
                            )}
                          </span>
                        </label>
                        {item.isCustom && (
                          <button 
                            className="delete-item-btn" 
                            onClick={() => deleteItem(item.id)}
                            title="Delete custom item"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Add Item & Reset Form */}
        <div className="checklist-sidebar">
          <div className="glass-card add-item-card">
            <h3>Add Custom Item</h3>
            <form onSubmit={addItem} className="add-item-form">
              <div className="form-group">
                <label className="input-label">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Snacks, Bluetooth speaker..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  maxLength={40}
                />
              </div>

              <div className="form-group">
                <label className="input-label">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                >
                  <option value="essentials">Essentials & Clean Up</option>
                  <option value="apparel">Clothing & Swimming</option>
                  <option value="gear">Electronics & Adventure Gear</option>
                  <option value="cash">Money & Documents</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                <Plus size={16} /> Add to List
              </button>
            </form>
          </div>

          <div className="glass-card actions-sidebar-card">
            <h3>Checklist Options</h3>
            <button className="btn btn-secondary btn-full" onClick={resetChecklist}>
              <RotateCcw size={16} /> Reset Checklist Progress
            </button>
            <div className="info-notes">
              <AlertCircle size={14} className="text-blue" />
              <span>Checked items stay checked between page reloads, allowing you to prepare your bag dynamically.</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .checklist-container {
          padding: 60px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .checklist-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .checklist-header h2 {
          font-size: 32px;
          margin-bottom: 8px;
        }

        /* Recommendations styling */
        .recs-box {
          padding: 24px;
          margin-bottom: 32px;
          background: rgba(16, 185, 129, 0.05);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .recs-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 700;
          color: var(--text-white);
          margin-bottom: 16px;
        }

        .recs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .rec-card {
          background: rgba(0, 0, 0, 0.2);
          border-left: 3px solid var(--accent-gold);
          padding: 12px 16px;
          border-radius: 6px;
        }

        .rec-card strong {
          display: block;
          font-size: 13.5px;
          color: var(--text-white);
          margin-bottom: 4px;
        }

        .rec-card p {
          font-size: 12.5px;
          color: var(--text-silver);
          line-height: 1.4;
        }

        /* Grid breakdown */
        .checklist-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
        }

        .checklist-columns {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .category-card {
          padding: 24px;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .category-header h3 {
          font-size: 16px;
          font-weight: 700;
        }

        .category-count {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-emerald);
          background: rgba(16, 185, 129, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .mini-bar {
          height: 4px;
          margin-bottom: 20px;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.02);
          transition: var(--transition-smooth);
        }

        .item-row:hover {
          border-color: rgba(16, 185, 129, 0.1);
          background: rgba(0, 0, 0, 0.25);
        }

        .recommended-tag {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-blue);
          background: rgba(56, 189, 248, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          margin-left: 8px;
          letter-spacing: 0.5px;
        }

        .delete-item-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-smooth);
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-item-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .empty-category-text {
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
          padding: 16px 0;
        }

        /* Sidebar styling */
        .checklist-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .add-item-card, .actions-sidebar-card {
          padding: 24px;
        }

        .add-item-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-notes {
          display: flex;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.4;
          margin-top: 16px;
          align-items: flex-start;
        }

        @media (max-width: 992px) {
          .checklist-grid {
            grid-template-columns: 1fr;
          }
          .checklist-sidebar {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}
