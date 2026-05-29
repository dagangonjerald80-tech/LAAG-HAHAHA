import React, { useState } from 'react';
import { MapPin, Info, Bus, Car, Navigation, Compass, AlertCircle } from 'lucide-react';

export default function TravelDirections() {
  const [activeTab, setActiveTab] = useState('commuter');

  const commuteSteps = [
    {
      step: '1',
      title: 'Assembly at Carmen Market',
      desc: 'Head to the Carmen Market jeepney terminal in Cagayan de Oro City. Jeepneys or vans bound for Talakag or Tignapoloan park here.',
      duration: '10 mins assembly',
      landmark: 'Carmen Market Terminal'
    },
    {
      step: '2',
      title: 'Board Talakag-bound Jeepney',
      desc: 'Pay the fare of ₱60 per person. Tell the driver you want to get off at Tignapoloan Crossing (crossing going to Sinulom Falls).',
      duration: '45 - 60 mins transit',
      landmark: 'Pass Lumbia & Bayanga'
    },
    {
      step: '3',
      title: 'Alight at Tignapoloan Crossing',
      desc: 'Get off at the crossing. You will notice a small cluster of stores and the Kingdom Hall of Jehovah\'s Witnesses nearby.',
      duration: 'Drop-off stop',
      landmark: 'Kingdom Hall Crossing'
    },
    {
      step: '4',
      title: 'Hire a Habal-Habal Motorcycle',
      desc: 'Hire a habal-habal to take you directly to the resort gate. Standard rate is ₱100 per person one-way. A single motorcycle can carry 2 pax.',
      duration: '15 mins rough road',
      landmark: 'Unpaved Forest Access Road'
    }
  ];

  const privateSteps = [
    {
      step: '1',
      title: 'Head South on Masterson Ave',
      desc: 'From CDO town center, take Masterson Avenue (Lumbia Road). Drive straight past the old Lumbia airport.',
      duration: 'Start point',
      landmark: 'Masterson Ave / Uptown CDO'
    },
    {
      step: '2',
      title: 'Follow the CDO-Talakag Highway',
      desc: 'Drive along the paved highway. You will cross Bayanga, Mambuaya, and Dansolihon. Enjoy the pine trees and cool mountain air.',
      duration: '35 mins drive',
      landmark: 'Main Highway Route'
    },
    {
      step: '3',
      title: 'Cross the Mangalay Bridge',
      desc: 'Mangalay Bridge is the major landmark. Shortly after crossing this bridge, keep your eyes on the left side of the road for the crossing sign.',
      duration: 'Boundary point',
      landmark: 'Mangalay Bridge'
    },
    {
      step: '4',
      title: 'Turn Left into Tignapoloan Crossing',
      desc: 'Make a left turn at the Tignapoloan crossing dirt road. Drive slowly for 4.5 kilometers down the unpaved road to the resort parking lot.',
      duration: '15 mins dirt road',
      landmark: 'Sinulom Resort Parking (₱50)'
    }
  ];

  const currentSteps = activeTab === 'commuter' ? commuteSteps : privateSteps;

  return (
    <div id="directions" className="directions-container animate-fade-in">
      <div className="directions-header">
        <h2>How to Get There</h2>
        <p className="section-subtitle">Detailed travel coordinates, landmarks, and navigation steps from Cagayan de Oro City.</p>
      </div>

      <div className="directions-grid">
        {/* Navigation panel */}
        <div className="navigation-steps-panel glass-card">
          <div className="directions-tabs">
            <button
              className={`direction-tab-btn ${activeTab === 'commuter' ? 'active' : ''}`}
              onClick={() => setActiveTab('commuter')}
            >
              <Bus size={18} /> Commuter Guide
            </button>
            <button
              className={`direction-tab-btn ${activeTab === 'private' ? 'active' : ''}`}
              onClick={() => setActiveTab('private')}
            >
              <Car size={18} /> Driving Guide
            </button>
          </div>

          <div className="step-cards-list">
            {currentSteps.map((s, idx) => (
              <div className="direction-step-card" key={idx}>
                <div className="step-badge">{s.step}</div>
                <div className="step-info">
                  <div className="step-meta">
                    <span className="step-duration">{s.duration}</span>
                    <span className="step-landmark">Landmark: {s.landmark}</span>
                  </div>
                  <h4 className="step-card-title">{s.title}</h4>
                  <p className="step-card-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coordinates and Tips */}
        <div className="directions-sidebar">
          <div className="glass-card coordinates-card">
            <h3>Geographic Coordinates</h3>
            <div className="coords-box">
              <Compass className="coords-icon text-emerald spin-slow" />
              <div className="coords-text">
                <span className="coords-val">8.2618° N, 124.6062° E</span>
                <span className="coords-lbl">Tignapoloan-Talakag Border</span>
              </div>
            </div>
            
            <a 
              href="https://maps.google.com/?q=Sinulom+Falls" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-blue btn-full"
              style={{ marginTop: '16px' }}
            >
              <Navigation size={16} /> Open in Google Maps
            </a>
          </div>

          <div className="glass-card warning-sidebar-card">
            <h3>Road Advisory</h3>
            <div className="road-alert-item warning">
              <AlertCircle size={20} className="shrink-none" />
              <div>
                <strong>Unpaved Roads (4.5 KM):</strong>
                <p>The access road from Tignapoloan Crossing to the resort is a dirt road with loose gravel. It can get muddy during rainy days. A vehicle with good ground clearance is recommended.</p>
              </div>
            </div>

            <div className="road-alert-item info">
              <Info size={20} className="shrink-none" />
              <div>
                <strong>Travel Duration:</strong>
                <p>Total travel time is approximately 1 to 1.5 hours from CDO Carmen Market depending on road conditions and vehicle speed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .directions-container {
          padding: 60px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .directions-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .directions-header h2 {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .directions-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
        }

        .navigation-steps-panel {
          padding: 0;
          overflow: hidden;
        }

        .directions-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid rgba(16, 185, 129, 0.1);
        }

        .direction-tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          border: none;
          background: rgba(0, 0, 0, 0.1);
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .direction-tab-btn:hover {
          color: var(--text-white);
          background: rgba(255, 255, 255, 0.02);
        }

        .direction-tab-btn.active {
          color: var(--text-emerald);
          background: transparent;
          border-bottom: 2px solid var(--primary-light);
        }

        .step-cards-list {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .direction-step-card {
          display: flex;
          gap: 20px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .direction-step-card:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .step-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--text-white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-family: var(--font-heading);
          flex-shrink: 0;
          margin-top: 4px;
        }

        .step-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .step-meta {
          display: flex;
          gap: 16px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .step-duration {
          color: var(--text-blue);
        }

        .step-landmark {
          color: var(--text-muted);
        }

        .step-card-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-white);
        }

        .step-card-desc {
          font-size: 14px;
          color: var(--text-silver);
          line-height: 1.5;
        }

        /* Sidebar styling */
        .directions-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .coordinates-card, .warning-sidebar-card {
          padding: 24px;
        }

        .coords-box {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-light);
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
        }

        .coords-icon {
          width: 24px;
          height: 24px;
        }

        .coords-text {
          display: flex;
          flex-direction: column;
        }

        .coords-val {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-white);
          font-family: var(--font-heading);
        }

        .coords-lbl {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .road-alert-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid;
          margin-top: 16px;
        }

        .road-alert-item.warning {
          background: rgba(217, 119, 6, 0.05);
          border-color: rgba(217, 119, 6, 0.15);
          color: #fde047;
        }

        .road-alert-item.warning strong {
          color: var(--accent-gold);
        }

        .road-alert-item.info {
          background: rgba(56, 189, 248, 0.05);
          border-color: rgba(56, 189, 248, 0.15);
          color: #bae6fd;
        }

        .road-alert-item.info strong {
          color: var(--text-blue);
        }

        .road-alert-item strong {
          display: block;
          font-size: 13.5px;
          margin-bottom: 4px;
        }

        .road-alert-item p {
          font-size: 12.5px;
          line-height: 1.4;
          color: var(--text-silver);
        }

        @media (max-width: 992px) {
          .directions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
