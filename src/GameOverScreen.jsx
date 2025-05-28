// GameOverScreen.jsx - End of day financial summary display
import React from 'react';

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

    return (
        <section style={{
            background: 'white',
            padding: 20,
            borderRadius: 8,
            minWidth: 300
        }}>
            <h2>Day {day} Financial Report</h2>
            
            {/* Previous balance */}
            <p>Previous Balance: <strong>${currentMoney.toFixed(2)}</strong></p>
            
            {/* Financial details list */}
            <ul>
                {FINANCIAL_DETAILS.map(({ label, key }) => (
                    <li key={key}>
                        {label}: ${Number(values[key]).toFixed(2)}
                    </li>
                ))}
            </ul>
            
            {/* Daily results */}
            <p>
                Daily Net: <strong>${net.toFixed(2)}</strong>
            </p>
            <p>
                New Balance: <strong>${newBalance.toFixed(2)}</strong>
            </p>
            
            {/* Next day button */}
            <button 
                onClick={() => onNextDay(newBalance)} 
                style={{ marginTop: 10 }}
                className="button button-blue"
            >
                ➡️ Next Day
            </button>
        </section>
    );
}
