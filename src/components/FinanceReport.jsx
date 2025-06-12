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
    // Calculate daily costs
    const foodCost = -8;  // Daily food cost (matches GameLogic)
    const rentCost = -60; // Daily rent cost (matches GameLogic)
    const boozeCost = -Math.max(12, Math.floor(drinksServed * 5)); // Dynamic booze cost based on drinks (matches GameLogic)
    
    // Apply cost reduction if upgrade is purchased
    let totalDailyCosts = foodCost + boozeCost + rentCost;
    if (upgrades.costReduction) {
        totalDailyCosts = Math.floor(totalDailyCosts * 0.85); // 15% reduction
    }
    
    // Calculate new debt and available gold
    let newDebt = currentMoney;
    let newAvailableGold = availableGold;
    
    // Apply daily costs to available gold first
    if (newAvailableGold >= Math.abs(totalDailyCosts)) {
        // If we have enough gold, just subtract the costs
        newAvailableGold += totalDailyCosts;
    } else {
        // If we don't have enough gold, the remainder goes to debt
        const remainingCosts = totalDailyCosts + newAvailableGold; // This will be negative
        newDebt += remainingCosts;
        newAvailableGold = 0;
    }

    // Apply debt reduction if the upgrade is purchased
    if (upgrades.debtReduction && newDebt < 0) {
        newDebt = Math.min(0, Math.floor(newDebt * 0.95)); // 5% debt reduction
    }

    // Calculate display values for income (already added to availableGold during the day)
    const basePrice = 20;
    const drinkBonus = upgrades.drinkIncome ? 10 : 0;
    const drinksIncome = drinksServed * (basePrice + drinkBonus);

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
                        <span>Rent:</span>
                        <strong className="negative">{rentCost}g</strong>
                    </div>
                    <div className="finance-row">
                        <span>Booze:</span>
                        <strong className="negative">{boozeCost}g</strong>
                    </div>
                    {upgrades.costReduction && (
                        <div className="finance-row cost-reduction">
                            <span>Cost Reduction:</span>
                            <strong className="positive">15% off</strong>
                        </div>
                    )}
                    <div className="finance-row total-costs">
                        <span>Total Costs:</span>
                        <strong className="negative">{totalDailyCosts}g</strong>
                    </div>
                </div>

                <div className="finance-section">
                    <h3>End of Day Summary</h3>
                    <div className="finance-row">
                        <span>Daily Costs:</span>
                        <strong className="negative">{totalDailyCosts}g</strong>
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
                    onClick={() => onNextDay(newDebt, newAvailableGold)}
                >
                    Next Day
                </button>
            </div>
        </div>
    );
} 