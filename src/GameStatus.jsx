import './GameStatus.css';

function GameStatus({ currScore, bestScore }) {
    return (
        <div id="game-status">
            <h1 className="current-score">Score: {currScore}</h1>
            <h1 className="best-score">Best Score: {bestScore}</h1>
        </div>
    )
}

export default GameStatus;
