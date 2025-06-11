import React, { useState } from 'react';
import './Bar.css';
import wallpaper from '../assets/wallpaper.png';
import honeyMug from '../assets/mug mostly honey.png';
import sugar from '../assets/Sugar.png';
import chiliFlakes from '../assets/Chili flakes.png';
import lemon from '../assets/Lemon.png';
import mintLeaf from '../assets/Mint leaf.png';
import strongBottle from '../assets/Strong bottle.png';
import sweetBottle from '../assets/Sweet bottle.png';
import sourBottle from '../assets/Sour bottle.png';
import herbalBottle from '../assets/Herbal bottle.png';

export default function Bar() {
    const [message, setMessage] = useState('');
    const [selectedGarnishes, setSelectedGarnishes] = useState([]);
    const [selectedBottle, setSelectedBottle] = useState(null);

    const handleGarnishClick = (garnish) => {
        setSelectedGarnishes(prev => {
            if (prev.includes(garnish)) {
                return prev.filter(g => g !== garnish);
            } else {
                return [...prev, garnish];
            }
        });
        setMessage(`${garnish} ${selectedGarnishes.includes(garnish) ? 'removed' : 'added'}`);
    };

    const handleBottleClick = (type) => {
        setSelectedBottle(type);
        setMessage(`Selected ${type} bottle!`);
    };

    const drinks = [
        { id: 'firewater', name: 'Firewater', type: 'Strong', iconClass: 'strong-drink' },
        { id: 'berry', name: 'Berry', type: 'Sour', iconClass: 'sour-drink' },
        { id: 'herbal', name: 'Herbal', type: 'Bitter', iconClass: 'bitter-drink' },
        { id: 'honey', name: 'Honey', type: 'Sweet', iconClass: 'sweet-drink' }
    ];

    const garnishes = [
        { id: 'mint', name: 'Mint Leaf', type: 'Bitter', iconClass: 'mint-icon' },
        { id: 'lemon', name: 'Lemon Twist', type: 'Sour', iconClass: 'lemon-icon' },
        { id: 'sugar', name: 'Sugar Rim', type: 'Sweet', iconClass: 'sugar-icon' },
        { id: 'chili', name: 'Chili Flake', type: 'Strong', iconClass: 'chili-icon' }
    ];

    return (
        <div className="bar-container">
            {/* Speech bubble */}
            <div className="speech-bubble">
                {message || "Welcome to the Tavern!"}
            </div>

            {/* Character/Mug */}
            <div className="character">
                <img src={honeyMug} alt="Honey Mug Character" className="mug-character" />
            </div>

            {/* Bottom shelf with bottles and garnishes */}
            <div className="bottom-shelf">
                {/* Bottles on the left */}
                <div className="drinks-container">
                    {drinks.map(drink => (
                        <button
                            key={drink.id}
                            className={`button-base drink-button ${selectedBottle === drink.id ? 'selected' : ''}`}
                            onClick={() => handleBottleClick(drink.id)}
                        >
                            <div className={`drink-icon ${drink.iconClass}`} />
                            <span className="ingredient-name">{drink.name}</span>
                            <span className="ingredient-type">{drink.type}</span>
                        </button>
                    ))}
                </div>

                {/* Honey jar in the middle */}
                <div className="honey-container">
                    <img src={honeyMug} alt="Honey Jar" className="honey-jar" />
                </div>

                {/* Garnishes on the right */}
                <div className="garnishes-container">
                    {garnishes.map(garnish => (
                        <button
                            key={garnish.id}
                            className={`button-base garnish-button ${selectedGarnishes.includes(garnish.id) ? 'selected' : ''}`}
                            onClick={() => handleGarnishClick(garnish.id)}
                        >
                            <div className={`garnish-icon ${garnish.iconClass}`} />
                            <span className="ingredient-name">{garnish.name}</span>
                            <span className="ingredient-type">{garnish.type}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 