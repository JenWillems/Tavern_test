// FinanceReport.jsx
import React from 'react';
import GameOverScreen from './GameOverScreen.jsx';
import { getScoreData } from './GameLogic.js';

export default function FinanceReport({ day, drinksServed, currentMoney, onNextDay }) {
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
                rent={rentCost}
                booze={boozeCost}
                food={foodCost}
                totalCost={totalCost}
                net={net}
                newBalance={newBalance}  // Pass it here if you want to display it
                onNextDay={() => onNextDay(newBalance)} // Pass the new balance on next day
            />
        </div>
    );
}
