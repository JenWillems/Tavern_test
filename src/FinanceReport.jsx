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
 * @param {Function} props.onNextDay Callback for proceeding to next day
 */
export default function FinanceReport({ day, drinksServed, currentMoney, onNextDay }) {
    // Calculate all financial data for the day
    const {
        moneyEarned,
        rentCost,
        boozeCost,
        foodCost,
        totalCost,
        net,
        newBalance
    } = getScoreData(drinksServed, currentMoney);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
        >
            <GameOverScreen
                day={day}
                moneyEarned={moneyEarned}
                rent={-rentCost}
                booze={-boozeCost}
                food={-foodCost}
                totalCost={-totalCost}
                net={net}
                currentMoney={currentMoney}
                newBalance={newBalance}
                onNextDay={onNextDay}
            />
        </div>
    );
}
