import React, { useState } from 'react';
import './TutorialPopup.css';

// Import tutorial images
import tutorial1 from '../assets/tutorial/tutorial_1.png';
import tutorial2 from '../assets/tutorial/tutorial_2.png';
import tutorial3 from '../assets/tutorial/tutorial_3.png';
import tutorial4 from '../assets/tutorial/tutorial_4.png';
import tutorial5 from '../assets/tutorial/tutorial_5.png';
import tutorial6 from '../assets/tutorial/tutorial_6.png';
import tutorial7 from '../assets/tutorial/tutorial_7.png';
import tutorial8 from '../assets/tutorial/tutorial_8.png';

const TUTORIAL_STEPS = [
    {
        title: "Welcome to The Tipsy Dragon!",
        content: "Your goal: Pay off a 20,000 gold debt in 30 days. Serve drinks, manage money, and upgrade wisely to save the tavern!",
        image: null
    },
    {
        title: "Reading Orders",
        content: "The speech bubble shows each customer's order. Orders may ask for a specific cocktail, flavor, garnish, or preparation method.",
        image: tutorial1
    },
    {
        title: "Mixing Ingredients",
        content: "Click bottles to add up to 4 ingredients: Firewater (Strong), Berry (Sour), Herbal (Bitter), Honey (Sweet). Each ingredient has a flavor type.",
        image: tutorial2
    },
    {
        title: "Adding Garnishes",
        content: "Click a garnish to add it: Mint Leaf (Bitter), Lemon Twist (Sour), Chili Flake (Strong), Sugar Rim (Sweet). Some recipes require a specific garnish.",
        image: tutorial3
    },
    {
        title: "Preparation Methods",
        content: "Choose how to prepare the drink: Stirred, Shaken, or Poured. Some drinks require a specific method.",
        image: tutorial4
    },
    {
        title: "Serving & Feedback",
        content: "Click 'Serve' to deliver the drink. You'll get instant feedback in the speech bubble. Secret cocktails always count as correct and trigger a special popup!",
        image: tutorial6
    },
    {
        title: "Cocktail Book & Secrets",
        content: "Click the book to see all known recipes. Use filters to find drinks by flavor. Secret recipes are hidden until you discover them!",
        image: tutorial5
    },
    {
        title: "Upgrades & Progress",
        content: "Use gold to buy upgrades: more time, lower costs, better tips, skip orders, or pay debt. Upgrades make survival easier.",
        image: tutorial8
    },
    {
        title: "Money, Rent, and Daily Costs",
        content: "Each day, you pay rent, food, and booze costs. If you run out of gold, costs come out of your debt. Manage your money carefully!",
        image: tutorial7
    },
    {
        title: "End of Day & Game Over",
        content: "At the end of each day, you'll see a finance report. Survive 30 days and pay off your debt to win!",
        image: tutorial7
    },
    {
        title: "Ready to Play!",
        content: "Mix, serve, upgrade, and discover secrets. Good luck, tavern keeper!",
        image: null
    }
];

export default function TutorialPopup({ onClose }) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const step = TUTORIAL_STEPS[currentStep];

    return (
        <div className="tutorial-popup-overlay">
            <div className="tutorial-popup">
                <h2>{step.title}</h2>
                
                <div className="tutorial-content">
                    {step.image && (
                        <img 
                            src={step.image} 
                            alt={step.title}
                            className="tutorial-image"
                        />
                    )}
                    <p>{step.content}</p>
                </div>

                <div className="tutorial-navigation">
                    <button 
                        className="tutorial-button"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                    >
                        Previous
                    </button>
                    
                    <div className="tutorial-progress">
                        {TUTORIAL_STEPS.map((_, index) => (
                            <div 
                                key={index}
                                className={`progress-dot ${index === currentStep ? 'active' : ''}`}
                            />
                        ))}
                    </div>

                    <button 
                        className="tutorial-button"
                        onClick={handleNext}
                    >
                        {currentStep === TUTORIAL_STEPS.length - 1 ? 'Start Game' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
} 