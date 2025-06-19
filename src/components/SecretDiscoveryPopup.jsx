import React from 'react';
import './SecretDiscoveryPopup.css';

/**
 * SecretDiscoveryPopup Component
 * Displays a popup when a secret cocktail is discovered
 * 
 * @param {Object} props
 * @param {Object} props.discoveredSecret - The discovered secret cocktail data
 * @param {Function} props.onClose - Function to close the popup
 * @param {Function} props.resetMix - Function to reset the mixing glass
 * @param {Function} props.setMission - Function to set new mission
 */
export default function SecretDiscoveryPopup({ discoveredSecret, onClose, resetMix, setMission }) {
    const handleClose = () => {
        onClose();
        resetMix();
        setMission();
    };

    if (!discoveredSecret) return null;

    return (
        <div className="secret-discovery">
            {discoveredSecret.name === 'FIREBALL' ? (
                <div className="secret-discovery-content fireball" style={{ background: 'linear-gradient(135deg, #0a0300 80%, #ff3300 100%)', boxShadow: '0 0 80px 30px #ff3300, 0 0 160px 40px #000 inset' }}>
                    <div className="fire-anim" style={{ width: 220, height: 220, margin: '0 auto 24px auto', backgroundSize: 'cover', boxShadow: '0 0 80px 40px #ff3300, 0 0 120px 60px #ff6600' }} />
                    <h2 style={{ color: '#ffae42', fontSize: '2.5em', textShadow: '0 0 32px #ff6600, 0 0 64px #ff3300' }}>�� FIREBALL! 🔥</h2>
                    <div className="explosion-anim" style={{ width: 260, height: 160, margin: '0 auto 24px auto', backgroundSize: 'cover', boxShadow: '0 0 60px 30px #ffae42' }} />
                    <div className="video-container" style={{ margin: '20px 0' }}>
                        <iframe
                            width="480"
                            height="270"
                            src="https://www.youtube.com/embed/WMDwy0D-1aA?autoplay=1"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title="Fireball Secret Video"
                        ></iframe>
                    </div>
                    <div className="notes" style={{ background: 'rgba(10,0,0,0.92)', border: '2px solid #ff3300', color: '#fff3e0', fontSize: '1.3em', textShadow: '0 0 16px #ff3300' }}>
                        <strong>"Doesn't matter how big the room, I cast fireball!"</strong>
                        <br/>
                        The legendary FIREBALL cocktail burns again. The flames consume the darkness.
                    </div>
                    <button onClick={handleClose} style={{ background: 'linear-gradient(90deg, #ff3300 40%, #ffae42 100%)', color: '#fff', border: '2px solid #ffae42', fontSize: '1.3em', boxShadow: '0 0 20px #ff3300', marginTop: 32 }}>
                        Close
                    </button>
                </div>
            ) : (
                <div className="secret-discovery-content">
                    <div className="mlg-overlay"></div>
                    <div className="doritos doritos-1">🔺</div>
                    <div className="doritos doritos-2">🔺</div>
                    <div className="doritos doritos-3">🔺</div>
                    <div className="doritos doritos-4">🔺</div>
                    <div className="glasses">🕶️</div>
                    <div className="airhorn airhorn-left">📢</div>
                    <div className="airhorn airhorn-right">📢</div>
                    <div className="mlg-emoji mlg-emoji-1">👾</div>
                    <div className="mlg-emoji mlg-emoji-2">🎮</div>
                    <div className="mlg-emoji mlg-emoji-3">🎯</div>
                    <div className="mlg-emoji mlg-emoji-4">💯</div>
                    <div className="hitmarker hitmarker-1">✖️</div>
                    <div className="hitmarker hitmarker-2">✖️</div>
                    <div className="mountain-dew mountain-dew-1">🥤</div>
                    <div className="mountain-dew mountain-dew-2">🥤</div>
                    
                    {/* YouTube player for MLG music */}
                    <div className="mlg-music">
                        <iframe
                            width="0"
                            height="0"
                            src="https://www.youtube.com/embed/t7AajPCSEMc?autoplay=1"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="MLG Background Music"
                        ></iframe>
                    </div>
                    
                    <h2>OH BABY A TRIPLE! 🎯</h2>
                    <p className="subtitle">MOM GET THE CAMERA!!1!</p>
                    <div className="wow-text">W🎯W</div>
                    <p className="recipe-name">{discoveredSecret.name}</p>
                    <div className="notes">
                        {discoveredSecret.notes}
                        <div className="hitmarker-container">
                            <span className="hitmarker-inner">✖️</span>
                        </div>
                    </div>
                    <p className="bonus">
                        +50 GOLD GET REKT M8!
                        <br/>
                        <small>*WOMBO COMBO*</small>
                    </p>
                    <div className="mlg-score">
                        <span className="score-text">+420</span>
                        <span className="score-text">NO SCOPE</span>
                    </div>
                    <button onClick={handleClose}>
                        360 NO SCOPE
                    </button>
                </div>
            )}
        </div>
    );
} 