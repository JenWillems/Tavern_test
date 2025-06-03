import React from 'react';

/**
 * ScoreTime Component
 * Displays the current score and remaining time
 * 
 * @param {Object} props
 * @param {number} props.score - Current score
 * @param {number} props.timeLeft - Time remaining in seconds
 */
export default function ScoreTime({ score, timeLeft }) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="score-time">
            <div className="score">
                Score: {score}
            </div>
            <div className="time">
                Time: {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
        </div>
    );
} 