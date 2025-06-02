// App.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getScoreData } from './GameLogic.js';
import './App.css';

import { getRandomMission, evaluateDrink, INGREDIENTS } from './GameLogic.js';
import { cocktailRecipes } from './CocktailData.js';

import GameProgress from './GameProgress.jsx';
import MissionDisplay from './MissionDisplay.jsx';
import ScoreTime from './ScoreTime.jsx';
import FinanceReport from './FinanceReport.jsx';
import LorePopup from './LorePopup.jsx';

const GARNISHES = [
    { name: 'Mint Leaf', type: 'Bitter' },
    { name: 'Lemon Twist', type: 'Sour' },
    { name: 'Sugar Rim', type: 'Sweet' },
    { name: 'Chili Flake', type: 'Strong' },
];

const TASTE_FILTERS = ['Strong', 'Sweet', 'Sour', 'Bitter'];
const INITIAL_DEBT = -20000; // Starting debt
const MAX_DAYS = 30; // Days until eviction

export default function App() {
    // Show lore popup initially
    const [showLore, setShowLore] = useState(true);
    
    // Bar-game state
    const [mixGlass, setMixGlass] = useState([]);
    const [money, setMoney] = useState(INITIAL_DEBT);
    const [garnish, setGarnish] = useState(null);
    const [prepMethod, setPrepMethod] = useState(null);
    const [mission, setMission] = useState(() => getRandomMission());
    
    // Day/report state
    const [day, setDay] = useState(1);
    const [showReport, setShowReport] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    // Move the useEffect after day state is initialized
    useEffect(() => {
        setMission(getRandomMission());
    }, [day]);

    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [drinksServed, setDrinksServed] = useState(0);

    // Cocktail-book
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedCocktail, setSelectedCocktail] = useState(null);

    const progressRef = useRef();

    // Check for game over conditions
    useEffect(() => {
        if (day > MAX_DAYS) {
            setGameOver(true);
            alert(`Game Over! You've run out of time. The Merchants Guild has seized The Tipsy Dragon.`);
        } else if (money >= 0) {
            setGameOver(true);
            alert(`Congratulations! You've paid off the debt and saved The Tipsy Dragon!`);
        }
    }, [day, money]);

    // 3) Handler to receive money updates from GameProgress
    const handleMoneyChange = useCallback((amount) => {
        setMoney(prevMoney => prevMoney + amount);
    }, []);

    // Timer effect: countdown unless report is showing
    useEffect(() => {
        if (showReport || gameOver) return;
        if (timeLeft <= 0) {
            setShowReport(true);
            return;
        }
        const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(id);
    }, [timeLeft, showReport, gameOver]);

    // Reset the mixing state
    const resetMix = useCallback(() => {
        setMixGlass([]);
        setGarnish(null);
        setPrepMethod(null);
    }, []);

    // Ingredient handlers
    const handleAddIngredient = useCallback(
        (ing) => {
            if (showReport || mixGlass.length >= 4) return;
            setMixGlass((g) => [...g, ing]);
        },
        [mixGlass, showReport]
    );

    const handleSelectGarnish = useCallback(
        (name) => {
            if (showReport) return;
            // Find the complete garnish object with type
            const selectedGarnish = GARNISHES.find(g => g.name === name);
            setGarnish((g) => (g?.name === name ? null : selectedGarnish));
        },
        [showReport]
    );

    const handleSelectPrep = useCallback(
        (method) => {
            if (showReport) return;
            setPrepMethod((m) => (m === method ? null : method));
        },
        [showReport]
    );

    // Serve the drink
    const handleServe = useCallback(() => {
        // First check if it matches any known recipe
        const result = evaluateDrink(mixGlass, mission, garnish, prepMethod);
        
        // If it matches the mission, give full points
        if (result.points > 0) {
            const message = result.isKnownRecipe 
                ? `✅ Perfect ${result.drinkName}! Exactly what was ordered! +${result.points} gold.`
                : `✅ Created ${result.drinkName}! +${result.points} gold.`;
            alert(message);
            setScore((s) => s + result.points);
            setDrinksServed((n) => n + 1);
            progressRef.current?.changeMoney(result.points);
        }
        // If it's a known recipe but doesn't match mission, give base points
        else if (result.isKnownRecipe) {
            const basePoints = 15; // Base points for any known cocktail
            const message = `✅ Perfect ${result.drinkName}! Not what was ordered, but still good! +${basePoints} gold.`;
            alert(message);
            setScore((s) => s + basePoints);
            setDrinksServed((n) => n + 1);
            progressRef.current?.changeMoney(basePoints);
        } else {
            // If it's not a known recipe and doesn't match mission
            alert(`❌ ${result.drinkName} - Not what was ordered. No gold awarded.`);
        }
        resetMix();
        setMission(getRandomMission());
    }, [mixGlass, mission, garnish, prepMethod, resetMix]);

    // Finish Day early
    const handleFinishDay = useCallback(() => {
        setShowReport(true);
    }, []);

    // Next Day: hide report, reset bar, increment day
    const handleNextDay = useCallback((newBalance) => {
        setShowReport(false);
        setDay((d) => d + 1);
        setTimeLeft(120);
        resetMix();
        setMission(getRandomMission());
        setDrinksServed(0);
        setMoney(typeof newBalance === 'number' ? newBalance : 0);
    }, [resetMix]);

    // Upgrades & fridge from sidebar
    const handleUpgrade = useCallback((type) => {
        switch(type) {
            case 'extraTime':
                setTimeLeft(prev => prev + 60); // Add 60 seconds
                break;
            case 'debtReduction':
                // Debt reduction is handled in FinanceReport
                break;
            case 'costReduction':
                // Cost reduction is handled in GameLogic
                break;
            case 'groupBonus':
                // Group bonus is handled in GameProgress
                break;
            case 'meadFridge':
                // Mead fridge is already handled
                break;
        }
    }, []);

    const handleUseFridge = useCallback(() => {
        progressRef.current?.changeMoney();
        resetMix();
        setMission(getRandomMission());
    }, [resetMix]);

    // Cocktail book filtering
    const toggleFilter = useCallback((filter) => {
        setSelectedFilters((fs) =>
            fs.includes(filter) ? fs.filter((f) => f !== filter) : [...fs, filter]
        );
    }, []);

    const filteredCocktails = useMemo(() => {
        const result =
            selectedFilters.length === 0
                ? cocktailRecipes
                : cocktailRecipes.filter((c) =>
                    c.tags?.some((tag) => selectedFilters.includes(tag))
                );

        return [...result].sort((a, b) => a.name.localeCompare(b.name));
    }, [selectedFilters]);

    const clearFilters = useCallback(() => {
        setSelectedFilters([]);
        setSelectedCocktail(null);
    }, []);

    // Add state for active book tab
    const [activeTab, setActiveTab] = useState('cocktails');

    return (
        <div className="container">
            {showLore && (
                <LorePopup onClose={() => setShowLore(false)} />
            )}
            
            <h1 className="header">🍻 TavernCraft — Day {day}</h1>

            <div className="layout">
                {/* Sidebar: progress and upgrades */}

                {/* Main mixing area */}
                <main className="mix-panel panel">
                    <MissionDisplay mission={mission} />

                    {/* Ingredient buttons */}
                    <div className="button-group">
                        {INGREDIENTS.map((ing) => (
                            <button
                                key={ing.name}
                                onClick={() => handleAddIngredient(ing)}
                                disabled={showReport || mixGlass.length >= 4}
                                className="button button-mix"
                            >
                                {ing.name}
                                <span className="ingredient-tag">{ing.type}</span>
                            </button>
                        ))}
                    </div>

                    {/* Garnish buttons */}
                    <div className="button-group">
                        {GARNISHES.map((g) => (
                            <button
                                key={g.name}
                                onClick={() => handleSelectGarnish(g.name)}
                                disabled={showReport}
                                className={`button button-garnish${garnish?.name === g.name ? ' selected' : ''}`}
                            >
                                {g.name}
                                <span className="ingredient-tag">{g.type}</span>
                            </button>
                        ))}
                    </div>

                    {/* Prep method buttons */}
                    <div className="button-group">
                        {['Shaken', 'Stirred', 'Poured'].map((m) => (
                            <button
                                key={m}
                                onClick={() => handleSelectPrep(m)}
                                disabled={showReport}
                                className={`button button-method${prepMethod === m ? ' selected' : ''}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    {/* Current mix */}
                    <section className="mix-list">
                        <h2>🧪 MixGlass</h2>
                        <ul>
                            {mixGlass.map((i, idx) => (
                                <li key={idx}>
                                    {i.name} <small>({i.type})</small>
                                </li>
                            ))}
                            {garnish && (
                                <li>
                                    <em>Garnish:</em> {garnish.name} <small>({garnish.type})</small>
                                </li>
                            )}
                            {prepMethod && (
                                <li>
                                    <em>Method:</em> {prepMethod}
                                </li>
                            )}
                        </ul>
                        <p>
                            {mixGlass.length}/4 ingredients
                            {garnish ? ' | garnish' : ''}
                            {prepMethod ? ' | method' : ''}
                        </p>
                    </section>

                    {/* Serve & clear */}
                    <div className="button-group">
                        <button
                            onClick={handleServe}
                            disabled={!mixGlass.length || showReport}
                            className="button button-green"
                        >
                            Serve
                        </button>
                        <button
                            onClick={resetMix}
                            disabled={(mixGlass.length === 0 && !garnish && !prepMethod) || showReport}
                            className="button button-red"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Score & timer */}
                    <ScoreTime score={score} timeLeft={timeLeft} />

                    {/* Finish day */}
                    <button
                        onClick={handleFinishDay}
                        disabled={showReport}
                        className="button button-blue"
                        style={{ marginTop: 10 }}
                    >
                        Finish Day
                    </button>
                </main>

                {/* Tavern Book with Tabs */}
                <aside className="tavern-book">
                    <div className="book-cover"></div>
                    <div className="book-spine"></div>
                    
                    <div className="book-tabs">
                        <button 
                            className={`book-tab${activeTab === 'cocktails' ? ' active' : ''}`}
                            onClick={() => setActiveTab('cocktails')}
                        >
                            📖 Cocktails
                        </button>
                        <button 
                            className={`book-tab${activeTab === 'progress' ? ' active' : ''}`}
                            onClick={() => setActiveTab('progress')}
                        >
                            📊 Progress
                        </button>
                    </div>

                    <div className="book-content">
                        {/* Cocktail Book Page */}
                        <div className={`book-page cocktail-book${activeTab === 'cocktails' ? ' active' : ''}`}>
                            <div className="button-group">
                                {TASTE_FILTERS.map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => toggleFilter(f)}
                                        className={`button button-filter${selectedFilters.includes(f) ? ' selected' : ''}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                                <button onClick={clearFilters} className="button button-small">
                                    Clear Filters
                                </button>
                            </div>

                            {filteredCocktails.length === 0 ? (
                                <p className="empty">No cocktails match.</p>
                            ) : (
                                filteredCocktails.map((c) => {
                                    const isSelected = selectedCocktail?.name === c.name;
                                    return (
                                        <React.Fragment key={c.name}>
                                            <div
                                                onClick={() => setSelectedCocktail(c)}
                                                className={`cocktail-item${isSelected ? ' selected' : ''}`}
                                            >
                                                <strong>{c.name}</strong>
                                            </div>

                                            {isSelected && (
                                                <div className="cocktail-details">
                                                    <h3>{c.name}</h3>
                                                    <p>
                                                        <em>{c.description}</em>
                                                    </p>
                                                    <p>Ingredients: {c.ingredients.join(', ')}</p>
                                                    <p>Tags: {c.tags?.join(', ') || 'None'}</p>

                                                    {/* Garnish */}
                                                    {c.garnishes && <p><strong>Garnish:</strong> {c.garnishes}</p>}

                                                    {/* Serving */}
                                                    {c.serving && <p><strong>Serving:</strong> {c.serving}</p>}
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                            <span className="page-number page-number-right">2</span>
                        </div>

                        {/* Progress Page */}
                        <div className={`book-page progress-page${activeTab === 'progress' ? ' active' : ''}`}>
                            <GameProgress
                                ref={progressRef}
                                onUpgrade={handleUpgrade}
                                onUseFridge={handleUseFridge}
                                onMoneyChange={handleMoneyChange}
                                totalMoney={money}
                                isBookView={true}
                            />
                            <span className="page-number page-number-left">1</span>
                        </div>
                    </div>
                </aside>
            </div>

            {/* End-of-day report modal */}
            {showReport && <FinanceReport 
                day={day} 
                drinksServed={drinksServed} 
                currentMoney={money}
                upgrades={progressRef.current?.upgrades || {}}
                onNextDay={handleNextDay} 
            />}
        </div>
    );
}
