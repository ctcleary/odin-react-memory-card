import { useState, useEffect } from 'react';
import './Game.css';
import GIPHY_API_KEY from './GIPHY_API_KEY';


function Game({ currScore, setCurrScore, bestScore, setBestScore }) {
    // const [cards, setCards] = useState([]);
    const [cardImgUrls, setCardImgUrls] = useState([]);
    const [clickedCardIDs, setClickedCardIDs] = useState([]);


    useEffect(() => {
        async function getGiphyImages() {
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&rating=g&q=corgis`,
                {
                    mode: 'cors'
                }
            );
            if (!response.ok) {
                console.log('Error fetching giphy data.', response.status)
            }
            const imgJson = await response.json();
            // console.log(imgJson.data);
            const imgData = imgJson.data;

            const imgUrls = [];
            if (imgData) {
                for (let i = 0; i < 12; i++) {
                    const entry = imgData[i];
                    // console.log(entry.images.downsized.url);
                    imgUrls.push({
                        id: crypto.randomUUID(),
                        url: entry.images.fixed_height_small.url
                    });
                }
                setCardImgUrls(imgUrls);
            }
        }
        
        getGiphyImages();


        return () => {}
    }, []);

    function shuffleCards() {
        // const shuffled = cards.slice();
        if (cardImgUrls.length === 0) {
            return [];
        }

        const shuffled = cardImgUrls.slice();
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
            <div id="card-draw">
                {/* Random Card Draw! */}
                { !shuffledCards.length ? <div>Loading...</div> :
                    shuffledCards.map((obj, i) => {
                        return (
                            <div
                                className="card"
                                key={obj.id}
                                onClick={() => { onCardClick(obj.id)}}
                            >
                                <img src={obj.url} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    function onCardClick(cardID) {
        const alreadyClicked = clickedCardIDs.find((clickedID) => { return cardID === clickedID; });
        if (alreadyClicked) {
            // End game run.
            console.log("LOSEER");
            if (currScore > bestScore) {
                setBestScore(currScore);
            }
            // Reset game.
            setCurrScore(0);
            setClickedCardIDs([])

        } else {
            setCurrScore(currScore + 1);
            setClickedCardIDs([
                ...clickedCardIDs,
                cardID
            ])
        }
    }

    const randomCardDraw = createRandomCardDraw();

    return (
        <div id="game-output">
            <h1>Ready to play? Get clicking!</h1>
            {randomCardDraw}
        </div>
    )
}

export default Game;
