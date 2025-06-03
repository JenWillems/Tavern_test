import React from 'react';

/**
 * GameOverScreen Component
 * Displays the final game over screen with stats and restart option
 * 
 * @param {Object} props
 * @param {number} props.finalMoney - Final money balance
 * @param {number} props.daysPlayed - Total days played
 * @param {number} props.totalDrinks - Total drinks served
 * @param {Function} props.onRestart - Function to handle game restart
 */
export default function GameOverScreen({ finalMoney, daysPlayed, totalDrinks, onRestart }) {
    const isVictory = finalMoney >= 0;
    
    return (
        <div className="game-over-overlay">
            <div className="game-over-modal">
                <h2>{isVictory ? '🎉 Victory!' : '😢 Game Over'}</h2>
                
                <div className="stats-section">
                    <h3>Final Stats</h3>
                    <div className="stat-row">
                        <span>Days Survived:</span>
                        <strong>{daysPlayed}</strong>
                    </div>
                    <div className="stat-row">
                        <span>Total Drinks Served:</span>
                        <strong>{totalDrinks}</strong>
                    </div>
                    <div className="stat-row">
                        <span>Final Balance:</span>
                        <strong className={finalMoney >= 0 ? 'positive' : 'negative'}>
                            {finalMoney}g
                        </strong>
                    </div>
                </div>

                {isVictory ? (
                    <div className="victory-section">
                        <h3>🏆 Congratulations!</h3>
                        <p>You've successfully paid off your debt and saved The Tipsy Dragon!</p>
                        <p>The Merchant's Guild has recognized your business acumen.</p>
                    </div>
                ) : (
                    <div className="defeat-section">
                        <h3>📜 Notice of Closure</h3>
                        <p>The Merchant's Guild has seized The Tipsy Dragon due to outstanding debts.</p>
                        <p>Better luck with your next venture...</p>
                    </div>
                )}

                <button 
                    onClick={onRestart}
                    className="button button-gold"
                >
                    {isVictory ? 'Start New Game' : 'Try Again'}
                </button>
            </div>
        </div>
    );
} 