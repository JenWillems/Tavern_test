import React from 'react';

/**
 * FinanceReport Component
 * Displays end-of-day financial report and summary
 * Shows both current balance and debt status
 * 
 * @param {Object} props
 * @param {number} props.day - Current day
 * @param {number} props.drinksServed - Number of drinks served
 * @param {number} props.currentMoney - Current debt (negative)
 * @param {number} props.availableGold - Current available gold
 * @param {Object} props.upgrades - Purchased upgrades
 * @param {Function} props.onNextDay - Function to handle next day
 */
export default function FinanceReport({ day, drinksServed, currentMoney, availableGold, upgrades, onNextDay }) {
    // Calculate daily costs and income
    const foodCost = -8;  // Daily food cost (matches GameLogic)
    const rentCost = -60; // Daily rent cost (matches GameLogic)
    const boozeCost = -Math.max(12, Math.floor(drinksServed * 5)); // Dynamic booze cost based on drinks (matches GameLogic)
    
    // Apply cost reduction if upgrade is purchased
    let totalDailyCosts = foodCost + boozeCost + rentCost;
    if (upgrades.costReduction) {
        totalDailyCosts = Math.floor(totalDailyCosts * 0.85); // 15% reduction
    }
    
    const basePrice = 20;
    const drinkBonus = upgrades.drinkIncome ? 10 : 0; // +10 gold per drink with upgrade
    const drinksIncome = drinksServed * (basePrice + drinkBonus);
    const totalChange = drinksIncome + totalDailyCosts;
    
    // Calculate new debt and available gold
    let newDebt = currentMoney;
    let newAvailableGold = availableGold;
    
    if (totalChange > 0) {
        // If we made profit, keep it as available gold
        newAvailableGold += totalChange;
    } else {
        // If we lost money, first use available gold
        if (newAvailableGold >= Math.abs(totalChange)) {
            newAvailableGold += totalChange; // Subtract the loss from available gold
        } else {
            // If we don't have enough available gold, the rest goes to debt
            const remainingLoss = totalChange + newAvailableGold; // This will be negative
            newDebt += remainingLoss;
            newAvailableGold = 0;
        }
    }

    // Apply debt reduction if the upgrade is purchased
    if (upgrades.debtReduction && newDebt < 0) {
        newDebt = Math.min(0, Math.floor(newDebt * 0.95)); // 5% debt reduction
    }

    return (
        <div className="finance-report-overlay">
            <div className="finance-report">
                <h2>Day {day} Report</h2>

                <div className="finance-section">
                    <h3>Current Status</h3>
                    <div className="finance-row">
                        <span>Available Gold:</span>
                        <strong className="positive">{availableGold}g</strong>
                    </div>
                    {currentMoney < 0 && (
                        <div className="finance-row">
                            <span>Current Debt:</span>
                            <strong className="negative">{Math.abs(currentMoney)}g</strong>
                        </div>
                    )}
                </div>

                <div className="finance-section">
                    <h3>Daily Income</h3>
                    <div className="finance-row">
                        <span>Drinks Served:</span>
                        <strong>{drinksServed}</strong>
                    </div>
                    <div className="finance-row">
                        <span>Drinks Income:</span>
                        <strong className="positive">+{drinksIncome}g</strong>
                    </div>
                </div>

                <div className="finance-section">
                    <h3>Daily Expenses</h3>
                    <div className="finance-row">
                        <span>Food:</span>
                        <strong className="negative">{foodCost}g</strong>
                    </div>
                    <div className="finance-row">
                        <span>Booze:</span>
                        <strong className="negative">{boozeCost}g</strong>
                    </div>
                    <div className="finance-row">
                        <span>Rent:</span>
                        <strong className="negative">{rentCost}g</strong>
                    </div>
                    <div className="finance-row total">
                        <span>Total Expenses:</span>
                        <strong className="negative">{totalDailyCosts}g</strong>
                        {upgrades.costReduction && (
                            <small className="cost-reduction">(15% reduction applied)</small>
                        )}
                    </div>
                </div>

                <div className="finance-section">
                    <h3>End of Day Summary</h3>
                    <div className="finance-row">
                        <span>Daily Net:</span>
                        <strong className={totalChange >= 0 ? 'positive' : 'negative'}>
                            {totalChange >= 0 ? '+' : ''}{totalChange}g
                        </strong>
                    </div>
                    <div className="finance-row">
                        <span>New Available Gold:</span>
                        <strong className="positive">{newAvailableGold}g</strong>
                    </div>
                    {newDebt < 0 && (
                        <div className="finance-row">
                            <span>New Debt:</span>
                            <strong className="negative">{Math.abs(newDebt)}g</strong>
                        </div>
                    )}
                </div>

                {newDebt < 0 && (
                    <div className="debt-section">
                        <h3>Merchant's Guild Debt</h3>
                        <p>Outstanding debt: {Math.abs(newDebt)}g</p>
                        {upgrades.debtReduction && (
                            <p className="debt-note">Your reputation with the Guild is improving!</p>
                        )}
                    </div>
                )}

                <button 
                    className="button button-gold"
                    onClick={() => onNextDay(newDebt)}
                >
                    Next Day
                </button>
            </div>
        </div>
    );
} 