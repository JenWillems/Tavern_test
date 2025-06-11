import React from 'react';

/**
 * Clock Component
 * Displays an antique-style clock with minute and second hands
 * 
 * @param {Object} props
 * @param {number} props.timeLeft - Time remaining in seconds
 * @param {number} props.day - Current day number
 * @param {number} props.totalDays - Total number of days in the game
 */
export default function Clock({ timeLeft, day, totalDays = 30 }) {
    // Convert timeLeft to minutes and seconds for the hands
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    // Calculate rotation angles for the hands
    // For a 2-minute game (120 seconds):
    // - Minute hand should make 1/30th of a full rotation (12 deg) per second
    // - Second hand should make 1/60th of a full rotation (6 deg) per second
    const minuteRotation = ((120 - timeLeft) * (360 / 120)) % 360;
    const secondRotation = ((60 - seconds) * 6) % 360;

    return (
        <div className="clock-container">
            <div className="day-counter">
                Day {day} of {totalDays}
            </div>
            <div className="clock">
                <div className="clock-face">
                    {/* Clock numbers */}
                    {[...Array(12)].map((_, i) => {
                        const number = i === 0 ? '12' : i;
                        const angle = (i * 30) * (Math.PI / 180); // Convert to radians
                        const radius = 42; // Increased distance from center
                        
                        // Calculate x and y positions using trigonometry
                        const x = Math.sin(angle) * radius;
                        const y = -Math.cos(angle) * radius; // Negative because Y grows downward in CSS
                        
                        return (
                            <span 
                                key={i} 
                                className="clock-number"
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: `translate(${x}px, ${y}px)`
                                }}
                            >
                                {number}
                            </span>
                        );
                    })}
                    
                    {/* Clock hands */}
                    <div 
                        className="hand minute-hand"
                        style={{ transform: `rotate(${minuteRotation}deg)` }}
                    />
                    <div 
                        className="hand second-hand"
                        style={{ transform: `rotate(${secondRotation}deg)` }}
                    />
                    <div className="center-pin" />
                </div>
                
                {/* Digital display for clarity */}
                <div className="clock-digital">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
            </div>
        </div>
    );
} 