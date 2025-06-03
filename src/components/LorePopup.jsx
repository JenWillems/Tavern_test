import React from 'react';

/**
 * LorePopup Component
 * Displays game lore and instructions at the start
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Function to close the popup
 */
export default function LorePopup({ onClose }) {
    return (
        <div className="lore-popup-overlay">
            <div className="lore-popup">
                <h2>Welcome to The Tipsy Dragon!</h2>
                
                <div className="lore-content">
                    <p>
                        You've inherited <strong>The Tipsy Dragon</strong>, a once-legendary tavern known 
                        throughout the realm for its exotic drinks and warm atmosphere. However, the previous 
                        owner left you with a massive debt of <strong>20,000 gold</strong> owed to the 
                        Merchants Guild.
                    </p>
                    
                    <p>
                        You have <strong>30 days</strong> to save the tavern by paying off the debt. Each day, 
                        you'll serve drinks to a variety of customers, from common folk to legendary heroes. 
                        Mix ingredients carefully, add garnishes, and choose the right preparation method to 
                        create the perfect drinks.
                    </p>
                    
                    <p>
                        But beware - the Merchants Guild charges <strong>1,000 gold per day</strong> in debt 
                        maintenance fees. You'll need to earn more than that to make progress on your debt.
                    </p>
                </div>

                <div className="lore-goals">
                    <h3>Your Goals</h3>
                    <ul>
                        <li>Pay off the 20,000 gold debt within 30 days</li>
                        <li>Earn money by serving drinks to customers</li>
                        <li>Upgrade your tavern to increase profits</li>
                        <li>Discover secret recipes for bonus rewards</li>
                    </ul>
                </div>

                <button 
                    className="button button-gold"
                    onClick={onClose}
                >
                    Start Serving!
                </button>
            </div>
        </div>
    );
} 