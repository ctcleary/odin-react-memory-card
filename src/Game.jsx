import { useState } from 'react';
import './Game.css';

function Game({ currScore, setCurrScore }) {
    const [cards, setCards] = useState([]);
    const [clickedCardIDs, setClickedCardIDs] = useState([]);

    function shuffleCards() {
        const shuffled = cards.slice();
        // Durstenfeld shuffle from StackOverflow.
        for (let i = shuffled.length -1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];   
        }
        return shuffled;
    }

    function createRandomCardDraw() {
        const shuffledCards = shuffleCards();
        return (
            <div>Random Card Draw!</div>
        )
    }

    function onCardClick(cardID) {
        const alreadyClicked = clickedCardIDs.find((clickedID) => { return cardID === clickedID; });
        if (alreadyClicked) {
            // End game run.
        } else {
            setCurrScore(currScore + 1);
        }
    }

    const randomCardDraw = createRandomCardDraw();

    return (
        <div id="game-output">
            <h1>Game Output</h1>
            {randomCardDraw}
        </div>
    )
}

export default Game;
