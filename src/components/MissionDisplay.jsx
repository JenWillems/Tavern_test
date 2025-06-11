import React from 'react';

/**
 * MissionDisplay Component
 * Displays the current mission/order that needs to be completed
 * 
 * @param {Object} props
 * @param {Object} props.mission - Current mission data
 */
export default function MissionDisplay({ mission }) {
    // Handle loading state or no mission
    if (!mission) {
        return (
            <div className="mission-display">
                <div className="corner corner-tl"></div>
                <div className="corner corner-tr"></div>
                <div className="corner corner-bl"></div>
                <div className="corner corner-br"></div>
                
                <div className="mission-header">Current Order</div>
                <p>Loading mission...</p>
            </div>
        );
    }

    return (
        <div className="mission-display">
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>
            
            <div className="mission-header">Current Order</div>
            <p>{typeof mission === 'string' ? mission : mission.text}</p>
        </div>
    );
} 