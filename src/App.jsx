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

const GARNISHES = [
    { name: 'Mint Leaf', type: 'Bitter' },
    { name: 'Lemon Twist', type: 'Sour' },
    { name: 'Sugar Rim', type: 'Sweet' },
    { name: 'Chili Flake', type: 'Strong' },
];

const TASTE_FILTERS = ['Strong', 'Sweet', 'Sour', 'Bitter'];

export default function App() {
    // Bar-game state
    const [mixGlass, setMixGlass] = useState([]);
    const [money, setMoney] = useState(0);
    const [garnish, setGarnish] = useState(null);
    const [prepMethod, setPrepMethod] = useState(null);
    const [mission, setMission] = useState(() => getRandomMission());
    
    // Day/report state
    const [day, setDay] = useState(1);
    const [showReport, setShowReport] = useState(false);

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

    // 3) Handler to receive money updates from GameProgress
    const handleMoneyChange = useCallback((amount) => {
        setMoney(prevMoney => prevMoney + amount);
    }, []);

    // Timer effect: countdown unless report is showing
    useEffect(() => {
        if (showReport) return;
        if (timeLeft <= 0) {
            setShowReport(true);
            return;
        }
        const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(id);
    }, [timeLeft, showReport]);

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
            setGarnish((g) => (g === name ? null : name));
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
        const pts = evaluateDrink(mixGlass, mission, garnish, prepMethod);
        if (pts > 0) {
            alert(`✅ Served! +${pts} gold.`);
            setScore((s) => s + pts);
            setDrinksServed((n) => n + 1);
            progressRef.current?.changeMoney(pts);
        } else {
            alert(`❌ Drink didn't meet requirements. No gold awarded.`);
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
    const handleUpgrade = useCallback((type) => console.log('Upgrade:', type), []);

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

    return (
        <div className="container">
            <h1 className="header">🍻 TavernCraft — Day {day}</h1>

            <div className="layout">
                {/* Sidebar: progress and upgrades */}
                <aside className="sidebar panel">
                    <GameProgress
                        ref={progressRef}
                        onUpgrade={handleUpgrade}
                        onUseFridge={handleUseFridge}
                        onMoneyChange={handleMoneyChange}
                        totalMoney={money}
                    />
                </aside>

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
                                className={`button button-garnish${garnish === g.name ? ' selected' : ''}`}
                            >
                                {g.name}
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
                                    <em>Garnish:</em> {garnish}
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

                <aside className="cocktail-book panel">
                    <h2>📖 Cocktail Book</h2>
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
                </aside>
            </div>

            {/* End-of-day report modal */}
            {showReport && <FinanceReport 
                day={day} 
                drinksServed={drinksServed} 
                currentMoney={money}
                onNextDay={handleNextDay} 
            />}
        </div>
    );
}
