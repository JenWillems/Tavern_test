import React, { forwardRef, useImperativeHandle, useState } from 'react';

/**
 * GameProgress Component
 * Displays game progress, upgrades, and handles money management
 * Shows available gold for upgrades
 * 
 * @param {Object} props
 * @param {Function} props.onUpgrade - Function to handle upgrades
 * @param {Function} props.onUseFridge - Function to handle fridge usage
 * @param {Function} props.onMoneyChange - Function to handle money changes
 * @param {number} props.totalMoney - Current total money (debt)
 * @param {number} props.availableGold - Current available gold for upgrades
 * @param {boolean} props.isBookView - Whether component is shown in book view
 */
const GameProgress = forwardRef(({ onUpgrade, onUseFridge, onMoneyChange, totalMoney, availableGold, isBookView }, ref) => {
    const [upgrades, setUpgrades] = useState({
        extraTime: false,
        debtReduction: false,
        costReduction: false,
        meadFridge: false,
        drinkIncome: false
    });

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
        upgrades,
        changeMoney: (amount = 0) => {
            onMoneyChange(amount);
        }
    }));

    const handleUpgrade = (type) => {
        setUpgrades(prev => ({ ...prev, [type]: true }));
        onUpgrade(type);
    };

    const handlePayDebt = () => {
        if (totalMoney >= 0 || availableGold <= 0) return;
        
        const amountToPay = Math.min(availableGold, Math.abs(totalMoney));
        onMoneyChange(-amountToPay); // Spend the gold
        onUpgrade('payDebt', amountToPay); // Tell parent to reduce debt
    };

    const ProgressContent = () => (
        <>
            <div className="money-display">
                💰 Available Gold: {availableGold}
                {totalMoney < 0 && (
                    <div className="debt-display">
                        💀 Debt: {Math.abs(totalMoney)}
                    </div>
                )}
            </div>

            {/* Pay Debt Button */}
            {totalMoney < 0 && availableGold > 0 && (
                <div className="pay-debt-section">
                    <button
                        onClick={handlePayDebt}
                        className="button button-gold"
                    >
                        Pay Debt ({Math.min(availableGold, Math.abs(totalMoney))}g)
                    </button>
                    <small>Use your available gold to pay off debt</small>
                </div>
            )}

            <h3>Available Upgrades</h3>
            <div className="upgrade-list">
                <button
                    onClick={() => handleUpgrade('extraTime')}
                    disabled={upgrades.extraTime || availableGold < 1000}
                    className={`button ${upgrades.extraTime ? 'purchased' : ''}`}
                >
                    Extra Time (1000g)
                    <small>+60 seconds per day</small>
                </button>

                <button
                    onClick={() => handleUpgrade('debtReduction')}
                    disabled={upgrades.debtReduction || availableGold < 2000}
                    className={`button ${upgrades.debtReduction ? 'purchased' : ''}`}
                >
                    Debt Reduction (2000g)
                    <small>Improve Guild reputation</small>
                </button>

                <button
                    onClick={() => handleUpgrade('costReduction')}
                    disabled={upgrades.costReduction || availableGold < 1500}
                    className={`button ${upgrades.costReduction ? 'purchased' : ''}`}
                >
                    Cost Reduction (1500g)
                    <small>Reduce upgrade costs by 25%</small>
                </button>

                <button
                    onClick={() => handleUpgrade('meadFridge')}
                    disabled={upgrades.meadFridge || availableGold < 3000}
                    className={`button ${upgrades.meadFridge ? 'purchased' : ''}`}
                >
                    Mead Fridge (3000g)
                    <small>Skip unwanted orders</small>
                </button>

                <button
                    onClick={() => handleUpgrade('drinkIncome')}
                    disabled={upgrades.drinkIncome || availableGold < 1000}
                    className={`button ${upgrades.drinkIncome ? 'purchased' : ''}`}
                >
                    Better Tips (1000g)
                    <small>+10 gold per drink</small>
                </button>
            </div>

            {upgrades.meadFridge && (
                <div className="fridge-section">
                    <h3>Mead Fridge</h3>
                    <p>Don't like the current order? Skip it!</p>
                    <button
                        onClick={onUseFridge}
                        className="button button-fridge"
                        disabled={availableGold < 50}
                    >
                        Use Fridge (50g)
                    </button>
                </div>
            )}
        </>
    );

    return isBookView ? (
        <div className="progress-book-view">
            <h2>Progress & Upgrades</h2>
            <ProgressContent />
        </div>
    ) : (
        <div className="panel">
            <ProgressContent />
        </div>
    );
});

GameProgress.displayName = 'GameProgress';

export default GameProgress; 