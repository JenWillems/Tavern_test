import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';

/**
 * Clock Component
 * Displays an antique-style clock with minute and second hands
 * Implements progressive time reduction system:
 * - Days 1-3: 5 minutes (tutorial period)
 * - Days 4-15: 3 minutes (normal period)
 * - Days 16+: 2 minutes (hard period)
 * - Extra time upgrade adds 1 minute
 * 
 * @param {Object} props
 * @param {Function} props.onDayEnd - Callback when the day ends
 * @param {boolean} props.extraTime - Whether extra time upgrade is active
 * @param {number} props.day - Current day number
 * @param {number} props.totalDays - Total number of days in the game
 * @param {boolean} props.showTutorial - Whether the tutorial is currently active
 */
const Clock = forwardRef(({ onDayEnd, extraTime = false, day, totalDays = 30, showTutorial = false }, ref) => {
    // Time configurations in seconds
    const TIME_CONFIGS = {
        TUTORIAL: 300,    // 5 minutes for first 3 days
        NORMAL: 180,      // 3 minutes for days 4-15
        HARD: 120,        // 2 minutes for days 16+
        EXTRA_TIME: 60    // 1 minute extra with upgrade
    };

    // Calculate base time based on current day
    const getBaseTime = useMemo(() => {
        if (day <= 3) return TIME_CONFIGS.TUTORIAL;
        if (day <= 15) return TIME_CONFIGS.NORMAL;
        return TIME_CONFIGS.HARD;
    }, [day]);

    // State for time management
    const [timeLeft, setTimeLeft] = useState(getBaseTime + (extraTime ? TIME_CONFIGS.EXTRA_TIME : 0));
    const [isRunning, setIsRunning] = useState(true);
    
    // Expose reset timer function to parent component
    useImperativeHandle(ref, () => ({
        resetTimer: () => {
            setTimeLeft(getBaseTime + (extraTime ? TIME_CONFIGS.EXTRA_TIME : 0));
            setIsRunning(true);
        }
    }));

    // Update time when day changes or extra time upgrade is purchased
    useEffect(() => {
        setTimeLeft(getBaseTime + (extraTime ? TIME_CONFIGS.EXTRA_TIME : 0));
    }, [day, extraTime, getBaseTime]);

    // Timer effect - handles countdown and day end
    useEffect(() => {
        let timer;
        if (isRunning && !showTutorial) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsRunning(false);
                        onDayEnd();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [onDayEnd, isRunning, showTutorial]);

    // Calculate time display values
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    // Calculate hand rotations
    // Minute hand: rotates based on current time period (5min/3min/2min)
    // Second hand: rotates 360 degrees per minute (6 degrees per second)
    const minuteRotation = ((getBaseTime - timeLeft) * (360 / getBaseTime)) % 360;
    const secondRotation = ((60 - seconds) * 6) % 360;

    // Generate clock numbers with proper positioning
    const clockNumbers = useMemo(() => 
        [...Array(12)].map((_, i) => {
            const number = i === 0 ? '12' : i;
            const angle = (i * 30) * (Math.PI / 180);
            const radius = 42;
            const x = Math.sin(angle) * radius;
            const y = -Math.cos(angle) * radius;
            
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
        }), []);

    return (
        <div className="clock-container">
            <div className="day-counter">
                Day {day} of {totalDays}
            </div>
            <div className="clock">
                <div className="clock-face">
                    {/* Clock numbers */}
                    {clockNumbers}
                    
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
});

export default Clock; 