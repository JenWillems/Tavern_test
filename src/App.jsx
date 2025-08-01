// App.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getScoreData, GAME_CONFIG } from './GameLogic.js';
import './App.css';
import Bar from './components/Bar';

import { getRandomMission, evaluateDrink } from './GameLogic.js';
import { cocktailRecipes } from './cocktailData';

import Clock from './components/Clock';
import LorePopup from './components/LorePopup';
import SecretDiscoveryPopup from './components/SecretDiscoveryPopup';
import GameOverScreen from './components/GameOverScreen';
import FinanceReport from './components/FinanceReport';

const INITIAL_DEBT = -20000; // Starting debt
const MAX_DAYS = 30; // Days until eviction

export default function App() {
    // Game state
    const [money, setMoney] = useState(INITIAL_DEBT);
    const [availableGold, setAvailableGold] = useState(0);
    const [day, setDay] = useState(1);
    const [drinksServed, setDrinksServed] = useState(0);
    const [currentMission, setCurrentMission] = useState(null);
    const [showLorePopup, setShowLorePopup] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [discoveredSecrets, setDiscoveredSecrets] = useState([]);
    const [showSecretPopup, setShowSecretPopup] = useState(false);
    const [lastDiscoveredSecret, setLastDiscoveredSecret] = useState(null);
    const [mixingGlass, setMixingGlass] = useState([]);
    const [selectedGarnish, setSelectedGarnish] = useState(null);
    const [servingMethod, setServingMethod] = useState(null);
    const [showFinanceReport, setShowFinanceReport] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState("");
    const feedbackTimeoutRef = useRef(null);

    // Upgrades state
    const [upgrades, setUpgrades] = useState({
        extraTime: false,
        debtReduction: false,
        costReduction: false,
        meadFridge: false,
        drinkIncome: false
    });

    // Refs
    const clockRef = useRef();

    // Initialize game
    useEffect(() => {
        if (!currentMission) {
            setCurrentMission(getRandomMission());
        }
    }, [currentMission]);

    // Handle drink serving
    const handleServeDrink = useCallback((ingredients, garnish, serving) => {
        const ingredientsForEval = ingredients.map(ing => ({ name: ing.name }));
        const garnishForEval = garnish ? { name: garnish.name } : null;
        const result = evaluateDrink(ingredientsForEval, currentMission, garnishForEval, serving);
        // Feedback logic
        if (result.points > 0) {
            setFeedbackMessage("Great job! The drink was correct.");
            setFeedbackType("success");
        } else {
            setFeedbackMessage("Oops! That wasn't what the customer wanted.");
            setFeedbackType("error");
        }
        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = setTimeout(() => {
            setFeedbackMessage("");
            setFeedbackType("");
            setCurrentMission(getRandomMission());
        }, 2000);
        // Update money and stats
        const basePrice = 20;
        const drinkBonus = upgrades.drinkIncome ? 10 : 0;
        const earnings = basePrice + drinkBonus;
        setAvailableGold(prev => prev + earnings);
        setDrinksServed(prev => prev + 1);
        const matchedRecipe = cocktailRecipes.find(recipe => recipe.name === result.drinkName);
        if (matchedRecipe?.tags?.includes('Secret')) {
            // Always show popup for any secret cocktail
            if (!discoveredSecrets.includes(result.drinkName)) {
                setDiscoveredSecrets(prev => [...prev, result.drinkName]);
            }
            setLastDiscoveredSecret(result.drinkName);
            setShowSecretPopup(true);
        }
    }, [currentMission, upgrades.drinkIncome, discoveredSecrets]);

    // Handle day end
    const handleDayEnd = useCallback(() => {
        setShowFinanceReport(true);
    }, []);

    // Handle finance report next day
    const handleNextDay = useCallback((newDebt, newAvailableGold) => {
        setMoney(newDebt);
        setAvailableGold(newAvailableGold);
        setDrinksServed(0);
        setShowFinanceReport(false);

        if (day >= MAX_DAYS || newDebt >= 0) {
            setGameOver(true);
        } else {
            setDay(prev => prev + 1);
            setCurrentMission(getRandomMission());
            if (clockRef.current) {
                clockRef.current.resetTimer();
            }
        }
    }, [day]);

    // Handle upgrades
    const handleUpgrade = useCallback((type, amount = 0) => {
        if (type === 'payDebt') {
            setMoney(prev => prev + amount);
            setAvailableGold(prev => prev - amount);
        } else {
            setUpgrades(prev => ({ ...prev, [type]: true }));
            // Deduct upgrade cost
            const costs = {
                extraTime: 100,
                debtReduction: 150,
                costReduction: 200,
                meadFridge: 300,
                drinkIncome: 250
            };
            setAvailableGold(prev => prev - costs[type]);
        }
    }, []);

    // Handle mission skip (mead fridge)
    const handleSkipMission = useCallback(() => {
        if (upgrades.meadFridge && availableGold >= 50) {
            setAvailableGold(prev => prev - 50);
            setCurrentMission(getRandomMission());
        }
    }, [upgrades.meadFridge, availableGold]);

    // Game restart
    const handleRestart = useCallback(() => {
        setMoney(INITIAL_DEBT);
        setAvailableGold(0);
        setDay(1);
        setDrinksServed(0);
        setGameOver(false);
        setDiscoveredSecrets([]);
        setShowFinanceReport(false);
        setUpgrades({
            extraTime: false,
            debtReduction: false,
            costReduction: false,
            meadFridge: false,
            drinkIncome: false
        });
        setCurrentMission(getRandomMission());
        if (clockRef.current) {
            clockRef.current.resetTimer();
        }
    }, []);

    return (
        <div className="app">
            {showLorePopup && (
                <LorePopup onClose={() => setShowLorePopup(false)} />
            )}

            {showSecretPopup && lastDiscoveredSecret && (
                <SecretDiscoveryPopup
                    discoveredSecret={cocktailRecipes.find(recipe => recipe.name === lastDiscoveredSecret)}
                    onClose={() => setShowSecretPopup(false)}
                    resetMix={() => {
                        // Reset mixing state
                        setMixingGlass([]);
                        setSelectedGarnish(null);
                        setServingMethod(null);
                    }}
                    setMission={() => setCurrentMission(getRandomMission())}
                />
            )}

            {showFinanceReport && (
                <FinanceReport
                    day={day}
                    drinksServed={drinksServed}
                    currentMoney={money}
                    availableGold={availableGold}
                    upgrades={upgrades}
                    onNextDay={handleNextDay}
                />
            )}

            {gameOver ? (
                <GameOverScreen
                    finalMoney={money}
                    daysPlayed={day}
                    totalDrinks={drinksServed}
                    onRestart={handleRestart}
                />
            ) : (
                <>
                    <Clock
                        ref={clockRef}
                        onDayEnd={handleDayEnd}
                        extraTime={upgrades.extraTime}
                        day={day}
                        totalDays={MAX_DAYS}
                    />

                    <Bar
                        onServeDrink={handleServeDrink}
                        currentMission={currentMission}
                        onSkipMission={handleSkipMission}
                        upgrades={upgrades}
                        onUpgrade={handleUpgrade}
                        availableGold={availableGold}
                        totalMoney={money}
                        discoveredSecrets={discoveredSecrets}
                        feedbackMessage={feedbackMessage}
                        feedbackType={feedbackType}
                    />
                </>
            )}
        </div>
    );
}
