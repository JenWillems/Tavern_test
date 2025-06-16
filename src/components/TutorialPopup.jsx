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
        content: "You've inherited this tavern and need to pay off a 20,000 gold debt in 30 days. Let's learn how to run the place!",
        image: null
    },
    {
        title: "The Mission Board",
        content: "This shows your current customer's order. Read it carefully to understand what drink they want!",
        image: tutorial1
    },
    {
        title: "Basic Ingredients",
        content: "You have four basic ingredients: Firewater (Strong), Berry (Sour), Herbal (Bitter), and Honey (Sweet). Click them to add to your drink.",
        image: tutorial2
    },
    {
        title: "Garnishes",
        content: "Add garnishes to enhance your drink: Mint Leaf (Bitter), Lemon Twist (Sour), Chili Flake (Strong), and Sugar Rim (Sweet).",
        image: tutorial3
    },
    {
        title: "Preparation Methods",
        content: "Choose how to prepare the drink: Stirred, Shaken, or Poured. Each method affects the final result!",
        image: tutorial4
    },
    {
        title: "The Cocktail Book",
        content: "Click the book icon to see known recipes. Use the filters to find drinks by their main flavor.",
        image: tutorial5
    },
    {
        title: "Progress and Money",
        content: "Click the tab Progress and Money to view how much money you have and debt, You can also buy upgrades her to make it easier to pay the debt",
        image: tutorial8
    },
    {
        title: "Serving Drinks",
        content: "Once you've made the drink, click the 'Serve' button. If it matches the order, you'll earn gold!",
        image: tutorial6
    },
    {
        title: "Daily Finance",
        content: "At the end of each day, you'll see your earnings and debt. The Merchants Guild charges 1,000 gold per day!",
        image: tutorial7
    },
    {
        title: "Ready to Start!",
        content: "Remember: Mix ingredients carefully, add garnishes, and choose the right preparation method. Good luck!",
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