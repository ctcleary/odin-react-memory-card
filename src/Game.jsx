import { useState, useEffect } from 'react';
import './Game.css';
import GIPHY_API_KEY from './GIPHY_API_KEY';


function Game({ currScore, setCurrScore, bestScore, setBestScore }) {
    const [hasPlayed, setHasPlayed] = useState(false);
    const [prevScore, setPrevScore] = useState(0);

    const [cardImgUrls, setCardImgUrls] = useState([]);

    const [clickedCardIDs, setClickedCardIDs] = useState([]);

    const loadingText = "Loading...";
    const fetchError = "Error fetching data from server. Aborting."
    const [statusText, setStatusText] = useState(loadingText);

    async function getGiphyImages() {
        const response = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&rating=g&q=corgis`,
            {
                mode: 'cors'
            }
        );
        if (!response.ok) {
            console.log('Error fetching giphy data.', response.status)
            setStatusText(fetchError);
            return;
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

    useEffect(() => {
        getGiphyImages();
    }, []);

    
    useEffect(() => {
        // Only run when currScore is reset to 0, and not on initial mount
        if (currScore !== 0 || !hasPlayed) {
            return;
        }

        const loseCover = document.querySelector('#lose-cover');
        loseCover.animate([
            {
                display: 'grid',
                opacity: 0
            },
            { opacity: 1 },
            { opacity: 1 },
            { opacity: 1 },
            {
                display: 'none',
                opacity: 0
            }
        ], 1750);
    }, [currScore])

    function shuffleCardImgURLs() {
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
        const shuffledCards = shuffleCardImgURLs();
        return (
            <>
            { !shuffledCards.length ? <div>{statusText}</div> :
                shuffledCards.map((obj, i) => {
                    return (
                        <div
                            className="card"
                            key={obj.id}
                            onClick={() => { onCardClick(obj.id); }}
                        >
                            <img src={obj.url} />
                        </div>
                    )
                })
            }
            </>
        )
    }

    function resetGame() {
        setPrevScore(currScore);
        setCurrScore(0);
        setClickedCardIDs([]);
    }

    function onCardClick(cardID) {
        setHasPlayed(true);
        const alreadyClicked = clickedCardIDs.find((clickedID) => { return cardID === clickedID; });
        if (alreadyClicked) {
            // End game run.
            console.log("LOSEER");
            if (currScore > bestScore) {
                setBestScore(currScore);
            }
            resetGame();

        } else {
            setCurrScore(currScore + 1);
            setClickedCardIDs([
                ...clickedCardIDs,
                cardID
            ]);
        }
    }

    const randomCardDraw = createRandomCardDraw();

    return (
        <div id="game-output">
            <h1>Ready to play? Get clicking!</h1>
            <div id="lose-cover">
                Oops! Try again!<br/>
                Your Score: {prevScore}<br/>
                Best Score: {bestScore}
            </div>
            <div id="card-draw">
                {randomCardDraw}
            </div>
        </div>
    )
}

export default Game;
