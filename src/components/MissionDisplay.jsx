import React from 'react';

/**
 * MissionDisplay Component
 * Displays the current mission/order that needs to be completed
 * 
 * @param {Object} props
 * @param {Object} props.mission - Current mission data
 */
export default function MissionDisplay({ mission }) {
    return (
        <div className="mission-display">
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>
            
            <div className="mission-header">Current Order</div>
            <p>{mission?.text || 'Loading mission...'}</p>
        </div>
    );
} 