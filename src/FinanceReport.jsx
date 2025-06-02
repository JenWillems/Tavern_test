// FinanceReport.jsx - Daily financial summary modal
import React from 'react';
import GameOverScreen from './GameOverScreen.jsx';
import { getScoreData } from './GameLogic.js';

/**
 * Daily financial report modal component
 * Shows earnings, expenses, and balance changes at the end of each day
 * 
 * @param {Object} props Component properties
 * @param {number} props.day Current day number
 * @param {number} props.drinksServed Number of drinks served today
 * @param {number} props.currentMoney Current money before calculations
 * @param {Object} props.upgrades Current upgrades state
 * @param {Function} props.onNextDay Callback for proceeding to next day
 */
export default function FinanceReport({ day, drinksServed, currentMoney, upgrades = {}, onNextDay }) {
    // Calculate all financial data for the day
    const {
        moneyEarned,
        boozeCost,
        rentCost,
        foodCost,
        totalCost,
        net,
        newBalance
    } = getScoreData(drinksServed, currentMoney, upgrades);

    // Calculate available money (ignoring debt)
    const availableMoney = Math.max(0, newBalance);
    // Calculate remaining debt (if any)
    const remainingDebt = Math.min(0, newBalance);

    return (
        <div className="finance-report-overlay">
            <section className="finance-report">
                <h2>Day {day} Financial Report</h2>
                
                {/* Previous balance */}
                <div className="finance-row">
                    <span>Previous Available:</span>
                    <strong className="positive">${Math.max(0, currentMoney).toFixed(2)}</strong>
                </div>
                
                {/* Financial details */}
                <div className="finance-details">
                    <div className="finance-row">
                        <span>Money Earned:</span>
                        <strong className="positive">${moneyEarned.toFixed(2)}</strong>
                    </div>
                    <div className="finance-row">
                        <span>Rent Expense:</span>
                        <strong className="negative">-${rentCost.toFixed(2)}</strong>
                    </div>
                    <div className="finance-row">
                        <span>Booze Expense:</span>
                        <strong className="negative">-${boozeCost.toFixed(2)}</strong>
                    </div>
                    <div className="finance-row">
                        <span>Food Expense:</span>
                        <strong className="negative">-${foodCost.toFixed(2)}</strong>
                    </div>
                    <div className="finance-row">
                        <span>Total Expenses:</span>
                        <strong className="negative">-${totalCost.toFixed(2)}</strong>
                    </div>
                </div>
                
                {/* Daily results */}
                <div className="finance-row total">
                    <span>Daily Net:</span>
                    <strong className={net >= 0 ? 'positive' : 'negative'}>
                        ${net.toFixed(2)}
                    </strong>
                </div>

                {/* New available money */}
                <div className="finance-row total">
                    <span>New Available:</span>
                    <strong className="positive">${availableMoney.toFixed(2)}</strong>
                </div>

                {/* Debt section */}
                <div className="debt-section">
                    <h3>Debt Status</h3>
                    <div className="finance-row">
                        <span>Remaining Debt:</span>
                        <strong className="negative">${Math.abs(remainingDebt).toFixed(2)}</strong>
                    </div>
                    {upgrades.debtReduction && remainingDebt < 0 && (
                        <p className="debt-note">5% debt reduction applied!</p>
                    )}
                </div>
                
                <button 
                    onClick={() => onNextDay(newBalance)} 
                    className="button button-gold"
                >
                    Begin Next Day ➡️
                </button>
            </section>
        </div>
    );
}
