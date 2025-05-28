// GameLogic.js - Core game mechanics and mission generation
import { cocktailRecipes } from './CocktailData';

// ============= Game Constants =============

/**
 * Base ingredients available in the game
 * Each has a name and associated flavor type
 */
export const INGREDIENTS = [
    { name: 'Firewater', type: 'Strong' },
    { name: 'Berry',     type: 'Sour'   },
    { name: 'Herbal',    type: 'Bitter' },
    { name: 'Honey',     type: 'Sweet'  },
];

/**
 * Available garnishes for drink decoration
 * Affects drink evaluation for certain missions
 */
export const GARNISHES = [
    { name: 'Lemon Twist' },
    { name: 'Olive' },
    { name: 'Mint Leaf' },
    { name: 'Cherry' },
];

/**
 * Core flavor categories that define drink characteristics
 */
export const TYPES = ['Sweet', 'Sour', 'Strong', 'Bitter'];

/**
 * Available drink preparation methods
 */
export const PREP_METHODS = ['Shaken', 'Stirred', 'Poured'];

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
    TYPES
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

/**
 * Get a random ingredient from available ingredients
 * @returns {Object} Random ingredient object
 */
const getRandomIngredient = () => randomItem(INGREDIENTS);

// ============= Drink Evaluation =============

/**
 * Evaluate a drink against the current mission requirements
 * Returns points earned based on how well the drink matches the mission
 * 
 * @param {Array} mixGlass - Array of ingredients in the current drink
 * @param {Object} mission - Current mission requirements
 * @param {string|null} garnish - Applied garnish, if any
 * @param {string|null} prepMethod - Preparation method used
 * @returns {number} Points earned for the drink
 */
export function evaluateDrink(mixGlass, mission, garnish = null, prepMethod = null) {
    if (!mission) return 0;

    // Helper function to check cocktail requirements
    const checkCocktailMatch = (cocktail) => {
        // Check ingredients
        const ingNames = mixGlass.map(i => i.name).sort();
        const target = [...cocktail.ingredients].sort();
        const ingredientsMatch = ingNames.length === target.length &&
            target.every((v, i) => v === ingNames[i]);

        // Check garnish if specified
        const garnishMatch = !cocktail.garnishes || 
            (Array.isArray(cocktail.garnishes) && 
            cocktail.garnishes.includes(garnish));

        // Check preparation method if specified
        const servingMatch = !cocktail.serving ||
            cocktail.serving === prepMethod;

        return ingredientsMatch && garnishMatch && servingMatch;
    };

    // Evaluate based on mission type
    switch (mission.missionType) {
        case 'cocktail':
            return checkCocktailMatch(mission.targetCocktail) ? 30 : 0;

        case 'flavor':
            // Count ingredients of required type
            const flavorCount = mixGlass.filter(i => i.type === mission.targetType).length;
            return flavorCount >= mission.requiredCount ? 20 : 0;

        case 'ingredient':
            // Check for specific ingredient
            return mixGlass.some(i => i.name === mission.targetIngredient.name) ? 20 : 0;

        case 'preparation':
            // Check preparation method
            return prepMethod === mission.targetPrep ? 25 : 0;

        case 'garnishOnly':
            // Check garnish
            return garnish === mission.targetGarnish ? 15 : 0;

        case 'noType':
            // Check no forbidden types are used
            return !mixGlass.some(i => mission.forbiddenTypes.includes(i.type)) ? 25 : 0;

        case 'exactCount':
            // Check exact ingredient count
            return mixGlass.length === mission.targetCount ? 20 : 0;

        case 'mixedTypes': {
            // Check for multiple flavor types with emphasis on primary type
            const primaryCount = mixGlass.filter(i => i.type === mission.targetTypes[0]).length;
            return primaryCount >= 2 ? mission.targetTypes.length * 10 : 0;
        }

        default:
            return 0;
    }
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
        garnish => `Don't forget the ${garnish} on top!`,
        garnish => `I specifically want a ${garnish} garnish.`,
        garnish => `Make it pretty with a ${garnish}.`,
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
        'cocktail', 'flavor', 'ingredient', 'mixedTypes',
        'preparation', 'garnishOnly', 'noType', 'exactCount'
    ];
    
    let mission = null;

    do {
        const chosenType = randomItem(missionTypes);
        const phrase = (type) => randomItem(missionPhrases[type] || []);

        switch (chosenType) {
            case 'cocktail': {
                const cocktail = randomItem(cocktailRecipes);
                if (!cocktail) continue;
                
                mission = {
                    missionType: 'cocktail',
                    text: phrase('cocktail')(cocktail.name),
                    targetCocktail: cocktail,
                    tags: ['cocktail', ...(cocktail.tags || []).map(t => t.toLowerCase())],
                };
                break;
            }

            case 'flavor': {
                const [flavor] = getRandomTypes(1);
                const requiredCount = 1 + Math.floor(Math.random() * 3);
                
                mission = {
                    missionType: 'flavor',
                    text: phrase('flavor')(flavor, requiredCount),
                    targetType: flavor,
                    requiredCount,
                    tags: ['flavor', flavor.toLowerCase()],
                };
                break;
            }

            case 'preparation': {
                const targetPrep = randomItem(PREP_METHODS);
                mission = {
                    missionType: 'preparation',
                    text: phrase('prep')(targetPrep),
                    targetPrep,
                    tags: ['preparation'],
                };
                break;
            }

            case 'garnishOnly': {
                const targetGarnish = randomItem(GARNISHES).name;
                mission = {
                    missionType: 'garnishOnly',
                    text: phrase('garnish')(targetGarnish),
                    targetGarnish,
                    tags: ['garnish'],
                };
                break;
            }

            case 'noType': {
                const forbiddenTypes = getRandomTypes(1 + Math.floor(Math.random() * 2));
                mission = {
                    missionType: 'noType',
                    text: phrase('noType')(forbiddenTypes),
                    forbiddenTypes,
                    tags: ['restriction'],
                };
                break;
            }

            case 'exactCount': {
                const targetCount = 1 + Math.floor(Math.random() * 4);
                mission = {
                    missionType: 'exactCount',
                    text: phrase('exactCount')(targetCount),
                    targetCount,
                    tags: ['count'],
                };
                break;
            }

            default: {
                // Fallback to mixed types mission
                const count = 2 + Math.floor(Math.random() * (TYPES.length - 2));
                const types = getRandomTypes(count);
                mission = {
                    missionType: 'mixedTypes',
                    text: `Create a mostly ${types.map(t => t.toLowerCase()).join(' and ')} blend.`,
                    targetTypes: types,
                    tags: ['mixedTypes', ...types.map(t => t.toLowerCase())],
                };
            }
        }
    } while (mission?.text === lastMissionText);

    lastMissionText = mission?.text;
    return mission;
}

// ============= Financial Calculations =============

/**
 * Calculate financial results for the day
 * Includes earnings, expenses, and new balance
 * 
 * @param {number} drinksServed - Number of drinks served
 * @param {number} currentMoney - Current money before calculations
 * @returns {Object} Financial summary for the day
 */
export function getScoreData(drinksServed = 0, currentMoney = 0) {
    // Base revenue calculations
    const basePrice = 20;
    const moneyEarned = drinksServed * basePrice;

    // Fixed daily expenses
    const rentCost = 60;
    const foodCost = 8;
    
    // Variable expenses (scales with drinks served)
    const boozeCost = Math.max(12, Math.floor(drinksServed * 5));
    
    // Calculate totals
    const totalCost = rentCost + boozeCost + foodCost;
    const net = moneyEarned - totalCost;
    const newBalance = currentMoney + net;

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
