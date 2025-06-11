import React, { useState } from 'react';
import './Bar.css';
import mugImage from '../assets/mug_mostly_honey.png';
import { cocktailRecipes } from '../cocktailData';

// Import bottle images
import strongBottle from '../assets/Strong_bottle.png';
import sourBottle from '../assets/Sour_bottle.png';
import herbalBottle from '../assets/Herbal_bottle.png';
import sweetBottle from '../assets/Sweet_bottle.png';

// Import garnish images
import mintLeaf from '../assets/Mint_leaf.png';
import lemon from '../assets/Lemon.png';
import chiliFlakes from '../assets/Chili_flakes.png';
import sugar from '../assets/Sugar.png';

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

    const handleIngredientClick = (drink) => {
        if (selectedIngredients.length < 4) {
            setSelectedIngredients([...selectedIngredients, drink]);
        }
    };

    const removeIngredient = (index) => {
        setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
    };

    const handleGarnishClick = (garnish) => {
        setSelectedGarnish(garnish === selectedGarnish ? null : garnish);
    };

    const handleServingClick = (serving) => {
        setSelectedServing(serving === selectedServing ? null : serving);
    };

    const handleServe = () => {
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

    const filteredCocktails = cocktailRecipes.filter(cocktail => {
        if (cocktail.tags?.includes('Secret') && !discoveredSecrets.includes(cocktail.name)) {
            return false;
        }
        if (selectedFilters.length === 0) return true;
        return cocktail.tags?.some(tag => selectedFilters.includes(tag));
    });

    const canServe = selectedIngredients.length > 0 && selectedServing !== null;

    return (
        <div className="bar-container">
            {/* Character Section - Green */}
            <div className="character-section">
                <div className="speech-bubble">
                    <p>{typeof currentMission === 'string' ? currentMission : currentMission?.text || 'Loading...'}</p>
                </div>
                <div className="character">
                    <img src={mugImage} alt="Mug Character" />
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
                        Cocktail Book
                    </button>
                    <button 
                        className={`book-tab ${activeTab === 'upgrades' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upgrades')}
                    >
                        Progress
                    </button>
                </div>

                <div className="book-content">
                    {activeTab === 'cocktails' ? (
                        <>
                            <div className="taste-filters">
                                {TASTE_FILTERS.map(filter => (
                                    <button
                                        key={filter}
                                        className={`filter-button ${selectedFilters.includes(filter) ? 'active' : ''}`}
                                        onClick={() => toggleFilter(filter)}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                            <div className="cocktail-list">
                                {filteredCocktails.map(cocktail => (
                                    <div 
                                        key={cocktail.name} 
                                        className={`cocktail-entry ${selectedCocktail === cocktail.name ? 'expanded' : ''}`}
                                        onClick={() => setSelectedCocktail(selectedCocktail === cocktail.name ? null : cocktail.name)}
                                    >
                                        <h3>{cocktail.name}</h3>
                                        <div className="cocktail-details">
                                            <p>{cocktail.notes}</p>
                                            <p><strong>Ingredients:</strong> {cocktail.ingredients.join(', ')}</p>
                                            {cocktail.garnishes && (
                                                <p><strong>Garnish:</strong> {cocktail.garnishes.join(', ')}</p>
                                            )}
                                            {cocktail.serving && (
                                                <p><strong>Serving:</strong> {cocktail.serving}</p>
                                            )}
                                            <div className="cocktail-tags">
                                                {cocktail.tags?.map(tag => (
                                                    <span key={tag} className="cocktail-tag">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
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

                {/* Mixing Area - Yellow */}
                <div className="mixing-area">
                    <div className="selected-ingredients">
                        {selectedIngredients.map((ingredient, index) => (
                            <div key={index} className="selected-ingredient">
                                <span>{ingredient.name}</span>
                                <button onClick={() => removeIngredient(index)}>×</button>
                            </div>
                        ))}
                    </div>

                    <div className="serving-options">
                        {SERVING_OPTIONS.map(option => (
                            <button
                                key={option}
                                className={`serving-option ${selectedServing === option ? 'selected' : ''}`}
                                onClick={() => handleServingClick(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <button 
                        className="serve-button"
                        onClick={handleServe}
                        disabled={!canServe}
                    >
                        Serve Drink
                    </button>
                </div>
            </div>

            {/* Ingredients Section - Red */}
            <div className="ingredients-section">
                <div className="bottles-shelf">
                    {DRINKS.map((drink) => (
                        <button
                            key={drink.name}
                            className={`button-mix ${drink.class}`}
                            onClick={() => handleIngredientClick(drink)}
                            disabled={selectedIngredients.length >= 4}
                        >
                            {drink.name}
                            <span className="ingredient-tag">{drink.type}</span>
                        </button>
                    ))}
                </div>
                <div className="garnishes-shelf">
                    {GARNISHES.map((garnish) => (
                        <button
                            key={garnish.name}
                            className={`button-mix ${
                                selectedGarnish === garnish ? 'selected' : ''
                            }`}
                            onClick={() => handleGarnishClick(garnish)}
                        >
                            {garnish.name}
                            <span className="ingredient-tag">{garnish.type}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Bar; 