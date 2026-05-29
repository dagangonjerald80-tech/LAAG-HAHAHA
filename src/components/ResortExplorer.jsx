import React, { useState } from 'react';
import { Camera, Map, CheckCircle2, ShieldAlert, Award, Star, Compass } from 'lucide-react';

export default function ResortExplorer() {
  const [selectedLandmark, setSelectedLandmark] = useState('falls');

  const landmarks = {
    falls: {
      title: 'Sinulom Falls (28 Cascades)',
      subtitle: 'Talakag, Bukidnon (Across CDO River)',
      image: '/sinulom_falls.png',
      description: 'The crowning jewel of the resort. Sinulom Falls is a rare geological wonder featuring 28 active waterfalls cascading down a vertical green cliff face directly into the Cagayan de Oro River. Geographically situated on the Bukidnon side, it is viewed in full glory from the resort deck on the Cagayan de Oro side.',
      safety: 'Cross the CDO river only with guides and when water levels are low. Wear life vests.',
      photoTip: 'Shoot from the middle of the hanging bridge during morning hours (08:00 AM - 10:00 AM) for optimal front-lighting on the cascades.',
      rating: 4.9
    },
    spring: {
      title: 'Bolao Cold Spring Pool',
      subtitle: 'Tignapoloan, Cagayan de Oro City',
      image: '/bolao_cold_spring.png',
      description: 'A crystal-clear, refreshing natural cold spring pool located on the resort property. The water flows continuously from the mountain springs and remains remarkably chilly even during hot summer afternoons. The pool is surrounded by lush green palm trees and rustic open-air cottages.',
      safety: 'The pool depth ranges from 3ft to 6ft. Supervise children closely. No diving in shallow areas.',
      photoTip: 'Capture the clear waters showing the river stones at the bottom using a polarizing filter on your camera or phone lens.',
      rating: 4.8
    },
    bridge: {
      title: 'The Hanging Suspension Bridge',
      subtitle: 'Connecting CDO and Bukidnon',
      image: '/sinulom_falls.png', // Fallback or crop
      description: 'An adventurous wooden suspension bridge spanning across the Cagayan de Oro River. Walking across the bridge offers a panoramic 360-degree view of the river gorge, the lush mountain forests, and the cascading waterfalls. It is a thrilling walk with a mild swing.',
      safety: 'Strictly maximum of 5 people on the bridge at any given time. Hold on to the wire railings.',
      photoTip: 'Get a low-angle shot from either end of the bridge, capturing the lines leading toward the cascading falls in the background.',
      rating: 4.7
    },
    river: {
      title: 'Cagayan de Oro River',
      subtitle: 'The Natural Boundary',
      image: '/bolao_cold_spring.png', // Fallback or crop
      description: 'The powerful river flowing directly beneath the falls. When the weather is clear, the river flows gently with a turquoise-green color, perfect for wading, tubing, and exploring the rocky shores. It serves as the physical border separating Cagayan de Oro City and Bukidnon Province.',
      safety: 'Currents can be deceptive. Never swim alone in the main river channel without a life vest.',
      photoTip: 'Position yourself near the large river boulders on the CDO bank to frame the river rapids in the foreground and the falls in the background.',
      rating: 4.6
    }
  };

  const current = landmarks[selectedLandmark];

  const amenities = [
    { name: 'Floating River Cottages', price: '₱1,500', desc: 'Allows you to picnic directly over the rushing river rapids.' },
    { name: 'Large Family Cottages', price: '₱1,200', desc: 'Spacious wooden huts suitable for up to 20 pax.' },
    { name: 'Medium Standard Cottages', price: '₱800', desc: 'Ideal for small groups of 8-12 pax.' },
    { name: 'Small Picnic Cottages', price: '₱500', desc: 'Cozy thatched-roof huts suitable for up to 6 pax.' },
    { name: 'Life Vest Rental', price: '₱50 / piece', desc: 'Mandatory for river crossing and swimming in deep areas.' },
    { name: 'Grilling Station', price: 'FREE', desc: 'Included with cottage rentals. Bring your own charcoal.' }
  ];

  return (
    <div id="explore" className="explorer-container animate-fade-in">
      <div className="explorer-header">
        <h2>Interactive Resort Explorer</h2>
        <p className="section-subtitle">Take a virtual tour of the natural landmarks and explore cottage rates and resort guidelines.</p>
      </div>

      {/* Landmark Explorer */}
      <div className="landmark-explorer glass-card">
        {/* Left Side: Landmark selector list */}
        <div className="landmark-nav">
          <h3>Natural Landmarks</h3>
          <div className="nav-buttons">
            {Object.keys(landmarks).map((key) => (
              <button
                key={key}
                className={`nav-btn ${selectedLandmark === key ? 'active' : ''}`}
                onClick={() => setSelectedLandmark(key)}
              >
                <Compass size={16} />
                <div className="nav-btn-text">
                  <span className="nav-btn-title">{landmarks[key].title.split(' (')[0]}</span>
                  <span className="nav-btn-sub">{landmarks[key].subtitle.split(',')[0]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Landmark showcase */}
        <div className="landmark-showcase">
          <div 
            className="showcase-image" 
            style={{ backgroundImage: `url(${current.image})` }}
            role="img"
            aria-label={current.title}
          >
            <div className="rating-badge">
              <Star size={14} className="fill-gold text-gold" />
              <span>{current.rating} / 5.0</span>
            </div>
            <div className="showcase-header-overlay">
              <span className="showcase-subtitle">{current.subtitle}</span>
              <h3 className="showcase-title">{current.title}</h3>
            </div>
          </div>

          <div className="showcase-details">
            <p className="showcase-desc">{current.description}</p>
            
            <div className="tips-grid">
              <div className="tip-box safety-tip">
                <h4 className="tip-title"><ShieldAlert size={16} /> Safety Guidelines</h4>
                <p>{current.safety}</p>
              </div>

              <div className="tip-box photo-tip">
                <h4 className="tip-title"><Camera size={16} /> Photography Tip</h4>
                <p>{current.photoTip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Rules Grid */}
      <div className="info-grid">
        {/* Rates & Rentals */}
        <div className="rates-card glass-card">
          <h3 className="card-title-icon"><Award size={20} className="text-emerald" /> Cottage Rates & Gear rentals</h3>
          <div className="amenities-list">
            {amenities.map((item, idx) => (
              <div className="amenity-row" key={idx}>
                <div className="amenity-info">
                  <span className="amenity-name">{item.name}</span>
                  <span className="amenity-desc">{item.desc}</span>
                </div>
                <span className="amenity-price">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resort Guidelines & Corkage */}
        <div className="rules-card glass-card">
          <h3 className="card-title-icon"><Map size={20} className="text-blue" /> Resort Guidelines & Policies</h3>
          
          <div className="rules-section">
            <div className="rule-item">
              <CheckCircle2 size={18} className="text-emerald shrink-none" />
              <div>
                <strong>Zero Corkage Fee:</strong>
                <p>Feel free to bring all your own food, drinks, and snacks. There are no extra fees for bringing outside food, making it highly budget-friendly.</p>
              </div>
            </div>

            <div className="rule-item">
              <CheckCircle2 size={18} className="text-emerald shrink-none" />
              <div>
                <strong>Eco-Tourism & Trash:</strong>
                <p>Strictly "Leave No Trace" policy. You must clean up your cottage area before leaving and dump trash in designated trash bags.</p>
              </div>
            </div>

            <div className="rule-item">
              <CheckCircle2 size={18} className="text-emerald shrink-none" />
              <div>
                <strong>Electricity & Signals:</strong>
                <p>Electricity is limited in the cottages. Mobile signal can be weak or intermittent (best for digital detoxes!). Bring loaded power banks.</p>
              </div>
            </div>

            <div className="rule-item">
              <CheckCircle2 size={18} className="text-emerald shrink-none" />
              <div>
                <strong>Cash is King:</strong>
                <p>There are no ATMs or credit card terminals at the resort or in Tignapoloan. Ensure you withdraw sufficient cash in CDO Carmen before leaving.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .explorer-container {
          padding: 60px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .explorer-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .explorer-header h2 {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .landmark-explorer {
          display: grid;
          grid-template-columns: 320px 1fr;
          min-height: 520px;
          overflow: hidden;
          margin-bottom: 48px;
        }

        .landmark-nav {
          background: rgba(0, 0, 0, 0.2);
          border-right: 1px solid rgba(16, 185, 129, 0.1);
          padding: 24px;
        }

        .landmark-nav h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-white);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
        }

        .nav-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          color: var(--text-muted);
          text-align: left;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .nav-btn:hover {
          color: var(--text-white);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .nav-btn.active {
          color: var(--text-white);
          background: rgba(16, 185, 129, 0.12);
          border-color: var(--primary-light);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.1);
        }

        .nav-btn-text {
          display: flex;
          flex-direction: column;
        }

        .nav-btn-title {
          font-size: 14px;
          font-weight: 600;
        }

        .nav-btn-sub {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .nav-btn.active .nav-btn-sub {
          color: var(--text-emerald);
        }

        .landmark-showcase {
          display: flex;
          flex-direction: column;
        }

        .showcase-image {
          height: 300px;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 24px;
        }

        .showcase-image::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(8, 15, 13, 0.9) 0%, rgba(8, 15, 13, 0.2) 60%, transparent 100%);
        }

        .rating-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(8, 15, 13, 0.8);
          border: 1px solid rgba(251, 191, 36, 0.3);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-gold);
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 2;
        }

        .showcase-header-overlay {
          z-index: 2;
        }

        .showcase-title {
          font-size: 26px;
          font-weight: 700;
          color: var(--text-white);
        }

        .showcase-subtitle {
          font-size: 13px;
          color: var(--text-blue);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .showcase-details {
          padding: 24px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .showcase-desc {
          font-size: 15px;
          color: var(--text-silver);
          line-height: 1.6;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .tip-box {
          padding: 16px;
          border-radius: 8px;
          border: 1px solid;
          font-size: 13.5px;
        }

        .tip-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .safety-tip {
          background: rgba(248, 113, 113, 0.05);
          border-color: rgba(248, 113, 113, 0.15);
          color: #fca5a5;
        }

        .safety-tip .tip-title {
          color: #f87171;
        }

        .photo-tip {
          background: rgba(56, 189, 248, 0.05);
          border-color: rgba(56, 189, 248, 0.15);
          color: #bae6fd;
        }

        .photo-tip .tip-title {
          color: var(--text-blue);
        }

        /* Info Grid (rates and rules) */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-top: 32px;
        }

        .rates-card, .rules-card {
          padding: 32px;
        }

        .amenities-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }

        .amenity-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .amenity-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .amenity-info {
          display: flex;
          flex-direction: column;
        }

        .amenity-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-white);
        }

        .amenity-desc {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .amenity-price {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-emerald);
          font-family: var(--font-heading);
        }

        .rules-section {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-top: 20px;
        }

        .rule-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .shrink-none {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .rule-item strong {
          display: block;
          font-size: 14px;
          color: var(--text-white);
          font-weight: 600;
          margin-bottom: 2px;
        }

        .rule-item p {
          font-size: 13px;
          color: var(--text-silver);
          line-height: 1.5;
        }

        @media (max-width: 992px) {
          .landmark-explorer {
            grid-template-columns: 1fr;
          }
          .landmark-nav {
            border-right: none;
            border-bottom: 1px solid rgba(16, 185, 129, 0.1);
          }
          .nav-buttons {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 8px;
          }
          .nav-btn {
            flex-shrink: 0;
            width: 220px;
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
