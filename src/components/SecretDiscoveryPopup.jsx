import React from 'react';

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
            {discoveredSecret.name === 'Tralalero Tralala' ? (
                <div className="brainrot-content sea-theme">
                    {/* Vine boom sound - preload for better performance */}
                    <audio id="vineBoom" preload="auto" autoPlay>
                        <source src="https://www.myinstants.com/media/sounds/vine-boom.mp3" type="audio/mp3" />
                    </audio>

                    {/* Main video content */}
                    <div className="video-container">
                        <iframe
                            width="800"
                            height="315"
                            src="https://www.youtube.com/embed/ssOLDdXDUjQ?autoplay=1&modestbranding=1&controls=0"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Tralalero Video"
                        ></iframe>
                    </div>

                    {/* Optimized explosion GIFs - single GIF reused for better performance */}
                    <div className="explosion-container" aria-hidden="true">
                        <img 
                            className="explosion explosion-1" 
                            src="https://media.tenor.com/images/16787d100a9f4a8349687f6e00c594bb/tenor.gif" 
                            alt="" 
                            loading="eager"
                        />
                        <img 
                            className="explosion explosion-2" 
                            src="https://media.tenor.com/images/16787d100a9f4a8349687f6e00c594bb/tenor.gif" 
                            alt="" 
                            loading="eager"
                        />
                    </div>

                    {/* Main content */}
                    <div className="content-wrapper">
                        <h2 className="brainrot-title">tralalero tralala</h2>
                        
                        {/* Recipe info */}
                        <div className="recipe-container">
                            <p className="recipe-name">{discoveredSecret.name}</p>
                            <div className="recipe-notes">
                                {discoveredSecret.notes}
                            </div>
                        </div>

                        {/* Meme text */}
                        <div className="brainrot-bonus">
                            <span className="bonus-text">
                                Porco Dio e porco Allah
                                Ero con il mio fottuto figlio merdardo a giocare a Fortnite
                                Quando a un punto arriva mia nonna
                                Ornella Leccacappella
                            </span>
                            <span className="bonus-subtext">....god this generation is doomed</span>
                        </div>

                        {/* Close button */}
                        <button 
                            className="brainrot-button" 
                            onClick={handleClose}
                        >
                            return to land
                        </button>
                    </div>
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