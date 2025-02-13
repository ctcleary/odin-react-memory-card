import { useState } from 'react'

function Game({ currScore, setCurrScore }) {
    const [cards, setCards] = useState([]);

    function createRandomCardDraw() {
        return (
            <div>Random Card Draw!</div>
        )
    }

    function onCardClick(cardId) {

    }

    const randomCardDraw = createRandomCardDraw();

    return (
        <div>
            <h1>Game Output</h1>
            {randomCardDraw}
        </div>
    )
}

export default Game;
