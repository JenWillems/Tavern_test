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
            <div className="lore-popup" style={{ maxWidth: '800px', minWidth: '520px', width: '60vw' }}>
                <h2>Welcome, Keeper of The Tipsy Dragon!</h2>
                <div className="lore-content">
                    <p>
                        <strong>The Tipsy Dragon</strong> was once the heart of the realm—a place of legends, secrets, and the finest drinks. Now, its fate is in your hands.
                    </p>
                    <p>
                        The previous owner vanished, leaving you a <strong>debt of 20,000 gold</strong> to the Merchants Guild. You have <strong>30 days</strong> to pay it off—or lose the tavern forever.
                    </p>
                    <ul style={{ margin: '18px 0 0 0', paddingLeft: '20px', fontSize: '1.08em' }}>
                        <li><strong>Mix:</strong> Combine up to four ingredients—Firewater, Berry, Herbal, Honey.</li>
                        <li><strong>Garnish:</strong> Add Mint Leaf, Lemon Twist, Chili Flake, or Sugar Rim.</li>
                        <li><strong>Prepare:</strong> Stirred, Shaken, or Poured—each changes the drink.</li>
                        <li><strong>Serve:</strong> Match the order for gold. Miss, and you lose out.</li>
                        <li><strong>Upgrade & Discover:</strong> Improve your tavern and find secret recipes for big rewards.</li>
                    </ul>
                    <p style={{ marginTop: '16px' }}>
                        <strong>Beware:</strong> You still have to pay <strong>rent food and booze,</strong> so be careful how you spend your gold. Only the clever survive.
                    </p>
                    <p style={{ marginTop: '14px', fontStyle: 'italic', color: '#ffd700' }}>
                        The fire is lit, the mugs are ready. Will you become a legend?
                    </p>
                </div>
                <div className="lore-goals">
                    <h3>Your Path to Glory</h3>
                    <ul>
                        <li>Pay off the 20,000 gold debt in 30 days</li>
                        <li>Master mixology and serve every customer</li>
                        <li>Upgrade, discover secrets, and earn your legend</li>
                    </ul>
                </div>
                <button 
                    className="button button-gold"
                    onClick={onClose}
                >
                    Begin Your Legend
                </button>
            </div>
        </div>
    );
} 