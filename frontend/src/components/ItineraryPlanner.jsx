import React, { useState, useEffect } from 'react';
import { Calendar, Users, Car, Bus, Home, Coffee, Info, Printer, Clipboard, Check, MapPin, Clock } from 'lucide-react';

export default function ItineraryPlanner({ weather, plannerState, setPlannerState }) {
  const [copied, setCopied] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const {
    date,
    pax,
    transportMode,
    cottageType,
    activities,
    foodBudget
  } = plannerState;

  // Pricing constants
  const FEES = {
    entrance: 100,
    lifevest: 50,
    parking: 50,
    gasEstimate: 500,
    commuteJeepOneWay: 60,
    commuteHabalOneWay: 100,
    cottages: {
      none: 0,
      small: 500,
      medium: 800,
      large: 1200,
      floating: 1500
    }
  };

  const handleInputChange = (field, value) => {
    setPlannerState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleActivity = (actId) => {
    const newActs = activities.includes(actId)
      ? activities.filter(id => id !== actId)
      : [...activities, actId];
    handleInputChange('activities', newActs);
  };

  // Calculations
  const entranceTotal = pax * FEES.entrance;
  const cottageCost = FEES.cottages[cottageType] || 0;
  const foodCost = pax * foodBudget;
  const lifevestCost = activities.includes('swimming') ? pax * FEES.lifevest : 0;
  
  let transportCost = 0;
  if (transportMode === 'commute') {
    // Round trip per person: Jeep (60 * 2) + Habal-Habal (100 * 2) = 320
    transportCost = pax * (FEES.commuteJeepOneWay + FEES.commuteHabalOneWay) * 2;
  } else {
    // Private vehicle: Flat estimated gas + parking fee
    transportCost = FEES.gasEstimate + FEES.parking;
  }

  const grandTotal = entranceTotal + cottageCost + foodCost + lifevestCost + transportCost;

  // Dynamic Timeline Generation
  const generateTimeline = () => {
    const timeline = [];
    const isCommute = transportMode === 'commute';
    
    // Step 1: Assembly
    timeline.push({
      time: '07:00 AM',
      title: 'Assembly & Departure from CDO',
      description: isCommute 
        ? 'Meet up at Carmen Market, CDO. Board a Talakag-bound jeepney or van. Ensure to request the driver to drop you off at Tignapoloan Crossing.' 
        : 'Depart from Cagayan de Oro City. Head south-west via the CDO-Talakag road. Make sure you have downloaded offline maps or guides.',
      icon: <Clock size={16} />
    });

    // Step 2: Transit
    timeline.push({
      time: '08:15 AM',
      title: isCommute ? 'Arrival at Tignapoloan Crossing' : 'Turnoff toward Brgy. Tignapoloan',
      description: isCommute 
        ? 'Alight at the Tignapoloan Crossing near the Jehovah\'s Witness Kingdom Hall. Hire a local habal-habal (motorcycle taxi) to take you to the resort.'
        : 'After crossing the Mangalay Bridge, follow road signs towards Brgy. Tignapoloan crossing. Keep left at the fork and head down the unpaved road.',
      icon: <MapPin size={16} />
    });

    // Step 3: Arrival
    timeline.push({
      time: '08:45 AM',
      title: 'Arrival at Sinulom & Bolao Resort',
      description: `Pay the entrance fee of ₱${FEES.entrance} per person (Total: ₱${entranceTotal}) at the register. ${transportMode === 'private' ? `Secure parking for your vehicle (₱${FEES.parking}).` : ''} Check into your ${cottageType !== 'none' ? `${cottageType} cottage (₱${cottageCost})` : 'picnic area'}.`,
      icon: <Home size={16} />
    });

    // Step 4: Morning activities
    if (activities.includes('photography') || activities.length === 0) {
      timeline.push({
        time: '09:15 AM',
        title: 'Virtual Tour & Photography',
        description: 'Explore the scenic view deck. Walk across the hanging bridge to capture the panoramic view of the 28 cascading Sinulom Falls streams dropping into the Cagayan de Oro River.',
        icon: <Info size={16} />
      });
    }

    // Step 5: Main activity
    if (activities.includes('trekking')) {
      timeline.push({
        time: '10:15 AM',
        title: 'River Trekking & CDO River Crossing',
        description: 'Guided crossing of the CDO River. Take caution with the current. Trek closer to the base of the Talakag cliff to witness the cascades up close. Wear water shoes!',
        icon: <MapPin size={16} />
      });
    }

    // Step 6: Lunch
    timeline.push({
      time: '12:00 PM',
      title: 'Lunch at Cottage',
      description: `Enjoy your prepared meals at your cottage. Bolao has zero corkage fees, so home-cooked meals are highly recommended. Total food allowance: ₱${foodCost}.`,
      icon: <Coffee size={16} />
    });

    // Step 7: Afternoon swimming
    if (activities.includes('swimming')) {
      timeline.push({
        time: '01:00 PM',
        title: 'Dip in Bolao Cold Spring Pool',
        description: `Rent life vests (₱${FEES.lifevest}/pax, total ₱${lifevestCost}) and submerge in the crystal-clear, ice-cold spring pool. The spring water is continually flowing, refreshing, and clean.`,
        icon: <Info size={16} />
      });
    } else {
      timeline.push({
        time: '01:30 PM',
        title: 'Afternoon Relaxation',
        description: 'Relax by the spring side, enjoy the natural forest canopy, and walk the scenic trail towards the hanging bridge.',
        icon: <Info size={16} />
      });
    }

    // Step 8: Clean up & Pack
    timeline.push({
      time: '04:00 PM',
      title: 'Tidy Up and Pack Belongings',
      description: 'Please practice "Leave No Trace" principles. Throw trash in designated bins or pack it out. Return any rented life vests.',
      icon: <Check size={16} />
    });

    // Step 9: Head Home
    timeline.push({
      time: '04:30 PM',
      title: 'Departure & Journey Back to CDO',
      description: isCommute
        ? 'Hop on your habal-habal back to Tignapoloan Crossing. Wait for a CDO Carmen-bound jeepney. Expected arrival in CDO by 6:00 PM.'
        : 'Depart the parking space. Drive carefully on the unpaved access road back to the main CDO-Talakag highway.',
      icon: <Clock size={16} />
    });

    return timeline;
  };

  const handleCopy = () => {
    const timelineStr = generateTimeline()
      .map(step => `[${step.time}] ${step.title}\n${step.description}`)
      .join('\n\n');
    
    const budgetStr = `--- BUDGET SUMMARY (Pax: ${pax}) ---
Transportation (${transportMode}): ₱${transportCost}
Entrance Fees: ₱${entranceTotal}
Cottage (${cottageType}): ₱${cottageCost}
Food & Allowance: ₱${foodCost}
Lifevest Rental: ₱${lifevestCost}
------------------------------------
Estimated Total Cost: ₱${grandTotal}`;

    navigator.clipboard.writeText(`${budgetStr}\n\n=== ITINERARY SCHEDULE ===\n${timelineStr}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="planner-section" className="planner-container animate-fade-in">
      <div className="planner-header">
        <h2>Interactive Travel Planner & Budget Estimator</h2>
        <p className="section-subtitle">Customize your travel options to instantly calculate expenses and generate a personalized schedule.</p>
      </div>

      <div className="planner-grid">
        {/* Left Side: Controls */}
        <div className="planner-controls glass-card">
          <h3 className="card-title-icon"><Calendar size={20} className="text-emerald" /> Plan Details</h3>
          
          <div className="control-group">
            <label className="input-label">Date of Travel</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => handleInputChange('date', e.target.value)} 
            />
          </div>

          <div className="control-group">
            <label className="input-label">Number of Pax (Travelers)</label>
            <div className="pax-input-wrapper">
              <Users size={16} className="input-icon" />
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={pax} 
                onChange={(e) => handleInputChange('pax', parseInt(e.target.value) || 1)} 
              />
            </div>
          </div>

          <div className="control-group">
            <label className="input-label">Mode of Transportation</label>
            <div className="toggle-buttons">
              <button 
                className={`toggle-btn ${transportMode === 'commute' ? 'active' : ''}`}
                onClick={() => handleInputChange('transportMode', 'commute')}
              >
                <Bus size={16} /> Commute (Public)
              </button>
              <button 
                className={`toggle-btn ${transportMode === 'private' ? 'active' : ''}`}
                onClick={() => handleInputChange('transportMode', 'private')}
              >
                <Car size={16} /> Private Vehicle
              </button>
            </div>
            <p className="help-text">
              {transportMode === 'commute' 
                ? 'Jeepney from Carmen (₱60) + Habal-Habal (₱100) per person, one-way.'
                : 'Estimates flat ₱500 fuel allowance + ₱50 parking fee.'
              }
            </p>
          </div>

          <div className="control-group">
            <label className="input-label">Cottage Rental</label>
            <select 
              value={cottageType} 
              onChange={(e) => handleInputChange('cottageType', e.target.value)}
            >
              <option value="none">No Cottage (Picnic Blankets / Open Area) - ₱0</option>
              <option value="small">Small Open Cottage (Up to 6 pax) - ₱500</option>
              <option value="medium">Medium Cottage (Up to 12 pax) - ₱800</option>
              <option value="large">Large Family Cottage (Up to 20 pax) - ₱1,200</option>
              <option value="floating">Floating River Cottage - ₱1,500</option>
            </select>
          </div>

          <div className="control-group">
            <label className="input-label">Food & Spending Allowance (per person)</label>
            <div className="pax-input-wrapper">
              <span className="currency-symbol">₱</span>
              <input 
                type="number" 
                min="0"
                step="50"
                value={foodBudget} 
                onChange={(e) => handleInputChange('foodBudget', parseInt(e.target.value) || 0)} 
              />
            </div>
          </div>

          <div className="control-group">
            <label className="input-label">Planned Activities</label>
            <div className="checkbox-group">
              <label className="custom-checkbox">
                <input 
                  type="checkbox" 
                  checked={activities.includes('swimming')} 
                  onChange={() => toggleActivity('swimming')}
                />
                <span className="checkmark"></span>
                Swimming (Requires life vests rental)
              </label>

              <label className="custom-checkbox">
                <input 
                  type="checkbox" 
                  checked={activities.includes('trekking')} 
                  onChange={() => toggleActivity('trekking')}
                />
                <span className="checkmark"></span>
                River Crossing & Trekking (Wet activities)
              </label>

              <label className="custom-checkbox">
                <input 
                  type="checkbox" 
                  checked={activities.includes('photography')} 
                  onChange={() => toggleActivity('photography')}
                />
                <span className="checkmark"></span>
                Photography & Hanging Bridge Walk
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Budget Breakdown & Output */}
        <div className="planner-summary">
          <div className="glass-card budget-card">
            <h3>Estimated Budget Breakdown</h3>
            <div className="total-display">
              <span className="total-label">Grand Total</span>
              <span className="total-value">₱{grandTotal.toLocaleString()}</span>
              <span className="per-person">₱{Math.round(grandTotal / pax).toLocaleString()} / person</span>
            </div>

            <div className="expense-bars">
              <div className="expense-item">
                <div className="expense-labels">
                  <span>Entrance Fees</span>
                  <span>₱{entranceTotal}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill fill-emerald" style={{ width: `${(entranceTotal / grandTotal) * 100}%` }}></div>
                </div>
              </div>

              <div className="expense-item">
                <div className="expense-labels">
                  <span>Transportation</span>
                  <span>₱{transportCost}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill fill-blue" style={{ width: `${(transportCost / grandTotal) * 100}%` }}></div>
                </div>
              </div>

              {cottageCost > 0 && (
                <div className="expense-item">
                  <div className="expense-labels">
                    <span>Cottage Rental ({cottageType})</span>
                    <span>₱{cottageCost}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill fill-gold" style={{ width: `${(cottageCost / grandTotal) * 100}%` }}></div>
                  </div>
                </div>
              )}

              <div className="expense-item">
                <div className="expense-labels">
                  <span>Food & Allowance</span>
                  <span>₱{foodCost}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill fill-purple" style={{ width: `${(foodCost / grandTotal) * 100}%` }}></div>
                </div>
              </div>

              {lifevestCost > 0 && (
                <div className="expense-item">
                  <div className="expense-labels">
                    <span>Lifevest Rentals</span>
                    <span>₱{lifevestCost}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill fill-sky" style={{ width: `${(lifevestCost / grandTotal) * 100}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {weather === 'stormy' && (
              <div className="danger-alert">
                <Info size={16} />
                <span>Budget advisory: Heavy rain warning simulated. Travel might be suspended. Consider changing dates.</span>
              </div>
            )}

            <div className="summary-actions">
              <button className="btn btn-secondary btn-full" onClick={handleCopy}>
                {copied ? <Check size={16} /> : <Clipboard size={16} />}
                {copied ? 'Copied Itinerary!' : 'Copy Itinerary & Budget'}
              </button>
              <button className="btn btn-blue btn-full" onClick={handlePrint}>
                <Printer size={16} /> Print Trip Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Timeline Schedule */}
      <div className="timeline-container glass-card">
        <h3 className="timeline-header-title">Generated Daily Schedule</h3>
        <p className="timeline-subtitle">Based on your departure from Carmen Market, CDO and selected options.</p>
        
        <div className="timeline-steps">
          {generateTimeline().map((step, idx) => (
            <div className="timeline-step" key={idx}>
              <div className="timeline-badge-wrapper">
                <div className="timeline-badge">
                  {step.icon}
                </div>
                {idx < generateTimeline().length - 1 && <div className="timeline-line"></div>}
              </div>
              <div className="timeline-details">
                <span className="step-time">{step.time}</span>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .planner-container {
          padding: 60px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .planner-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .planner-header h2 {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .section-subtitle {
          color: var(--text-muted);
          font-size: 15px;
        }

        .planner-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 32px;
          margin-bottom: 48px;
        }

        .planner-controls {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .card-title-icon {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 12px;
          margin-bottom: 8px;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-white);
        }

        .pax-input-wrapper {
          position: relative;
        }

        .input-icon, .currency-symbol {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 15px;
          display: flex;
          align-items: center;
        }

        .pax-input-wrapper input {
          padding-left: 36px;
        }

        .toggle-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: var(--bg-dark);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid var(--border-light);
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .toggle-btn:hover {
          color: var(--text-white);
        }

        .toggle-btn.active {
          background: var(--primary-light);
          color: var(--text-white);
          box-shadow: var(--shadow-sm);
        }

        .help-text {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(0, 0, 0, 0.15);
          padding: 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        /* Summary Panel Card */
        .budget-card {
          padding: 32px;
          position: sticky;
          top: 24px;
        }

        .total-display {
          text-align: center;
          padding: 24px;
          background: rgba(0,0,0,0.25);
          border-radius: 12px;
          border: 1px dashed var(--border-light);
          margin: 16px 0 28px;
        }

        .total-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          display: block;
        }

        .total-value {
          font-size: 38px;
          font-weight: 800;
          color: var(--text-emerald);
          display: block;
          margin: 4px 0;
          font-family: var(--font-heading);
        }

        .per-person {
          font-size: 14px;
          color: var(--text-blue);
          font-weight: 500;
        }

        .expense-bars {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 28px;
        }

        .expense-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .expense-labels {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-silver);
        }

        .progress-bar {
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.4s ease-out;
        }

        .fill-emerald { background: var(--text-emerald); }
        .fill-blue { background: var(--text-blue); }
        .fill-gold { background: var(--accent-gold); }
        .fill-purple { background: #c084fc; }
        .fill-sky { background: #38bdf8; }

        .danger-alert {
          display: flex;
          gap: 8px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 12px;
          border-radius: 8px;
          font-size: 12px;
          color: #f87171;
          margin-bottom: 20px;
          align-items: center;
        }

        .summary-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-full {
          width: 100%;
        }

        /* Timeline schedule styling */
        .timeline-container {
          padding: 40px;
          margin-top: 40px;
        }

        .timeline-header-title {
          font-size: 22px;
          margin-bottom: 4px;
        }

        .timeline-subtitle {
          color: var(--text-muted);
          font-size: 14px;
          margin-bottom: 32px;
        }

        .timeline-steps {
          display: flex;
          flex-direction: column;
          gap: 0px;
        }

        .timeline-step {
          display: flex;
          gap: 24px;
        }

        .timeline-badge-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .timeline-badge {
          width: 36px;
          height: 36px;
          background: var(--bg-dark-input);
          border: 1px solid var(--border-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-emerald);
          z-index: 2;
        }

        .timeline-line {
          width: 2px;
          flex-grow: 1;
          background: rgba(16, 185, 129, 0.15);
          margin: 4px 0;
        }

        .timeline-details {
          padding-bottom: 32px;
          flex-grow: 1;
        }

        .step-time {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-blue);
          display: block;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }

        .step-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-white);
          margin-bottom: 6px;
        }

        .step-desc {
          font-size: 14px;
          color: var(--text-silver);
          line-height: 1.5;
        }

        @media (max-width: 992px) {
          .planner-grid {
            grid-template-columns: 1fr;
          }
          .budget-card {
            position: relative;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
