// GameLogic.js
import { cocktailRecipes } from './CocktailData';

/**
 * List of available base ingredients with their flavor types
 */
export const INGREDIENTS = [
    { name: 'Firewater', type: 'Strong' },
    { name: 'Berry',     type: 'Sour'   },
    { name: 'Herbal',    type: 'Bitter' },
    { name: 'Honey',     type: 'Sweet'  },
];

/**
 * List of optional garnishes
 */
export const GARNISHES = [
    { name: 'Lemon Twist' },
    { name: 'Olive' },
    { name: 'Mint Leaf' },
    { name: 'Cherry' },
];

/**
 * Core flavor categories
 */
export const TYPES = ['Sweet','Sour','Strong','Bitter'];

/**
 * Helper: pick a random element from an array
 * @param {Array} arr
 * @returns random element or null
 */
const randomItem = arr =>
    Array.isArray(arr) && arr.length
        ? arr[Math.floor(Math.random() * arr.length)]
        : null;

/**
 * Helper: shuffle and take N types
 * @param {number} count
 * @returns {string[]} random subset of TYPES
 */
const getRandomTypes = count =>
    TYPES
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

/**
 * Helper: pick a random base ingredient
 * @returns ingredient object
 */
const getRandomIngredient = () => randomItem(INGREDIENTS);


/**
 * Evaluate a mixGlass against the given mission, returning points
 * @param {{name:string,type:string}[]} mixGlass
 * @param {Object} mission
 * @returns {number} score earned
 */
export function evaluateDrink(mixGlass, mission) {
    if (!mission) return 0;

    switch (mission.missionType) {
        case 'cocktail': {
            // Compare sorted ingredient names for exact match
            const ingNames = mixGlass.map(i => i.name).sort();
            const target   = [...mission.targetCocktail.ingredients].sort();
            return ingNames.length === target.length &&
            target.every((v, i) => v === ingNames[i])
                ? 30  // full points for exact recipe
                : 0;
        }
        case 'flavor': {
            // Need at least 2 of the target flavor type
            const cnt = mixGlass.filter(i => i.type === mission.targetType).length;
            return cnt >= 2 ? 20 : 0;
        }
        case 'ingredient':
            // Need at least one of the specified ingredient
            return mixGlass.some(i => i.name === mission.targetIngredient.name)
                ? 20
                : 0;
        case 'mixedTypes': {
            // "Mostly" means at least 2 of the first type
            const need = mission.targetTypes[0];
            const cnt  = mixGlass.filter(i => i.type === need).length;
            return cnt >= 2
                ? mission.targetTypes.length * 10
                : 0;
        }
        default:
            return 0;
    }
}


// -- Mission generation logic --

/**
 * Variable to hold last mission text so we avoid repeats
 */
let lastMissionText = null;

/**
 * Phrase templates for each mission type
 */
const cocktailPhrases   = [name => `Serve me the legendary "${name}" cocktail.`, /*…*/];
const flavorPhrases     = [type => `Give me a bold ${type.toLowerCase()} taste.`, /*…*/];
const ingredientPhrases = [name => `Include ${name} in my drink.`, /*…*/];

/**
 * Generate a new random mission, never repeating the last text
 * @returns {Object} mission
 */
export function getRandomMission() {
    const missionTypes = ['cocktail', 'flavor', 'ingredient'];
    let mission = null;

    do {
        const chosenType = randomItem(missionTypes);

        if (chosenType === 'cocktail') {
            // Pick a random recipe
            const cocktail = randomItem(cocktailRecipes);
            if (!cocktail) continue;
            const phrase = randomItem(cocktailPhrases);
            mission = {
                missionType: 'cocktail',
                text: phrase(cocktail.name),
                targetCocktail: cocktail,
                // tags for filtering or analytics
                tags: ['cocktail', ...(cocktail.tags || []).map(t => t.toLowerCase())],
            };

        } else if (chosenType === 'flavor') {
            // Single flavor-type mission
            const [flavor] = getRandomTypes(1);
            mission = {
                missionType: 'flavor',
                text: randomItem(flavorPhrases)(flavor),
                targetType: flavor,
                tags: ['flavor', flavor.toLowerCase()],
            };

        } else if (chosenType === 'ingredient') {
            // Single-ingredient mission
            const ingredient = getRandomIngredient();
            if (!ingredient) continue;
            mission = {
                missionType: 'ingredient',
                text: randomItem(ingredientPhrases)(ingredient.name),
                targetIngredient: ingredient,
                tags: ['ingredient', ingredient.type.toLowerCase()],
            };
        }

        // Fallback if none matched
        if (!mission) {
            const count = 2 + Math.floor(Math.random() * (TYPES.length - 2));
            const types = getRandomTypes(count);
            mission = {
                missionType: 'mixedTypes',
                text: `Create a mostly ${types.map(t => t.toLowerCase()).join(' and ')} blend.`,
                targetTypes: types,
                tags: ['mixedTypes', ...types.map(t => t.toLowerCase())],
            };
        }

    } while (mission.text === lastMissionText);

    // Save to avoid immediate repetition
    lastMissionText = mission.text;
    return mission;
}


/**
 * Filter a list of missions by a given tag
 * @param {Object[]} missions
 * @param {string} tag
 * @returns {Object[]} filtered
 */
export function filterMissionsByTag(missions, tag) {
    if (!tag) return missions;
    const lowerTag = tag.toLowerCase();
    return missions.filter(
        m => m.tags?.some(t => t.toLowerCase() === lowerTag)
    );
}


/**
 * Compute daily financial summary based on drinks served
 * @param {number} drinksServed
 * @returns {{moneyEarned:number,boozeCost:number,rentCost:number,foodCost:number,totalCost:number,net:number}}
 */
export function getScoreData(drinksServed = 0) {
    const basePrice  = 20;                // revenue per drink
    const moneyEarned = drinksServed * basePrice;

    // Example costs
    const boozeCost  = 12 + Math.floor(Math.random() * 30);
    const rentCost   = 60;
    const foodCost   = 8;
    const totalCost  = rentCost + boozeCost + foodCost;

    return {
        moneyEarned,
        boozeCost,
        rentCost,
        foodCost,
        totalCost,
        net: moneyEarned - totalCost,
    };
}
