import React from 'react';
import { Sun, CloudRain, AlertTriangle, ShieldCheck, Cloud, Compass } from 'lucide-react';

export default function HeroSection({ weather, setWeather, onStartPlanning }) {
  const weatherAdvisories = {
    sunny: {
      label: 'Sunny & Clear',
      icon: <Sun className="weather-icon text-amber" />,
      color: '#fbbf24',
      status: 'SAFE & OPTIMAL',
      statusColor: '#4ade80',
      description: 'Water is crystal clear. Trails are dry and fully accessible. Ideal for swimming and crossing the CDO River.'
    },
    cloudy: {
      label: 'Cloudy / Overcast',
      icon: <Cloud className="weather-icon text-slate" />,
      color: '#94a3b8',
      status: 'SAFE (WITH CAUTION)',
      statusColor: '#a3e635',
      description: 'Overcast weather, but fine for swimming. Keep an eye on the sky and local river water levels.'
    },
    rainy: {
      label: 'Light to Moderate Rain',
      icon: <CloudRain className="weather-icon text-sky" />,
      color: '#38bdf8',
      status: 'MODERATE RISK',
      statusColor: '#fb923c',
      description: 'Roads may be muddy and trails slippery. The Cagayan de Oro River might be slightly swollen or murky. Exercise caution.'
    },
    stormy: {
      label: 'Heavy Rain / Storm',
      icon: <AlertTriangle className="weather-icon text-rose" />,
      color: '#f87171',
      status: 'HIGH DANGER - SUSPENDED',
      statusColor: '#ef4444',
      description: 'DANGER: Flash flood warnings in Bukidnon and CDO River. Water activities and river crossings are suspended. Avoid traveling.'
    }
  };

  const currentAdvisory = weatherAdvisories[weather] || weatherAdvisories.sunny;

  return (
    <section className="hero-container animate-fade-in">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">
          <Compass size={16} className="spin-slow" />
          <span>VIRTUAL TRAVEL COMPANION</span>
        </div>
        
        <h1 className="hero-title">
          Laag Plan
          <span className="hero-subtitle">Sinulom Falls & Bolao Cold Spring</span>
        </h1>
        
        <p className="hero-desc">
          Plan your adventure to the dual nature wonder where 28 cascading springs meet the majestic Cagayan de Oro River, and submerge in the crystal-clear waters of Bolao.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onStartPlanning}>
            Start Itinerary Planner
          </button>
          <a href="#explore" className="btn btn-secondary">
            Explore Landmarks
          </a>
        </div>

        {/* Dynamic Weather Advisor widget */}
        <div className="weather-advisory-card glass-card">
          <div className="weather-advisory-header">
            <h3>Weather Safety Advisory</h3>
            <div className="weather-selector">
              <span className="selector-label">Simulate Weather:</span>
              <div className="selector-buttons">
                {Object.keys(weatherAdvisories).map((type) => (
                  <button
                    key={type}
                    className={`selector-btn ${weather === type ? 'active' : ''}`}
                    onClick={() => setWeather(type)}
                    title={weatherAdvisories[type].label}
                  >
                    {type === 'sunny' && <Sun size={14} />}
                    {type === 'cloudy' && <Cloud size={14} />}
                    {type === 'rainy' && <CloudRain size={14} />}
                    {type === 'stormy' && <AlertTriangle size={14} />}
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="weather-status-box" style={{ borderColor: currentAdvisory.color }}>
            <div className="weather-status-header">
              <div className="weather-status-info">
                {currentAdvisory.icon}
                <div>
                  <h4 className="weather-label">{currentAdvisory.label}</h4>
                  <p className="weather-status" style={{ color: currentAdvisory.statusColor }}>
                    Status: {currentAdvisory.status}
                  </p>
                </div>
              </div>
              <div className="safety-badge" style={{ backgroundColor: currentAdvisory.statusColor + '20', color: currentAdvisory.statusColor }}>
                {weather === 'sunny' || weather === 'cloudy' ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                <span>{weather === 'sunny' || weather === 'cloudy' ? 'Safe to Go' : 'Alert'}</span>
              </div>
            </div>
            <p className="weather-description">{currentAdvisory.description}</p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .hero-container {
          position: relative;
          padding: 80px 24px;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: linear-gradient(rgba(8, 15, 13, 0.6), rgba(8, 15, 13, 0.95)), url('/sinulom_falls.png');
          background-size: cover;
          background-position: center;
          border-bottom: 1px solid var(--border-light);
        }

        .hero-content {
          max-width: 900px;
          width: 100%;
          text-align: center;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 6px 16px;
          border-radius: 9999px;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 600;
          color: var(--text-emerald);
          letter-spacing: 1px;
          margin-bottom: 24px;
        }

        .spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-title {
          font-size: 64px;
          font-weight: 800;
          letter-spacing: -2px;
          line-height: 1.1;
          margin-bottom: 16px;
          background: linear-gradient(135deg, var(--text-white) 40%, var(--text-emerald));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          display: block;
          font-size: 28px;
          font-weight: 500;
          letter-spacing: -0.5px;
          color: var(--text-blue);
          -webkit-text-fill-color: initial;
          margin-top: 8px;
        }

        .hero-desc {
          font-size: 17px;
          color: var(--text-silver);
          max-width: 680px;
          margin-bottom: 32px;
          line-height: 1.7;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 48px;
          flex-wrap: wrap;
          justify-content: center;
        }

        /* Weather advisory styling */
        .weather-advisory-card {
          width: 100%;
          max-width: 760px;
          padding: 24px;
          text-align: left;
          background: rgba(18, 30, 26, 0.8);
          border: 1px solid var(--border-light);
        }

        .weather-advisory-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .weather-advisory-header h3 {
          font-size: 18px;
          font-weight: 600;
        }

        .weather-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .selector-label {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .selector-buttons {
          display: flex;
          gap: 6px;
          background: var(--bg-dark);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .selector-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .selector-btn:hover {
          color: var(--text-white);
          background: rgba(255, 255, 255, 0.05);
        }

        .selector-btn.active {
          color: var(--bg-dark);
          background: var(--text-emerald);
        }
        
        .selector-btn.active :global(.weather-icon) {
          color: var(--bg-dark);
        }

        .weather-status-box {
          border-left: 4px solid;
          background: rgba(0, 0, 0, 0.2);
          padding: 16px;
          border-radius: 8px;
        }

        .weather-status-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .weather-status-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        :global(.weather-icon) {
          width: 32px;
          height: 32px;
        }

        .weather-label {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-white);
        }

        .weather-status {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .safety-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .weather-description {
          font-size: 14px;
          color: var(--text-silver);
          line-height: 1.5;
          margin-top: 8px;
        }

        .capitalize {
          text-transform: capitalize;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 40px;
          }
          .hero-subtitle {
            font-size: 20px;
          }
          .weather-advisory-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .weather-selector {
            width: 100%;
            justify-content: space-between;
          }
          .selector-buttons {
            width: 100%;
            overflow-x: auto;
          }
          .selector-btn span {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
