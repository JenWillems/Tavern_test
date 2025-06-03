import React from 'react';

/**
 * FinanceReport Component
 * Displays end-of-day financial report and summary
 * 
 * @param {Object} props
 * @param {number} props.day - Current day
 * @param {number} props.drinksServed - Number of drinks served
 * @param {number} props.currentMoney - Current money balance
 * @param {Object} props.upgrades - Purchased upgrades
 * @param {Function} props.onNextDay - Function to handle next day
 */
export default function FinanceReport({ day, drinksServed, currentMoney, upgrades, onNextDay }) {
    // Calculate daily costs and income
    const foodCost = -30;  // Daily food cost
    const boozeCost = -60; // Daily booze cost
    const rentCost = -120; // Daily rent cost
    const totalDailyCosts = foodCost + boozeCost + rentCost;
    
    const drinksIncome = drinksServed * 100; // Base 100 gold per drink
    const totalChange = drinksIncome + totalDailyCosts;
    const newBalance = currentMoney + totalChange;

    return (
        <div className="finance-report-overlay">
            <div className="finance-report">
                <h2>Day {day} Report</h2>

                <div className="finance-details">
                    <div className="finance-row">
                        <span>Drinks Served:</span>
                        <strong>{drinksServed}</strong>
                    </div>
                    <div className="finance-row">
                        <span>Drinks Income:</span>
                        <strong className="positive">+{drinksIncome}g</strong>
                    </div>
                    <div className="finance-row">
                        <span>Daily Food Cost:</span>
                        <strong className="negative">{foodCost}g</strong>
                    </div>
                    <div className="finance-row">
                        <span>Daily Booze Cost:</span>
                        <strong className="negative">{boozeCost}g</strong>
                    </div>
                    <div className="finance-row">
                        <span>Daily Rent:</span>
                        <strong className="negative">{rentCost}g</strong>
                    </div>
                    <div className="finance-row total">
                        <span>Total Change:</span>
                        <strong className={totalChange >= 0 ? 'positive' : 'negative'}>
                            {totalChange >= 0 ? '+' : ''}{totalChange}g
                        </strong>
                    </div>
                </div>

                <div className="progress-summary">
                    <h3>Progress Summary</h3>
                    <div className="finance-row">
                        <span>Previous Balance:</span>
                        <strong>{currentMoney}g</strong>
                    </div>
                    <div className="finance-row">
                        <span>New Balance:</span>
                        <strong className={newBalance >= 0 ? 'positive' : 'negative'}>
                            {newBalance}g
                        </strong>
                    </div>
                </div>

                {currentMoney < 0 && (
                    <div className="debt-section">
                        <h3>Merchant's Guild Debt</h3>
                        <p>Outstanding debt: {Math.abs(currentMoney)} gold</p>
                        {upgrades.debtReduction && (
                            <p className="debt-note">Your reputation with the Guild is improving!</p>
                        )}
                    </div>
                )}

                <button 
                    className="button button-gold"
                    onClick={() => onNextDay(newBalance)}
                >
                    Next Day
                </button>
            </div>
        </div>
    );
} 