// Cocktail.jsx
import React from 'react';
import { INGREDIENTS, GARNISHES, GAME_CONFIG } from '../GameLogic';
import { cocktailRecipes } from '../cocktailData';

/**
 * Cocktail Component
 * Displays cocktail details and recipe information
 * 
 * @param {Object} props
 * @param {Object} props.cocktail - Cocktail recipe data
 * @param {boolean} props.isSelected - Whether this cocktail is selected
 * @param {Function} props.onSelect - Function to handle cocktail selection
 */
export default function Cocktail({ cocktail, isSelected, onSelect }) {
    if (!cocktail) return null;

    return (
        <div 
            onClick={() => onSelect(cocktail)}
            className={`cocktail-item${isSelected ? ' selected' : ''}`}
        >
            <strong>{cocktail.name}</strong>
            
            {isSelected && (
                <div className="cocktail-details">
                    <h3>{cocktail.name}</h3>
                    {cocktail.notes && (
                        <p><em>{cocktail.notes}</em></p>
                    )}
                    <p>Ingredients: {cocktail.ingredients.join(', ')}</p>
                    {cocktail.tags?.length > 0 && (
                        <p>Tags: {cocktail.tags.join(', ')}</p>
                    )}
                    {cocktail.garnishes && (
                        <p><strong>Garnish:</strong> {cocktail.garnishes.join(', ')}</p>
                    )}
                    {cocktail.serving && (
                        <p><strong>Serving:</strong> {cocktail.serving}</p>
                    )}
                </div>
            )}
        </div>
    );
} 