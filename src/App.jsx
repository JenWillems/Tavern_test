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

// MLG sound effects
const MLG_SOUNDS = {
    AIRHORN: 'https://www.myinstants.com/media/sounds/mlg-airhorn.mp3',
    WOMBO_COMBO: 'https://www.myinstants.com/media/sounds/wombo-combo.mp3',
    OH_BABY: 'https://www.myinstants.com/media/sounds/oh-baby-a-triple.mp3',
    WOW: 'https://www.myinstants.com/media/sounds/wow-mlg.mp3',
    SMOKE_WEED: 'https://www.myinstants.com/media/sounds/snoop-dogg-smoke-weed-everyday.mp3',
    MOM_CAMERA: 'https://www.myinstants.com/media/sounds/mom-get-the-camera.mp3',
    INTERVENTION: 'https://www.myinstants.com/media/sounds/intervention-420.mp3',
    HITMARKER: 'https://www.myinstants.com/media/sounds/hitmarker_2.mp3',
    BACKGROUND: 'https://www.youtube.com/watch?v=t7AajPCSEMc'
};

// MLG background music
const MLG_BACKGROUND = 'https://www.youtube.com/watch?v=t7AajPCSEMc';

export default function App() {
    // Show lore popup initially
    const [showLore, setShowLore] = useState(true);
    const [showSecretDiscovery, setShowSecretDiscovery] = useState(false);
    const [discoveredSecret, setDiscoveredSecret] = useState(null);
    
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
        
        // Check if it's a secret recipe
        const isSecret = result.isKnownRecipe && 
            cocktailRecipes.find(c => c.name === result.drinkName)?.tags?.includes('Secret');
        
        if (isSecret) {
            const secretRecipe = cocktailRecipes.find(c => c.name === result.drinkName);
            setDiscoveredSecret(secretRecipe);
            setShowSecretDiscovery(true);
            // Add extra points for discovering a secret recipe
            const secretBonus = 50;
            setScore((s) => s + result.points + secretBonus);
            progressRef.current?.changeMoney(result.points + secretBonus);
            return;
        }
        
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
        // First filter out secret cocktails
        const nonSecretCocktails = cocktailRecipes.filter(c => !c.tags?.includes('Secret'));
        
        // Then apply taste filters
        const result =
            selectedFilters.length === 0
                ? nonSecretCocktails
                : nonSecretCocktails.filter((c) =>
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

            {showSecretDiscovery && discoveredSecret && (
                <div className="secret-discovery">
                    {discoveredSecret.name === 'Tralalero Tralala' ? (
                        <div className="brainrot-content sea-theme">
                            {/* Sound effects */}
                            <audio id="vineBoom" autoPlay>
                                <source src="https://www.myinstants.com/media/sounds/vine-boom.mp3" type="audio/mp3" />
                            </audio>

                            {/* Video container with relative positioning */}
                            <div className="video-container">
                                <iframe
                                    width="800"
                                    height="315"
                                    src="https://www.youtube.com/embed/ssOLDdXDUjQ?autoplay=1"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            {/* Explosion GIFs */}
                            <div className="explosion-container">
                                <img className="explosion explosion-1" src="https://media.tenor.com/images/16787d100a9f4a8349687f6e00c594bb/tenor.gif" alt="explosion" />
                                <img className="explosion explosion-2" src="https://media.tenor.com/images/16787d100a9f4a8349687f6e00c594bb/tenor.gif" alt="explosion" />
                                <img className="explosion explosion-3" src="https://media.tenor.com/images/16787d100a9f4a8349687f6e00c594bb/tenor.gif" alt="explosion" />
                            </div>

                            {/* Surreal sea meme elements */}
                            <div className="random-images">
                                <div className="floating-image shark">🦈</div>
                                <div className="floating-image fish">🐠</div>
                                <div className="floating-image dolphin">🐬</div>
                                <div className="floating-image wave">🌊</div>
                                <div className="floating-image shell">🐚</div>
                                <div className="floating-image octopus">🐙</div>
                                <div className="floating-image sneaker sneaker-left">👟</div>
                                <div className="floating-image sneaker sneaker-right">👟</div>
                                <div className="floating-image bubble bubble-1">○</div>
                                <div className="floating-image bubble bubble-2">○</div>
                                <div className="floating-image bubble bubble-3">○</div>
                            </div>

                            <div className="content-wrapper">
                                <h2 className="brainrot-title">tralalero tralala</h2>
                                <div className="recipe-container">
                                    <p className="recipe-name">{discoveredSecret.name}</p>
                                    <div className="recipe-notes">
                                        {discoveredSecret.notes}
                                    </div>
                                </div>

                                <div className="brainrot-bonus">
                                    <span className="bonus-text">Porco Dio e porco Allah
Ero con il mio fottuto figlio merdardo a giocare a Fortnite
Quando a un punto arriva mia nonna
Ornella Leccacappella</span>
                                    <span className="bonus-subtext">....god this generation is doomed</span>
                                </div>

                                <button className="brainrot-button" onClick={() => {
                                    setShowSecretDiscovery(false);
                                    resetMix();
                                    setMission(getRandomMission());
                                }}>
                                    return to land
                                </button>
                            </div>

                            {/* Wavy overlay */}
                            <div className="wave-overlay"></div>
                        </div>
                    ) : (
                        <div className="secret-discovery-content">
                            <div className="mlg-overlay"></div>
                            <div className="doritos doritos-1">🔺</div>
                            <div className="doritos doritos-2">🔺</div>
                            <div className="doritos doritos-3">🔺</div>
                            <div className="doritos doritos-4">🔺</div>
                            <div className="glasses">🕶️</div>
                            <div className="airhorn airhorn-left">📢</div>
                            <div className="airhorn airhorn-right">📢</div>
                            <div className="mlg-emoji mlg-emoji-1">👾</div>
                            <div className="mlg-emoji mlg-emoji-2">🎮</div>
                            <div className="mlg-emoji mlg-emoji-3">🎯</div>
                            <div className="mlg-emoji mlg-emoji-4">💯</div>
                            <div className="hitmarker hitmarker-1">✖️</div>
                            <div className="hitmarker hitmarker-2">✖️</div>
                            <div className="mountain-dew mountain-dew-1">🥤</div>
                            <div className="mountain-dew mountain-dew-2">🥤</div>
                            
                            {/* YouTube player for MLG music */}
                            <div className="mlg-music">
                                <iframe
                                    width="0"
                                    height="0"
                                    src="https://www.youtube.com/embed/t7AajPCSEMc?autoplay=1"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            
                            <h2>OH BABY A TRIPLE! 🎯</h2>
                            <p className="subtitle">MOM GET THE CAMERA!!1!</p>
                            <div className="wow-text">W🎯W</div>
                            <p className="recipe-name">{discoveredSecret.name}</p>
                            <div className="notes">
                                {discoveredSecret.notes}
                                <div className="hitmarker-container">
                                    <span className="hitmarker-inner">✖️</span>
                                </div>
                            </div>
                            <p className="bonus">
                                +50 GOLD GET REKT M8!
                                <br/>
                                <small>*WOMBO COMBO*</small>
                            </p>
                            <div className="mlg-score">
                                <span className="score-text">+420</span>
                                <span className="score-text">NO SCOPE</span>
                            </div>
                            <button onClick={() => {
                                setShowSecretDiscovery(false);
                                resetMix();
                                setMission(getRandomMission());
                            }}>
                                360 NO SCOPE
                            </button>
                        </div>
                    )}
                </div>
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
