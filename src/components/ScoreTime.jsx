import React from 'react';

/**
 * ScoreTime Component
 * Displays the remaining time
 * 
 * @param {Object} props
 * @param {number} props.timeLeft - Time remaining in seconds
 */
export default function ScoreTime({ timeLeft }) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="score-time">
            <div className="time">
                Time: {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
        </div>
    );
} 