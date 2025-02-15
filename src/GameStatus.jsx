import './GameStatus.css';

function GameStatus({ currScore, bestScore }) {
    return (
        <div id="game-status">
            <h1>Score: {currScore}</h1>
            <h1>Best Score: {bestScore}</h1>
        </div>
    )
}

export default GameStatus;
