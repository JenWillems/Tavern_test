import React from 'react';
import './App.css';

export default function LorePopup({ onClose }) {
    return (
        <div className="lore-popup-overlay">
            <div className="lore-popup">
                <h2>🍺 Welcome to The Tipsy Dragon 🐉</h2>
                
                <div className="lore-content">
                    <p>
                        You've inherited your uncle's beloved tavern, The Tipsy Dragon, 
                        but there's a catch... The old place is drowning in debt, a staggering 
                        <strong> 20,000 gold pieces</strong> worth!
                    </p>
                    
                    <p>
                        The local Merchants Guild has given you an ultimatum: 
                        <strong> 30 days</strong> to turn this place around or face eviction. 
                        Your uncle's reputation for exotic cocktails and magical brews is 
                        legendary - it's time to put those secret recipes to good use!
                    </p>
                    
                    <p>
                        With a mix of traditional favorites and some... creative innovations, 
                        you might just save this beloved establishment. The regulars are counting 
                        on you, and rumors say some very special customers might drop by...
                    </p>

                    <div className="lore-goals">
                        <h3>Your Mission:</h3>
                        <ul>
                            <li>Pay off the 20,000 gold debt</li>
                            <li>Survive for 30 days</li>
                            <li>Master the art of magical mixology</li>
                            <li>Keep The Tipsy Dragon's legacy alive!</li>
                        </ul>
                    </div>
                </div>

                <button className="button button-gold" onClick={onClose}>
                    Begin Your Journey
                </button>
            </div>
        </div>
    );
} 