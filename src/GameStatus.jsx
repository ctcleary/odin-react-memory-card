import './GameStatus.css';

function GameStatus({ currScore, bestScore }) {
    return (
        <div id="game-status">
            <h1>Curr score: {currScore}</h1>
            <h1>Best score: {bestScore}</h1>
        </div>
    )
}

export default GameStatus;
