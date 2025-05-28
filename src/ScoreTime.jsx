// ScoreTime.jsx
export default function ScoreTime({ score, timeLeft }) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div style={{ marginTop: '20px' }}>
            <p><strong>Score:</strong> {score} / 100</p>
            <p><strong>Time Left:</strong> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
        </div>
    );
}
