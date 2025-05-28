import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';

import './App.css';

const defaultUpgrades = {
    moreIngredients: false,
    higherEarnings: false,
    meadFridge: false,
};

const upgradeInfo = {
    moreIngredients: 'Unlocks 4 brand-new ingredients in your bar.',
    higherEarnings: 'Earn an extra $10 on every successful serve.',
    meadFridge: 'A mead fridge that you can use once every 2 rounds (after a serve).',
};

const upgradeCosts = {
    moreIngredients: 400,
    higherEarnings: 700,
    meadFridge: 1200,
};

const upgradeLabels = {
    moreIngredients: (cost) => `Unlock 4 Ingredients ($${cost})`,
    higherEarnings: (cost) => `+$10 per Drink ($${cost})`,
    meadFridge: (cost) => `Add Mead Fridge ($${cost})`,
};

const showUpgradeAlerts = (unlocked, type) => {
    window.alert(`🔓 Upgrades Unlocked:\n• ${unlocked.join('\n• ')}`);
    window.alert(`ℹ️ ${upgradeInfo[type]}`);
};

const GameProgress = forwardRef(({ onUpgrade, onUseFridge, onMoneyChange, totalMoney }, ref) => {
    const [round, setRound] = useState(1);
    const [upgrades, setUpgrades] = useState(defaultUpgrades);
    const [meadCooldown, setMeadCooldown] = useState(0);

    useImperativeHandle(
        ref,
        () => ({
            // Now you can pass a positive or negative number to add or subtract money
            changeMoney(amount = 20) {
                const bonus = upgrades.higherEarnings ? 10 : 0;
                onMoneyChange?.(amount + (amount > 0 ? bonus : 0)); // Notify parent to update money
                setRound(r => r + 1);
                if (meadCooldown > 0) setMeadCooldown(c => c - 1);
            }
        }),
        [upgrades.higherEarnings, meadCooldown, onMoneyChange]
    );

    const purchaseUpgrade = useCallback(
        (type) => {
            if (totalMoney < upgradeCosts[type] || upgrades[type]) return;

            onMoneyChange?.(-upgradeCosts[type]); // Subtract upgrade cost
            setUpgrades((prev) => {
                const updated = { ...prev, [type]: true };
                const unlocked = Object.entries(updated)
                    .filter(([, unlocked]) => unlocked)
                    .map(([key]) => key);

                setTimeout(() => showUpgradeAlerts(unlocked, type), 0);
                return updated;
            });

            onUpgrade?.(type);
        },
        [totalMoney, upgrades, onUpgrade, onMoneyChange]
    );

    const handleUseMeadFridge = useCallback(() => {
        if (!upgrades.meadFridge || meadCooldown > 0) return;
        setMeadCooldown(2);
        window.alert('🍯 You used the mead fridge! Free serve unlocked.');
        onUseFridge?.();
    }, [upgrades.meadFridge, meadCooldown, onUseFridge]);

    return (
        <div className="panel sidebar">
            <h2>Progress</h2>
            <p>💰 Money: ${totalMoney.toFixed(2)}</p>
            <p>🔁 Round: {round}</p>

            {upgrades.meadFridge && (
                <>
                    <p>
                        🍯 Mead Fridge:{' '}
                        {meadCooldown > 0 ? `Cooldown (${meadCooldown} rounds left)` : 'Ready!'}
                    </p>
                    {meadCooldown === 0 && (
                        <button onClick={handleUseMeadFridge} className="button button-yellow">
                            Use Mead Fridge
                        </button>
                    )}
                </>
            )}

            <h3>Upgrades:</h3>
            {Object.keys(defaultUpgrades).map((type, idx) => (
                <React.Fragment key={type}>
                    {idx > 0 && <br />}
                    <button
                        onClick={() => purchaseUpgrade(type)}
                        disabled={upgrades[type] || totalMoney < upgradeCosts[type]}
                        className="button"
                    >
                        {upgradeLabels[type](upgradeCosts[type])}
                    </button>
                </React.Fragment>
            ))}
        </div>
    );
});

export default GameProgress;
