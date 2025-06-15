import React, { useState } from 'react';
import './Bar.css';
// Import all mug images
import mugHoney from '../assets/Mugs/mug_mostly_honey.png';
import mugBerry from '../assets/Mugs/mug_mostly_berry.png';
import mugFirewater from '../assets/Mugs/mug_mostly_firewater.png';
import mugHerbal from '../assets/Mugs/mug_mostly_herbal.png';
import { cocktailRecipes } from '../cocktailData';

// Import bottle images
import strongBottle from '../assets/Bottles/Strong_bottle.png';
import sourBottle from '../assets/Bottles/Sour_bottle.png';
import herbalBottle from '../assets/Bottles/Herbal_bottle.png';
import sweetBottle from '../assets/Bottles/Sweet_bottle.png';

// Import garnish images
import mintLeaf from '../assets/Garnishes/Mint_leaf.png';
import lemon from '../assets/Garnishes/Lemon.png';
import chiliFlakes from '../assets/Garnishes/Chili_flakes.png';
import sugar from '../assets/Garnishes/Sugar.png';

// Import plank images
import plankBottles from '../assets/plank_bottles.png';
import plankGarnishes from '../assets/plank_garnishes.png';

// Import chalk board icons
import iconStirred from '../assets/chalk_board/icon_stirred.svg';
import iconShaken from '../assets/chalk_board/icon_shaken.svg';
import iconPoured from '../assets/chalk_board/icon_poured.svg';
import serveDrink from '../assets/chalk_board/serve_drink.svg';
import trashDrink from '../assets/chalk_board/Trash_drink.svg';

const DRINKS = [
    { name: 'Firewater', type: 'Strong', class: 'button-firewater', image: strongBottle },
    { name: 'Berry', type: 'Sour', class: 'button-berry', image: sourBottle },
    { name: 'Herbal', type: 'Bitter', class: 'button-herbal', image: herbalBottle },
    { name: 'Honey', type: 'Sweet', class: 'button-honey', image: sweetBottle }
];

const GARNISHES = [
    { name: 'Mint Leaf', type: 'Bitter', image: mintLeaf },
    { name: 'Lemon Twist', type: 'Sour', image: lemon },
    { name: 'Chili Flake', type: 'Strong', image: chiliFlakes },
    { name: 'Sugar Rim', type: 'Sweet', image: sugar }
];

// Mug mapping based on ingredient type
const MUG_IMAGES = {
    'Firewater': mugFirewater,
    'Berry': mugBerry,
    'Herbal': mugHerbal,
    'Honey': mugHoney
};

const SERVING_OPTIONS = ['Stirred', 'Shaken', 'Poured'];
const TASTE_FILTERS = ['Sweet', 'Bitter', 'Strong', 'Sour'];

function Bar({ 
    onServeDrink, 
    currentMission, 
    onSkipMission, 
    upgrades, 
    onUpgrade, 
    availableGold, 
    totalMoney,
    discoveredSecrets = []
}) {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedGarnish, setSelectedGarnish] = useState(null);
    const [selectedServing, setSelectedServing] = useState(null);
    const [activeTab, setActiveTab] = useState('cocktails');
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedCocktail, setSelectedCocktail] = useState(null);
    const [currentMug, setCurrentMug] = useState(mugHoney); // Default mug
    const [dumpDrinkUses, setDumpDrinkUses] = useState(3); // Track dump drink uses
    const [expandedCocktail, setExpandedCocktail] = useState(null);

    const handleIngredientClick = (drink) => {
        if (selectedIngredients.length < 4) {
            setSelectedIngredients([...selectedIngredients, drink]);
        }
    };

    const removeIngredient = (index) => {
        setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
    };

    const handleGarnishClick = (garnish) => {
        const garnishObj = GARNISHES.find(g => g.name === garnish);
        setSelectedGarnish(selectedGarnish?.name === garnish ? null : garnishObj);
    };

    const handleServingClick = (serving) => {
        setSelectedServing(serving === selectedServing ? null : serving);
    };

    const handleServe = () => {
        // Determine the dominant ingredient
        const ingredientCounts = {};
        selectedIngredients.forEach(ing => {
            ingredientCounts[ing.name] = (ingredientCounts[ing.name] || 0) + 1;
        });
        
        // Find the ingredient with the highest count
        let dominantIngredient = Object.entries(ingredientCounts)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        // Update the mug image based on the dominant ingredient
        setCurrentMug(MUG_IMAGES[dominantIngredient] || mugHoney);
        
        // Call the original onServeDrink
        onServeDrink(selectedIngredients, selectedGarnish, selectedServing);
        
        // Reset selections
        setSelectedIngredients([]);
        setSelectedGarnish(null);
        setSelectedServing(null);
    };

    const toggleFilter = (filter) => {
        setSelectedFilters(prev => 
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    const handleDumpDrink = () => {
        setSelectedIngredients([]);
        setSelectedGarnish(null);
        setSelectedServing(null);
        setDumpDrinkUses(prev => prev - 1);
    };

    const clearFilters = () => {
        setSelectedFilters([]);
    };

    const filteredCocktails = cocktailRecipes
        .filter(cocktail => {
            if (cocktail.tags?.includes('Secret') && !discoveredSecrets.includes(cocktail.name)) {
                return false;
            }
            if (selectedFilters.length === 0) return true;
            return cocktail.tags?.some(tag => selectedFilters.includes(tag));
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    const canServe = selectedIngredients.length > 0 && selectedServing !== null;

    const toggleCocktailExpansion = (cocktailName) => {
        setExpandedCocktail(expandedCocktail === cocktailName ? null : cocktailName);
    };

    return (
        <div className="bar-container">
            {/* Character Section - Green */}
            <div className="character-section">
                <div className="speech-bubble">
                    <p>{typeof currentMission === 'string' ? currentMission : currentMission?.text || 'Loading...'}</p>
                </div>
                <div className="character">
                    <img src={currentMug} alt="Mug Character" className="mug-image" />
                </div>
                {upgrades.meadFridge && (
                    <button 
                        className="skip-button"
                        onClick={onSkipMission}
                        disabled={availableGold < 50}
                    >
                        Skip Order (50g)
                    </button>
                )}
            </div>

            {/* Book Section - Blue */}
            <div className="book-section">
                <div className="book-tabs">
                    <button 
                        className={`book-tab ${activeTab === 'cocktails' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cocktails')}
                    >
                        <img src="src/assets/Tags/cocktail-tage.png" alt="Cocktail Book" />
                    </button>
                    <button 
                        className={`book-tab ${activeTab === 'upgrades' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upgrades')}
                    >
                        <img src="src/assets/Tags/progress-tag.png" alt="Progress" />
                    </button>
                </div>

                <div className="book-content">
                    {activeTab === 'cocktails' ? (
                        <>
                            <div className="taste-filters">
                                <button
                                    className={`filter-button ${selectedFilters.includes('Sweet') ? 'active' : ''}`}
                                    onClick={() => toggleFilter('Sweet')}
                                >
                                    <img src="src/assets/Tags/Sweet-tag.png" alt="Sweet" />
                                </button>
                                <button
                                    className={`filter-button ${selectedFilters.includes('Herbal') ? 'active' : ''}`}
                                    onClick={() => toggleFilter('Herbal')}
                                >
                                    <img src="src/assets/Tags/herbal-tag.png" alt="Herbal" />
                                </button>
                                    <button
                                    className={`filter-button ${selectedFilters.includes('Strong') ? 'active' : ''}`}
                                    onClick={() => toggleFilter('Strong')}
                                    >
                                    <img src="src/assets/Tags/Strong-tag.png" alt="Strong" />
                                    </button>
                                    <button
                                    className={`filter-button ${selectedFilters.includes('Sour') ? 'active' : ''}`}
                                    onClick={() => toggleFilter('Sour')}
                                    >
                                    <img src="src/assets/Tags/Sour-tag.png" alt="Sour" />
                                    </button>
                            </div>
                            <div className="cocktail-list">
                                {filteredCocktails.map((cocktail) => (
                                    <div 
                                        key={cocktail.name} 
                                        className={`cocktail-entry ${expandedCocktail === cocktail.name ? 'expanded' : ''}`}
                                        onClick={() => toggleCocktailExpansion(cocktail.name)}
                                    >
                                        <h3>{cocktail.name}</h3>
                                        {expandedCocktail === cocktail.name && (
                                        <div className="cocktail-details">
                                                <p>{cocktail.description}</p>
                                                <p>Ingredients: {cocktail.ingredients.join(', ')}</p>
                                                <p>Garnish: {cocktail.garnish}</p>
                                                <p>Serving: {cocktail.serving}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="upgrade-list">
                            <div className="finance-display">
                                <div className="gold-display">
                                    <span className="gold-icon">💰</span>
                                    <span className="gold-amount">{availableGold}g</span>
                                </div>
                                <div className="debt-display">
                                    <span className="debt-icon">📊</span>
                                    <span className="debt-amount">{totalMoney < 0 ? `-${Math.abs(totalMoney)}` : totalMoney}g</span>
                                </div>
                            </div>
                            <div className="upgrade-item">
                                <h3>Extra Time</h3>
                                <p>More time to serve drinks each day</p>
                                <button 
                                    onClick={() => onUpgrade('extraTime')}
                                    disabled={upgrades.extraTime || availableGold < 100}
                                >
                                    Buy (100g)
                                </button>
                            </div>
                            <div className="upgrade-item">
                                <h3>Debt Reduction</h3>
                                <p>Reduce daily debt payments</p>
                                <button 
                                    onClick={() => onUpgrade('debtReduction')}
                                    disabled={upgrades.debtReduction || availableGold < 150}
                                >
                                    Buy (150g)
                                </button>
                            </div>
                            <div className="upgrade-item">
                                <h3>Cost Reduction</h3>
                                <p>Reduce ingredient costs</p>
                                <button 
                                    onClick={() => onUpgrade('costReduction')}
                                    disabled={upgrades.costReduction || availableGold < 200}
                                >
                                    Buy (200g)
                                </button>
                            </div>
                            <div className="upgrade-item">
                                <h3>Mead Fridge</h3>
                                <p>Ability to skip orders for 50g</p>
                                <button 
                                    onClick={() => onUpgrade('meadFridge')}
                                    disabled={upgrades.meadFridge || availableGold < 300}
                                >
                                    Buy (300g)
                                </button>
                            </div>
                            <div className="upgrade-item">
                                <h3>Better Tips</h3>
                                <p>Earn more gold per drink</p>
                                <button 
                                    onClick={() => onUpgrade('drinkIncome')}
                                    disabled={upgrades.drinkIncome || availableGold < 250}
                                >
                                    Buy (250g)
                                </button>
                            </div>
                            <div className="upgrade-item">
                                <h3>Pay Off Debt</h3>
                                <p>Use available gold to pay off debt</p>
                                <button 
                                    onClick={() => onUpgrade('payDebt', availableGold)}
                                    disabled={availableGold <= 0 || totalMoney >= 0}
                                >
                                    Pay ({availableGold}g)
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Ingredients Section */}
            <div className="ingredients-section">
                <div className="bottles-shelf">
                    <img src={plankBottles} alt="Bottles Shelf" className="shelf-image shelf-top" />
                    {DRINKS.map((drink) => (
                        <button
                            key={drink.name}
                            className={`button-mix ${drink.class} ${selectedIngredients.includes(drink) ? 'selected' : ''}`}
                            onClick={() => handleIngredientClick(drink)}
                            disabled={selectedIngredients.length >= 4}
                            title={`${drink.name} (${drink.type})`}
                        >
                            <img 
                                src={drink.image} 
                                alt={drink.name} 
                                className="ingredient-image"
                            />
                        </button>
                    ))}
                </div>
                <div className="garnishes-shelf">
                    <img src={plankGarnishes} alt="Middle Shelf" className="shelf-image shelf-middle" />
                    <img src={plankGarnishes} alt="Bottom Shelf" className="shelf-image shelf-bottom" />
                    <button
                        className={`garnish-button ${selectedGarnish?.name === 'Mint Leaf' ? 'selected' : ''}`}
                        onClick={() => handleGarnishClick('Mint Leaf')}
                        disabled={selectedIngredients.length >= 4}
                    >
                        <img src={mintLeaf} alt="Mint Leaf" className="mint-leaf" />
                    </button>
                    <button
                        className={`garnish-button ${selectedGarnish?.name === 'Lemon Twist' ? 'selected' : ''}`}
                        onClick={() => handleGarnishClick('Lemon Twist')}
                        disabled={selectedIngredients.length >= 4}
                    >
                        <img src={lemon} alt="Lemon Twist" className="lemon-twist" />
                    </button>
                    <button
                        className={`garnish-button ${selectedGarnish?.name === 'Chili Flake' ? 'selected' : ''}`}
                        onClick={() => handleGarnishClick('Chili Flake')}
                        disabled={selectedIngredients.length >= 4}
                    >
                        <img src={chiliFlakes} alt="Chili Flake" className="chili-flakes" />
                    </button>
                        <button
                        className={`garnish-button ${selectedGarnish?.name === 'Sugar Rim' ? 'selected' : ''}`}
                        onClick={() => handleGarnishClick('Sugar Rim')}
                        disabled={selectedIngredients.length >= 4}
                        >
                        <img src={sugar} alt="Sugar Rim" className="sugar-rim" />
                        </button>
                </div>
            </div>

            {/* Mixing Area */}
            <div className="mixing-area">
                {/* Ingredients Section */}
                <div className="selected-ingredients">
                    <h2 className="ingredients-title">Ingredients:</h2>
                    <div className="ingredients-grid">
                        {selectedIngredients.map((ingredient, index) => (
                            <div key={index} className="ingredient-item">
                                {ingredient.name}
                            </div>
                        ))}
                    </div>
                    {selectedGarnish && (
                        <div className="garnish-item">
                            {selectedGarnish.name}
                        </div>
                    )}
                </div>

                {/* Bottom Controls */}
                <div className="bottom-controls">
                    {/* Serving Options */}
                    <div className="serving-options">
                        <button
                            className={`serving-option ${selectedServing === 'Stirred' ? 'selected' : ''}`}
                            onClick={() => handleServingClick('Stirred')}
                        >
                            Stirred
                            <img 
                                src={iconStirred}
                                alt="Stirred" 
                                className="serving-icon" 
                            />
                        </button>
                        <button
                            className={`serving-option ${selectedServing === 'Shaken' ? 'selected' : ''}`}
                            onClick={() => handleServingClick('Shaken')}
                        >
                            Shaken
                            <img 
                                src={iconShaken}
                                alt="Shaken" 
                                className="serving-icon" 
                            />
                        </button>
                        <button
                            className={`serving-option ${selectedServing === 'Poured' ? 'selected' : ''}`}
                            onClick={() => handleServingClick('Poured')}
                        >
                            Poured
                            <img 
                                src={iconPoured}
                                alt="Poured" 
                                className="serving-icon" 
                            />
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button
                            className="serve-button"
                            onClick={handleServe}
                            disabled={!canServe}
                        >
                            <img 
                                src={serveDrink}
                                alt="Serve your drink" 
                                className="action-icon" 
                            />
                        </button>
                        <button
                            className="dump-button"
                            onClick={handleDumpDrink}
                            disabled={selectedIngredients.length === 0 || dumpDrinkUses <= 0}
                        >
                            <img 
                                src={trashDrink}
                                alt="Trash it" 
                                className="action-icon" 
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Bar; 