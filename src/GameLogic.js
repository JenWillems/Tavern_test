// GameLogic.js - Core game mechanics and mission generation
import { cocktailRecipes } from './cocktailData';

// ============= Game Constants =============

/**
 * Game configuration constants
 */
export const GAME_CONFIG = {
    DIFFICULTY_MULTIPLIERS: {
        EASY: 1,
        MEDIUM: 1.5,
        HARD: 2
    },
    TYPES: ['Sweet', 'Sour', 'Strong', 'Bitter'],
    PREP_METHODS: ['Shaken', 'Stirred', 'Poured']
};

/**
 * Base ingredients available in the game
 */
export const INGREDIENTS = [
    { name: 'Firewater', type: 'Strong' },
    { name: 'Berry',     type: 'Sour'   },
    { name: 'Herbal',    type: 'Bitter' },
    { name: 'Honey',     type: 'Sweet'  },
];

/**
 * Available garnishes for drink decoration
 */
export const GARNISHES = [
    { name: 'Chili Flake', type: 'Strong' },
    { name: 'Lemon Twist', type: 'Sour' },
    { name: 'Mint Leaf', type: 'Bitter' },
    { name: 'Sugar Rim', type: 'Sweet' },
];

// ============= Helper Functions =============

/**
 * Pick a random element from an array
 * @param {Array} arr - Source array
 * @returns {*} Random element or null if array is empty
 */
const randomItem = arr =>
    Array.isArray(arr) && arr.length
        ? arr[Math.floor(Math.random() * arr.length)]
        : null;

/**
 * Get a random subset of flavor types
 * @param {number} count - Number of types to return
 * @returns {string[]} Array of randomly selected types
 */
const getRandomTypes = count =>
    GAME_CONFIG.TYPES
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

/**
 * Get a random ingredient from available ingredients
 * @returns {Object} Random ingredient object
 */
const getRandomIngredient = () => randomItem(INGREDIENTS);

/**
 * Find a similar cocktail by comparing ingredients
 * @param {Object} cocktail Base cocktail to compare
 * @returns {Object} Similar cocktail with one ingredient different
 */
const findSimilarCocktail = (cocktail) => {
    return cocktailRecipes.find(other => {
        if (other.name === cocktail.name) return false;
        
        // Check if ingredients are similar (only one different)
        const baseIngredients = [...cocktail.ingredients].sort();
        const otherIngredients = [...other.ingredients].sort();
        
        // Must be same length or one off
        if (Math.abs(baseIngredients.length - otherIngredients.length) > 1) return false;
        
        // Count differences
        const differences = baseIngredients.filter(ing => !otherIngredients.includes(ing)).length +
                          otherIngredients.filter(ing => !baseIngredients.includes(ing)).length;
        
        return differences <= 2; // Allow up to 2 ingredient differences
    });
};

// ============= Drink Evaluation =============

/**
 * Generate a name for a drink based on its ingredients and preparation
 * @param {Array} ingredients List of ingredients used
 * @param {string|null} prepMethod How the drink was prepared
 * @param {string|null} garnish Garnish used, if any
 * @returns {Object} Drink name and whether it matches a known recipe
 */
const generateDrinkName = (ingredients, prepMethod = null, garnish = null) => {
    // First check if it matches any known cocktail recipe exactly
    const matchingCocktail = cocktailRecipes.find(recipe => {
        const recipeIngs = [...recipe.ingredients].sort();
        const drinkIngs = ingredients.map(i => i.name).sort();
        
        const ingredientsMatch = recipeIngs.length === drinkIngs.length &&
            recipeIngs.every((v, i) => v === drinkIngs[i]);
            
        // Fixed garnish matching - check if garnish name is in recipe's garnishes array
        const garnishMatch = !recipe.garnishes ||
            !garnish ||
            recipe.garnishes.includes(garnish.name);
            
        const prepMatch = !recipe.serving ||
            prepMethod === recipe.serving;
            
        return ingredientsMatch && garnishMatch && prepMatch;
    });

    if (matchingCocktail) {
        return {
            name: matchingCocktail.name,
            isKnownRecipe: true
        };
    }

    // If no match, generate a descriptive name
    const types = [...new Set(ingredients.map(i => i.type))];
    const mainFlavor = types.length === 1 ? types[0] : 
        types.length === 2 ? `${types[0]}-${types[1]}` : 'Mixed';
    
    // Get ingredient names without duplicates
    const uniqueIngredients = [...new Set(ingredients.map(i => i.name))];
    
    // Create base name from ingredients
    let name = uniqueIngredients.join('-');
    
    // Add preparation method if specified
    if (prepMethod) {
        name = `${prepMethod} ${name}`;
    }
    
    // Add garnish if specified and include its type
    if (garnish?.name) {
        name += ` with ${garnish.name} (${garnish.type})`;
    }

    return {
        name,
        isKnownRecipe: false
    };
};

/**
 * Evaluate a drink against the current mission requirements
 * Returns points earned and drink information
 * 
 * @param {Array} mixGlass - Array of ingredients in the current drink
 * @param {Object} mission - Current mission requirements
 * @param {string|null} garnish - Applied garnish, if any
 * @param {string|null} prepMethod - Preparation method used
 * @returns {Object} Evaluation results including points and drink name
 */
export function evaluateDrink(mixGlass, mission, garnish = null, prepMethod = null) {
    // Generate drink name first - this will also check if it's a known recipe
    const { name: drinkName, isKnownRecipe } = generateDrinkName(mixGlass, prepMethod, garnish);

    // If there's no mission (shouldn't happen), but it's a known recipe, return the name
    if (!mission) {
        return { points: 0, drinkName, isKnownRecipe };
    }

    // Helper function to check cocktail requirements
    const checkCocktailMatch = (cocktail) => {
        // Check ingredients with exact counts
        const ingCounts = {};
        mixGlass.forEach(ing => {
            ingCounts[ing.name] = (ingCounts[ing.name] || 0) + 1;
        });

        const recipeCounts = {};
        cocktail.ingredients.forEach(ing => {
            recipeCounts[ing] = (recipeCounts[ing] || 0) + 1;
        });

        // Check if ingredient counts match exactly
        const ingredientsMatch = Object.keys({ ...ingCounts, ...recipeCounts }).every(ing => 
            ingCounts[ing] === recipeCounts[ing]
        );

        // Fixed garnish matching - check if garnish name is in recipe's garnishes array
        const garnishMatch = !cocktail.garnishes || 
            !garnish ||
            cocktail.garnishes.includes(garnish.name);

        // Check preparation method if specified
        const servingMatch = !cocktail.serving ||
            cocktail.serving === prepMethod;

        return ingredientsMatch && garnishMatch && servingMatch;
    };

    // Calculate points based on mission type
    let points = 0;
    switch (mission.missionType) {
        case 'cocktail': {
            const match = checkCocktailMatch(mission.targetCocktail);
            points = match ? Math.floor(30 * (mission.difficulty || 1)) : 0;
            break;
        }

        case 'similarCocktail': {
            const matchesTarget = checkCocktailMatch(mission.targetCocktail);
            const matchesSimilar = checkCocktailMatch(mission.similarCocktail);
            points = (matchesTarget || matchesSimilar) ? 
                Math.floor(35 * GAME_CONFIG.DIFFICULTY_MULTIPLIERS.MEDIUM) : 0;
            break;
        }

        case 'cocktailVariation': {
            // Base ingredients must match except for the specified substitution
            const ingNames = mixGlass.map(i => i.name).sort();
            const targetIngs = [...mission.targetCocktail.ingredients]
                .map(ing => ing === mission.originalIngredient ? mission.substitution : ing)
                .sort();
            
            const ingredientsMatch = ingNames.length === targetIngs.length &&
                targetIngs.every((v, i) => v === ingNames[i]);

            // Check garnish and prep method as usual
            const garnishMatch = !mission.targetCocktail.garnishes || 
                (Array.isArray(mission.targetCocktail.garnishes) && 
                mission.targetCocktail.garnishes.includes(garnish?.name));

            const servingMatch = !mission.targetCocktail.serving ||
                mission.targetCocktail.serving === prepMethod;

            points = (ingredientsMatch && garnishMatch && servingMatch) ? 
                Math.floor(40 * GAME_CONFIG.DIFFICULTY_MULTIPLIERS.HARD) : 0;
            break;
        }

        case 'flavor': {
            // Count ingredients and garnish of the target type
            const flavorCount = mixGlass.filter(i => i.type === mission.targetType).length +
                (garnish && garnish.type === mission.targetType ? 1 : 0);
            points = flavorCount >= mission.requiredCount ? 20 : 0;
            break;
        }

        case 'ingredient': {
            points = mixGlass.some(i => i.name === mission.targetIngredient.name) ? 20 : 0;
            break;
        }

        case 'preparation': {
            points = prepMethod === mission.targetPrep ? 25 : 0;
            break;
        }

        case 'garnishOnly': {
            points = garnish?.name === mission.targetGarnish ? 15 : 0;
            break;
        }

        case 'noType': {
            // Check both ingredients and garnish for forbidden types
            const hasNoForbiddenType = !mixGlass.some(i => mission.forbiddenTypes.includes(i.type)) &&
                (!garnish || !mission.forbiddenTypes.includes(garnish.type));
            points = hasNoForbiddenType ? 25 : 0;
            break;
        }

        case 'exactCount': {
            // Include garnish in the total count if present
            const totalCount = mixGlass.length + (garnish ? 1 : 0);
            points = totalCount === mission.targetCount ? 20 : 0;
            break;
        }

        case 'mixedTypes': {
            // Count both ingredients and garnish for the primary type
            const primaryCount = mixGlass.filter(i => i.type === mission.targetTypes[0]).length +
                (garnish && garnish.type === mission.targetTypes[0] ? 1 : 0);
            points = primaryCount >= 2 ? mission.targetTypes.length * 10 : 0;
            break;
        }
    }

    return {
        points,
        drinkName,
        isKnownRecipe
    };
}

// ============= Mission Generation =============

// Cache for last mission to prevent repetition
let lastMissionText = null;

// Mission text templates
const missionPhrases = {
    cocktail: [
        name => `Serve me the legendary "${name}" cocktail.`,
        name => `I've heard great things about the "${name}". Make me one!`,
        name => `One "${name}" please, exactly as written.`,
        name => `I'm craving a classic "${name}". Mix it up for me!`,
        name => `Show me your best "${name}" cocktail.`,
    ],
    similarCocktail: [
        (target, similar) => `Make me either a "${target}" or a "${similar}".`,
        (target, similar) => `I like "${target}" and "${similar}". Surprise me with either!`,
        (target, similar) => `Give me your take on a "${target}" or "${similar}".`,
    ],
    cocktailVariation: [
        (name, orig, sub) => `Make me a "${name}" but use ${sub} instead of ${orig}.`,
        (name, orig, sub) => `I want a "${name}" variation - replace the ${orig} with ${sub}.`,
        (name, orig, sub) => `Mix a "${name}" for me, but substitute ${sub} for the ${orig}.`,
    ],
    flavor: [
        (type, count) => `Give me a ${type.toLowerCase()} drink with at least ${count} ${type.toLowerCase()} ingredients.`,
        (type, count) => `I need something really ${type.toLowerCase()}. Use ${count}+ ${type.toLowerCase()} ingredients.`,
        (type, count) => `Make it ${type.toLowerCase()}, very ${type.toLowerCase()}! (${count}+ ingredients)`,
    ],
    prep: [
        method => `I want my drink ${method.toLowerCase()}, not stirred.`,
        method => `Make sure to ${method.toLowerCase()} this one.`,
        method => `${method} is the only way to prepare my drink.`,
    ],
    garnish: [
        garnish => `I need something with a ${garnish} garnish for that ${GARNISHES.find(g => g.name === garnish)?.type.toLowerCase()} kick!`,
        garnish => `Add a ${garnish} on top - I love that ${GARNISHES.find(g => g.name === garnish)?.type.toLowerCase()} touch.`,
        garnish => `Make it fancy with a ${garnish} garnish. I'm in the mood for something ${GARNISHES.find(g => g.name === garnish)?.type.toLowerCase()}.`,
    ],
    noType: [
        types => `I can't handle ${types.join(' or ')} drinks today.`,
        types => `Please avoid anything ${types.join(' or ')}.`,
        types => `Make me something without ${types.join(' or ')}.`,
    ],
    exactCount: [
        count => `Make me something with exactly ${count} ingredient${count !== 1 ? 's' : ''}.`,
        count => `I want precisely ${count} ingredient${count !== 1 ? 's' : ''} in my drink.`,
        count => `Use exactly ${count} ingredient${count !== 1 ? 's' : ''}, no more, no less.`,
    ],
};

/**
 * Generate a new random mission for the player
 * Ensures no consecutive missions are the same
 * @returns {Object} Mission object with requirements and text
 */
export function getRandomMission() {
    const missionTypes = [
        'cocktail', 'cocktail', 'similarCocktail', 'cocktailVariation', // More weight to cocktail missions
        'flavor', 'ingredient', 'mixedTypes',
        'preparation', 'garnishOnly', 'noType', 'exactCount'
    ];
    
    let mission = null;
    let attempts = 0;
    const maxAttempts = 10;

    // Filter out secret cocktails from available recipes for missions
    const availableRecipes = cocktailRecipes.filter(recipe => !recipe.tags?.includes('Secret'));

    do {
        const chosenType = missionTypes[Math.floor(Math.random() * missionTypes.length)];
        const phrase = (type) => {
            const phrases = missionPhrases[type] || [];
            return phrases[Math.floor(Math.random() * phrases.length)];
        };

        attempts++;
        
        switch (chosenType) {
            case 'cocktail': {
                const cocktail = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
                if (!cocktail) continue;
                
                const missionText = phrase('cocktail')(cocktail.name);
                if (missionText === lastMissionText) continue;
                
                mission = {
                    missionType: 'cocktail',
                    text: missionText,
                    targetCocktail: cocktail,
                    difficulty: GAME_CONFIG.DIFFICULTY_MULTIPLIERS.EASY,
                    tags: ['cocktail', ...(cocktail.tags || []).map(t => t.toLowerCase())],
                };
                break;
            }

            case 'similarCocktail': {
                const baseCocktail = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
                if (!baseCocktail) continue;
                
                const similarCocktail = findSimilarCocktail(baseCocktail);
                if (!similarCocktail || similarCocktail.tags?.includes('Secret')) continue;

                const missionText = phrase('similarCocktail')(baseCocktail.name, similarCocktail.name);
                if (missionText === lastMissionText) continue;
                
                mission = {
                    missionType: 'similarCocktail',
                    text: missionText,
                    targetCocktail: baseCocktail,
                    similarCocktail: similarCocktail,
                    tags: ['cocktail', 'variation'],
                };
                break;
            }

            case 'cocktailVariation': {
                const cocktail = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
                if (!cocktail) continue;

                // Pick a random ingredient to substitute
                const originalIngredient = randomItem(cocktail.ingredients);
                if (!originalIngredient) continue;

                // Find a different ingredient of the same type
                const substitution = randomItem(
                    INGREDIENTS
                        .filter(i => i.name !== originalIngredient)
                        .map(i => i.name)
                );
                if (!substitution) continue;

                const missionText = phrase('cocktailVariation')(cocktail.name, originalIngredient, substitution);
                if (missionText === lastMissionText) continue;
                
                mission = {
                    missionType: 'cocktailVariation',
                    text: missionText,
                    targetCocktail: cocktail,
                    originalIngredient,
                    substitution,
                    tags: ['cocktail', 'variation'],
                };
                break;
            }

            case 'flavor': {
                const [flavor] = getRandomTypes(1);
                const requiredCount = 1 + Math.floor(Math.random() * 3);
                
                const missionText = phrase('flavor')(flavor, requiredCount);
                if (missionText === lastMissionText) continue;
                
                mission = {
                    missionType: 'flavor',
                    text: missionText,
                    targetType: flavor,
                    requiredCount,
                    tags: ['flavor', flavor.toLowerCase()],
                };
                break;
            }

            case 'preparation': {
                const targetPrep = randomItem(GAME_CONFIG.PREP_METHODS);
                const missionText = phrase('prep')(targetPrep);
                if (missionText === lastMissionText) continue;
                
                mission = {
                    missionType: 'preparation',
                    text: missionText,
                    targetPrep,
                    tags: ['preparation'],
                };
                break;
            }

            case 'garnishOnly': {
                const targetGarnish = randomItem(GARNISHES);
                const missionText = phrase('garnish')(targetGarnish.name);
                if (missionText === lastMissionText) continue;
                
                mission = {
                    missionType: 'garnishOnly',
                    text: missionText,
                    targetGarnish: targetGarnish.name,
                    tags: ['garnish', targetGarnish.type.toLowerCase()],
                };
                break;
            }

            case 'noType': {
                const forbiddenTypes = getRandomTypes(1 + Math.floor(Math.random() * 2));
                const missionText = phrase('noType')(forbiddenTypes);
                if (missionText === lastMissionText) continue;
                
                mission = {
                    missionType: 'noType',
                    text: missionText,
                    forbiddenTypes,
                    tags: ['restriction'],
                };
                break;
            }

            case 'exactCount': {
                const targetCount = 1 + Math.floor(Math.random() * 4);
                const missionText = phrase('exactCount')(targetCount);
                if (missionText === lastMissionText) continue;
                
                mission = {
                    missionType: 'exactCount',
                    text: missionText,
                    targetCount,
                    tags: ['count'],
                };
                break;
            }

            default: {
                // Fallback to mixed types mission
                const count = 2 + Math.floor(Math.random() * (GAME_CONFIG.TYPES.length - 2));
                const types = getRandomTypes(count);
                const missionText = `Create a mostly ${types.map(t => t.toLowerCase()).join(' and ')} blend.`;
                if (missionText === lastMissionText) continue;
                
                mission = {
                    missionType: 'mixedTypes',
                    text: missionText,
                    targetTypes: types,
                    tags: ['mixedTypes', ...types.map(t => t.toLowerCase())],
                };
            }
        }

        // If we've tried too many times, force a new mission
        if (attempts >= maxAttempts && !mission) {
            const cocktail = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
            mission = {
                missionType: 'cocktail',
                text: `I'll have a "${cocktail.name}" please.`,
                targetCocktail: cocktail,
                difficulty: GAME_CONFIG.DIFFICULTY_MULTIPLIERS.EASY,
                tags: ['cocktail', ...(cocktail.tags || []).map(t => t.toLowerCase())],
            };
        }
    } while (!mission || mission.text === lastMissionText);

    lastMissionText = mission.text;
    return mission;
}

// ============= Financial Calculations =============

/**
 * Calculate financial results for the day
 * Includes earnings, expenses, and new balance
 * 
 * @param {number} drinksServed - Number of drinks served
 * @param {number} currentMoney - Current money before calculations
 * @param {Object} upgrades - Current upgrades state
 * @returns {Object} Financial summary for the day
 */
export function getScoreData(drinksServed = 0, currentMoney = 0, upgrades = {}) {
    // Base revenue calculations
    const basePrice = 20;
    const drinkBonus = upgrades.drinkIncome ? 10 : 0; // +10 gold per drink with upgrade
    const moneyEarned = drinksServed * (basePrice + drinkBonus);

    // Fixed daily expenses
    let rentCost = 60;
    let foodCost = 8;
    let boozeCost = Math.max(12, Math.floor(drinksServed * 5));
    
    // Apply cost reduction if upgrade is purchased
    if (upgrades.costReduction) {
        rentCost = Math.floor(rentCost * 0.85); // 15% reduction
        foodCost = Math.floor(foodCost * 0.85);
        boozeCost = Math.floor(boozeCost * 0.85);
    }
    
    // Calculate totals
    const totalCost = rentCost + boozeCost + foodCost;
    let net = moneyEarned - totalCost;
    
    // Apply debt reduction if it's a one-time upgrade
    let newBalance = currentMoney + net;
    if (upgrades.debtReduction && currentMoney < 0) {
        newBalance = Math.min(0, Math.floor(newBalance * 0.95)); // 5% debt reduction
    }

    return {
        moneyEarned,
        boozeCost,
        rentCost,
        foodCost,
        totalCost,
        net,
        newBalance
    };
}

/**
 * Filter missions by tag
 * Used for mission selection and tracking
 * 
 * @param {Array} missions - List of missions to filter
 * @param {string} tag - Tag to filter by
 * @returns {Array} Filtered mission list
 */
export function filterMissionsByTag(missions, tag) {
    if (!tag) return missions;
    const lowerTag = tag.toLowerCase();
    return missions.filter(
        m => m.tags?.some(t => t.toLowerCase() === lowerTag)
    );
}
