// Cocktail.jsx
import { useState, useMemo, useCallback } from 'react';
import { INGREDIENTS, GARNISHES, PREP_METHODS } from './GameLogic';
import { cocktailRecipes } from './CocktailData';

// Use the same serving methods as defined in GameLogic
const SERVING_METHODS = PREP_METHODS;

const styles = {
    container: {
        display: 'flex',
        gap: 30,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    ingredientBtn: {
        borderRadius: 5,
        backgroundColor: '#cc9900',
        color: 'black',
        cursor: 'pointer',
        padding: '5px 10px',
        border: 'none',
        fontWeight: 'bold',
    },
    garnishBtn: {
        borderRadius: 5,
        backgroundColor: '#7b4f1e',
        color: 'white',
        cursor: 'pointer',
        padding: '5px 10px',
        border: 'none',
        fontWeight: 'bold',
    },
    mixGlassList: {
        marginBottom: 10,
        textAlign: 'center',
    },
    clearBtn: {
        padding: 10,
        backgroundColor: '#dc3545',
        color: 'white',
        borderRadius: 5,
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    cocktailBook: {
        borderLeft: '2px solid #444',
        paddingLeft: 20,
        maxWidth: 300,
        height: 400,
        overflowY: 'auto',
    },
    filterContainer: {
        marginBottom: 15,
    },
    filterLabels: {
        display: 'flex',
        gap: 10,
        marginTop: 5,
        flexWrap: 'wrap',
    },
    cocktailItem: (selected) => ({
        cursor: 'pointer',
        fontWeight: 'bold',
        padding: 5,
        marginBottom: 5,
        backgroundColor: selected ? '#333' : 'transparent',
        color: selected ? '#ffcc00' : '#fff',
        borderRadius: 4,
    }),
    recipeDetails: {
        marginTop: 5,
        marginBottom: 15,
        padding: '10px 15px',
        backgroundColor: '#111',
        borderRadius: 6,
        color: '#ccc',
        fontSize: '0.9rem',
        lineHeight: 1.3,
    },
    notes: {
        fontStyle: 'italic',
        color: '#aaa',
    },
};

export default function Cocktail({ mixGlass, onAddIngredient, onClear, disabled }) {
    // Welke cocktail is geselecteerd in het boek
    const [selectedCocktail, setSelectedCocktail] = useState(null);

    // Filter state (Strong, Sweet, Sour, Bitter)
    const [filters, setFilters] = useState({
        Strong: false,
        Sweet: false,
        Sour: false,
        Bitter: false,
    });

    // Geselecteerde garnish
    const [garnish, setGarnish] = useState(null);

    // Geselecteerde serving methode
    const [servingMethod, setServingMethod] = useState(null);

    // Toggle filter en reset selectie
    const toggleFilter = useCallback((type) => {
        setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
        setSelectedCocktail(null);
    }, []);

    // Welke filters zijn actief?
    const activeFilters = useMemo(
        () => Object.entries(filters).filter(([_, v]) => v).map(([t]) => t),
        [filters]
    );

    // Filter de cocktaillijst
    const filteredCocktails = useMemo(() => {
        if (activeFilters.length === 0) return cocktailRecipes;
        return cocktailRecipes.filter(c =>
            c.tags?.some(tag => activeFilters.includes(tag))
        );
    }, [activeFilters]);

    // Bereken of we mogen serveren (minstens 1 ingrediënt + serving gekozen)
    const canServe = mixGlass.length > 0 && servingMethod !== null;

    return (
        <div style={styles.container}>
            {/* Mix Area */}
            <div>
                {/* Ingrediënten */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                    {INGREDIENTS.map(ing => (
                        <button
                            key={ing.name}
                            onClick={() => onAddIngredient(ing)}
                            disabled={disabled || mixGlass.length >= 4}
                            style={styles.ingredientBtn}
                        >
                            {ing.name}
                        </button>
                    ))}
                </div>

                {/* Garnish keuzes */}
                <div style={{ marginBottom: 10 }}>
                    <strong>Choose Garnish:</strong>
                    <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
                        {GARNISHES.map(g => (
                            <button
                                key={g.name}
                                onClick={() => setGarnish(g)}
                                disabled={disabled}
                                style={{
                                    ...styles.garnishBtn,
                                    backgroundColor: garnish?.name === g.name ? '#ffcc00' : '#7b4f1e',
                                }}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* MixGlass + Garnish */}
                <div style={styles.mixGlassList}>
                    <h2>🧪 MixGlass</h2>
                    <ul>
                        {mixGlass.map((ing, i) => (
                            <li key={i}>{ing.name} ({ing.type})</li>
                        ))}
                        {garnish && <li><em>Garnish: {garnish.name}</em></li>}
                    </ul>
                    <p>{mixGlass.length} / 4 ingredients</p>
                </div>

                {/* Serving methode */}
                <div style={{ marginTop: 15 }}>
                    <strong>Serving method:</strong>
                    <div style={{ display: 'flex', gap: 15, marginTop: 5 }}>
                        {SERVING_METHODS.map(method => (
                            <label key={method} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                <input
                                    type="radio"
                                    name="servingMethod"
                                    value={method}
                                    checked={servingMethod === method}
                                    onChange={() => setServingMethod(method)}
                                    disabled={disabled}
                                    style={{ marginRight: 5 }}
                                />
                                {method}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Clear knop */}
                <button
                    onClick={() => {
                        onClear();
                        setGarnish(null);
                        setServingMethod(null);
                    }}
                    disabled={disabled || (mixGlass.length === 0 && !garnish && !servingMethod)}
                    style={styles.clearBtn}
                >
                    Clear
                </button>

                {/* Serve knop */}
                <button
                    onClick={() => {
                        if (!canServe) {
                            alert('Please add ingredients and choose a serving method before serving!');
                            return;
                        }
                        alert(`Served ${servingMethod} with garnish ${garnish?.name || 'none'}.`);
                    }}
                    disabled={!canServe || disabled}
                    style={{
                        ...styles.clearBtn,
                        backgroundColor: canServe ? '#28a745' : '#6c757d',
                        marginTop: 10,
                    }}
                >
                    Serve Cocktail
                </button>
            </div>

            {/* Cocktail Boek */}
            <div style={styles.cocktailBook}>
                <h2 style={{ color: '#ffcc00' }}>📖 Cocktail Book</h2>

                {/* Filteren op smaak */}
                <div style={styles.filterContainer}>
                    <strong>Filter by Flavor:</strong>
                    <div style={styles.filterLabels}>
                        {['Strong', 'Sweet', 'Sour', 'Bitter'].map(type => (
                            <label key={type} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                <input
                                    type="checkbox"
                                    checked={filters[type]}
                                    onChange={() => toggleFilter(type)}
                                    style={{ marginRight: 5 }}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Gefilterde cocktails */}
                {filteredCocktails.map(cocktail => {
                    const isSelected = selectedCocktail?.name === cocktail.name;
                    return (
                        <div key={cocktail.name}>
                            <div
                                onClick={() => {
                                    setSelectedCocktail(cocktail);
                                    // Vooraf selecteer garnish & serving als het recept dat opgeeft
                                    setGarnish(cocktail.garnish ? { name: cocktail.garnish } : null);
                                    setServingMethod(cocktail.serving || null);
                                }}
                                style={styles.cocktailItem(isSelected)}
                            >
                                {cocktail.name}
                            </div>

                            {isSelected && (
                                <div style={styles.recipeDetails}>
                                    <ul style={{ margin: '5px 0' }}>
                                        {cocktail.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                    </ul>
                                    {cocktail.garnish && (
                                        <p style={styles.notes}><strong>Garnish:</strong> {cocktail.garnish}</p>
                                    )}
                                    {cocktail.serving && (
                                        <p style={styles.notes}><strong>Serving:</strong> {cocktail.serving}</p>
                                    )}
                                    {cocktail.notes && (
                                        <p style={styles.notes}><strong>Notes:</strong> {cocktail.notes}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
