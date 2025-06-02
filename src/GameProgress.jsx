import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';

import './App.css';

const defaultUpgrades = {
    groupBonus: false,
    extraTime: false,
    costReduction: false,
    debtReduction: false,
    meadFridge: false,
};

const upgradeInfo = {
    groupBonus: 'Earn an extra 10 gold for each group of customers.',
    extraTime: 'Get an extra minute (60 seconds) of serving time each day.',
    costReduction: 'Reduce your daily operating costs.',
    debtReduction: 'One-time 5% reduction in your current debt.',
    meadFridge: 'A mead fridge that you can use once every 2 rounds (after a serve).',
};

const upgradeCosts = {
    groupBonus: 500,
    extraTime: 800,
    costReduction: 1000,
    debtReduction: 600,
    meadFridge: 1200,
};

const upgradeLabels = {
    groupBonus: (cost) => `+10 Gold Per Group ($${cost})`,
    extraTime: (cost) => `+1 Minute Time ($${cost})`,
    costReduction: (cost) => `Lower Daily Costs ($${cost})`,
    debtReduction: (cost) => `-5% Debt One-Time ($${cost})`,
    meadFridge: (cost) => `Add Mead Fridge ($${cost})`,
};

const showUpgradeAlerts = (unlocked, type) => {
    window.alert(`🔓 Upgrades Unlocked:\n• ${unlocked.join('\n• ')}`);
    window.alert(`ℹ️ ${upgradeInfo[type]}`);
};

const GameProgress = forwardRef(({ onUpgrade, onUseFridge, onMoneyChange, totalMoney, isBookView }, ref) => {
    const [upgrades, setUpgrades] = useState(defaultUpgrades);
    const [fridgeUses, setFridgeUses] = useState(0);

    useImperativeHandle(ref, () => ({
        changeMoney: (amount = 0) => {
            if (amount > 0 && upgrades.groupBonus) {
                amount += 10; // Add bonus for group orders
            }
            onMoneyChange(amount);
        },
        upgrades
    }));

    const handleUpgrade = useCallback((type) => {
        const cost = upgradeCosts[type];
        if (totalMoney >= cost) {
            onMoneyChange(-cost);
            setUpgrades(prev => ({ ...prev, [type]: true }));
            showUpgradeAlerts([upgradeLabels[type](cost)], type);
            onUpgrade(type);
        }
    }, [totalMoney, onMoneyChange, onUpgrade]);

    const handleUseFridge = useCallback(() => {
        if (fridgeUses < 2) {
            setFridgeUses(prev => prev + 1);
            onUseFridge();
        }
    }, [fridgeUses, onUseFridge]);

    useEffect(() => {
        setFridgeUses(0);
    }, [totalMoney]);

    const progressContent = (
        <>
            <h2>📊 Tavern Progress</h2>
            
            <div className="money-display">
                Available Gold: ${Math.max(0, totalMoney)}
            </div>

            <h3>🏆 Upgrades</h3>
            <div className="upgrade-list">
                {Object.entries(upgradeInfo).map(([key, info]) => (
                    <button
                        key={key}
                        onClick={() => handleUpgrade(key)}
                        disabled={upgrades[key] || Math.max(0, totalMoney) < upgradeCosts[key]}
                        className={`button ${upgrades[key] ? 'purchased' : ''}`}
                    >
                        {upgrades[key] ? '✓ ' : ''}
                        {upgradeLabels[key]} (${upgradeCosts[key]})
                        <br />
                        <small>{info}</small>
                    </button>
                ))}
            </div>

            {upgrades.meadFridge && (
                <div className="fridge-section">
                    <h3>🧊 Mead Fridge</h3>
                    <button
                        onClick={handleUseFridge}
                        disabled={fridgeUses >= 2}
                        className="button button-fridge"
                    >
                        Use Fridge ({2 - fridgeUses} left)
                    </button>
                </div>
            )}
        </>
    );

    return isBookView ? (
        <div className="progress-book-view">
            {progressContent}
        </div>
    ) : (
        <div className="progress-panel">
            {progressContent}
        </div>
    );
});

export default GameProgress;
