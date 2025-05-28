// GameOverScreen.jsx
import React from 'react';

const details = [
    { label: 'Money Earned', key: 'moneyEarned' },
    { label: 'Rent Expense', key: 'rent'        },
    { label: 'Booze Expense', key: 'booze'      },
    { label: 'Food Expense', key: 'food'        },
];

export default function GameOverScreen({
                                           day,
                                           moneyEarned,
                                           rent,
                                           booze,
                                           food,
                                           totalCost,
                                           net,
                                           onNextDay,
                                       }) {
    const netLabel = net >= 0 ? 'earned' : 'lost';
    const netAbs   = Math.abs(net).toFixed(2);
    const values   = { moneyEarned, rent, booze, food };

    return (
        <section style={{
            background: 'white',
            padding: 20,
            borderRadius: 8,
            minWidth: 300
        }}>
            <h2>Day {day} Financial Report</h2>
            <ul>
                {details.map(({ label, key }) => (
                    <li key={key}>
                        {label}: ${Number(values[key]).toFixed(2)}
                    </li>
                ))}
            </ul>
            <p>
                Total <strong>{netLabel}</strong>: <strong>${netAbs}</strong>
            </p>
            <button onClick={onNextDay} style={{ marginTop: 10 }}>
                ➡️ Next Day
            </button>
        </section>
    );
}
