const SHAKEN = 'Shaken';
const STIRRED = 'Stirred';
const POURED = 'Poured';

const CHILI_FLAKE = ['Chili Flake'];
const LEMON_TWIST = ['Lemon Twist'];
const MINT_LEAF = ['Mint Leaf'];
const SUGAR_RIM = ['Sugar Rim'];

export const cocktailRecipes = [
    {
        name: 'Sunfire Elixir',
        ingredients: ['Firewater', 'Honey', 'Honey', 'Berry'],
        garnishes: CHILI_FLAKE,
        serving: SHAKEN,
        notes: 'Strong and sweet with a berry finish.',
        tags: ['Strong'],
    },
    {
        name: 'Herbal Bloom',
        ingredients: ['Herbal', 'Berry', 'Honey'],
        serving: STIRRED,
        notes: 'Bitter with a sweet and sour twist.',
        tags: ['Bitter'],
    },
    {
        name: 'Sour Sting',
        ingredients: ['Berry', 'Firewater'],
        garnishes: LEMON_TWIST,
        serving: POURED,
        notes: 'Sharp and hot, with a sour tang.',
        tags: ['Sour'],
    },
    {
        name: 'Bittersweet Dream',
        ingredients: ['Herbal', 'Honey'],
        serving: STIRRED,
        notes: 'Balanced bitter and sweet tones.',
        tags: ['Bitter'],
    },
    {
        name: 'Wild Blaze',
        ingredients: ['Firewater', 'Firewater', 'Berry', 'Berry'],
        serving: SHAKEN,
        notes: 'Double burn with a fruity punch.',
        tags: ['Strong'],
    },
    {
        name: 'Sweet Sin',
        ingredients: ['Honey', 'Honey', 'Berry'],
        serving: POURED,
        notes: 'Almost too sweet to be true.',
        tags: ['Sweet'],
    },
    {
        name: 'Forest Whisper',
        ingredients: ['Herbal', 'Herbal', 'Berry', 'Firewater'],
        garnishes: MINT_LEAF,
        serving: STIRRED,
        notes: 'Tastes like walking through an enchanted forest.',
        tags: ['Bitter'],
    },
    {
        name: 'Burning Truth',
        ingredients: ['Firewater', 'Herbal', 'Honey'],
        serving: SHAKEN,
        notes: 'Truth serum in a glass, if you can handle it.',
        tags: ['Strong'],
    },
    {
        name: 'Crimson Kiss',
        ingredients: ['Berry', 'Berry', 'Firewater'],
        serving: POURED,
        notes: 'A tart, dangerous delight.',
        tags: ['Strong'],
    },
    {
        name: 'Golden Glow',
        ingredients: ['Honey', 'Berry', 'Herbal'],
        garnishes: SUGAR_RIM,
        serving: SHAKEN,
        notes: 'Bright, soft and complex.',
        tags: ['Sweet'],
    },
    {
        name: 'Stroh 80',
        ingredients: ['Firewater', 'Firewater', 'Firewater', 'Herbal'],
        serving: POURED,
        notes: 'Tastes like a bad decision.',
        tags: ['Strong'],
    },
    // New cocktails
    {
        name: 'Velvet Night',
        ingredients: ['Berry', 'Honey', 'Herbal'],
        garnishes: MINT_LEAF,
        serving: STIRRED,
        notes: 'Smooth and dark with a hint of sweetness.',
        tags: ['Sweet'],
    },
    {
        name: 'Frostfire',
        ingredients: ['Firewater', 'Berry'],
        garnishes: [...SUGAR_RIM, ...LEMON_TWIST],
        serving: SHAKEN,
        notes: 'Icy sharp with a fiery finish.',
        tags: ['Strong'],
    },
    {
        name: 'Honeyed Thorn',
        ingredients: ['Honey', 'Herbal'],
        serving: POURED,
        notes: 'Sweet with a bitter undercurrent.',
        tags: ['Sweet'],
    },
    {
        name: 'Crimson Blaze',
        ingredients: ['Firewater', 'Berry', 'Berry'],
        garnishes: CHILI_FLAKE,
        serving: SHAKEN,
        notes: 'Hot and fruity, with a fiery kick.',
        tags: ['Strong'],
    },
    {
        name: 'Sage & Flame',
        ingredients: ['Herbal', 'Firewater'],
        garnishes: LEMON_TWIST,
        serving: STIRRED,
        notes: 'Herbal with a spicy warmth.',
        tags: ['Bitter'],
    },
    {
        name: 'Golden Whisper',
        ingredients: ['Honey', 'Herbal', 'Berry'],
        garnishes: MINT_LEAF,
        serving: SHAKEN,
        notes: 'Soft and fragrant, like a secret.',
        tags: ['Sweet'],
    },
    {
        name: 'Blazing Sundown',
        ingredients: ['Firewater', 'Honey', 'Berry'],
        garnishes: CHILI_FLAKE,
        serving: POURED,
        notes: 'Sunset in a glass with a burning edge.',
        tags: ['Strong'],
    },
    {
        name: 'Sweet Ember',
        ingredients: ['Honey', 'Firewater'],
        serving: STIRRED,
        notes: 'Sweetness melted into fire.',
        tags: ['Sweet'],
    },
    {
        name: 'Sour Glow',
        ingredients: ['Berry', 'Honey', 'Herbal'],
        garnishes: SUGAR_RIM,
        serving: SHAKEN,
        notes: 'Tart and bright with a soft finish.',
        tags: ['Sour'],
    },
];
