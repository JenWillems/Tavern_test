// GameOverScreen.jsx - End of day financial summary display
import React from 'react';
import './App.css';

const MAX_DAYS = 30; // Days until eviction

/**
 * Financial details to display in the report
 * Each entry defines a label and corresponding data key
 */
const FINANCIAL_DETAILS = [
    { label: 'Money Earned', key: 'moneyEarned' },
    { label: 'Rent Expense', key: 'rent' },
    { label: 'Booze Expense', key: 'booze' },
    { label: 'Food Expense', key: 'food' },
    { label: 'Total Expenses', key: 'totalCost' },
];

/**
 * End of day financial summary screen
 * Shows detailed breakdown of earnings, expenses, and balance changes
 * 
 * @param {Object} props Component properties
 * @param {number} props.day Current day number
 * @param {number} props.moneyEarned Money earned from drinks today
 * @param {number} props.rent Rent expense (negative)
 * @param {number} props.booze Booze expense (negative)
 * @param {number} props.food Food expense (negative)
 * @param {number} props.totalCost Total expenses (negative)
 * @param {number} props.net Net profit/loss for the day
 * @param {number} props.currentMoney Money before today's calculations
 * @param {number} props.newBalance Final balance after all calculations
 * @param {Function} props.onNextDay Callback for proceeding to next day
 */
export default function GameOverScreen({
    day,
    moneyEarned,
    rent,
    booze,
    food,
    totalCost,
    net,
    currentMoney,
    newBalance,
    onNextDay,
}) {
    // Collect all financial values for display
    const values = { moneyEarned, rent, booze, food, totalCost };
    const daysLeft = MAX_DAYS - day;
    const debtLeft = Math.min(0, newBalance);

    return (
        <div className="finance-report-overlay">
            <section className="finance-report">
                <h2>Day {day} Financial Report</h2>
                
                {/* Previous balance */}
                <div className="finance-row">
                    <span>Previous Balance:</span>
                    <strong className={currentMoney >= 0 ? 'positive' : 'negative'}>
                        ${currentMoney.toFixed(2)}
                    </strong>
                </div>
                
                {/* Financial details list */}
                <div className="finance-details">
                    {FINANCIAL_DETAILS.map(({ label, key }) => (
                        <div key={key} className="finance-row">
                            <span>{label}:</span>
                            <strong className={values[key] >= 0 ? 'positive' : 'negative'}>
                                ${Number(values[key]).toFixed(2)}
                            </strong>
                        </div>
                    ))}
                </div>
                
                {/* Daily results */}
                <div className="finance-row total">
                    <span>Daily Net:</span>
                    <strong className={net >= 0 ? 'positive' : 'negative'}>
                        ${net.toFixed(2)}
                    </strong>
                </div>
                <div className="finance-row total">
                    <span>New Balance:</span>
                    <strong className={newBalance >= 0 ? 'positive' : 'negative'}>
                        ${newBalance.toFixed(2)}
                    </strong>
                </div>

                {/* Progress towards goal */}
                <div className="progress-summary">
                    <h3>Progress Update</h3>
                    <div className="finance-row">
                        <span>Days Remaining:</span>
                        <strong>{daysLeft}</strong>
                    </div>
                    {debtLeft < 0 && (
                        <div className="finance-row">
                            <span>Remaining Debt:</span>
                            <strong className="negative">${Math.abs(debtLeft).toFixed(2)}</strong>
                        </div>
                    )}
                </div>
                
                {/* Next day button */}
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
