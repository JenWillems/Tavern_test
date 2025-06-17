import React from 'react';
import './DrinkFeedbackPopup.css';

/**
 * DrinkFeedbackPopup Component
 * Displays feedback when a drink is served
 * 
 * @param {Object} props
 * @param {Object} props.result - The drink evaluation result
 * @param {Object} props.mission - The current mission
 * @param {Function} props.onClose - Function to close the popup
 */
export default function DrinkFeedbackPopup({ result, mission, onClose }) {
    const isCorrect = result.points > 0;
    const isKnownRecipe = result.isKnownRecipe;

    return (
        <div className="drink-feedback-overlay">
            <div className="drink-feedback-popup">
                <h2 className={isCorrect ? 'success' : 'failure'}>
                    {isCorrect ? 'Perfect!' : 'Not Quite Right...'}
                </h2>
                
                <div className="feedback-content">
                    <div className="drink-name">
                        <h3>{result.drinkName}</h3>
                        {isKnownRecipe && (
                            <span className="recipe-badge">Known Recipe</span>
                        )}
                    </div>

                    <div className="feedback-message">
                        {isCorrect ? (
                            <p>You've made exactly what the customer wanted!</p>
                        ) : (
                            <p>That's not quite what was ordered. Try again!</p>
                        )}
                    </div>

                    {!isCorrect && mission && (
                        <div className="mission-reminder">
                            <h4>Remember:</h4>
                            <p>{mission.text}</p>
                        </div>
                    )}
                </div>

                <button 
                    className="feedback-button"
                    onClick={onClose}
                >
                    {isCorrect ? 'Continue' : 'Try Again'}
                </button>
            </div>
        </div>
    );
} 