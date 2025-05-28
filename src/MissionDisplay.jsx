// MissionDisplay.jsx
export default function MissionDisplay({ mission }) {
    return (
        <p style={{ fontSize: '1.2rem' }}>
            {mission ? mission.text : 'Loading mission...'}
        </p>
    );
}
