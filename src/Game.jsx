import { useState, useEffect } from 'react';
import './Game.css';
import GIPHY_API_KEY from './GIPHY_API_KEY';
import DEFAULT_RESPONSE_DATA from './DEFAULT_RESPONSE_DATA';

const SEARCH_DELAY = 1000;
const RESET_GAME_TYPE = {
    LOSS: 'loss',
    WIN: 'win',
    SEARCH: 'search',
}

function Game({ currScore, setCurrScore, bestScore, setBestScore }) {
    const [searchDisabled, setSearchDisabled] = useState(false);

    const [cardsDisabled, setCardsDisabled] = useState(false);

    const [hasPlayed, setHasPlayed] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [hasChangedCount, setHasChangedCount] = useState(false);

    const [prevScore, setPrevScore] = useState(0);

    const [cardObjs, setCardObjs] = useState([]);
    const [shuffledCards, setShuffledCards] = useState([]);
    const [cardCount, setCardCount] = useState(12);

    const [clickedCardIDs, setClickedCardIDs] = useState([]);

    const [searchStr, setSearchStr] = useState('corgis');

    const loadingText = "Loading...";
    const fetchError = "Error fetching data from server. Aborting.";
    const noResults = "No results for current search string.";
    const [statusText, setStatusText] = useState(loadingText);

    async function getGiphyImages() {
        const response = await fetch(
            // This is how it should be done.
            // `https://api.giphy.com/v1/gifs/search?api_key=${import.meta.env.VITE_GIPHY_API_KEY}&rating=g&q=${searchStr}`,

            // This is what I have to do for the sake of showing my assignment.
            `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&rating=g&q=${searchStr}`,
            {
                mode: 'cors'
            }
        );
        if (!response.ok) {
            console.log('Error fetching giphy data.', response.status)
            setStatusText(fetchError);
            setSearchDisabled(true);
        }
        let imgData;
        const imgJson = await response.json();
        if (!imgJson || imgJson.data.length) {
            imgData = imgJson.data;
        } else {
            console.log('Using DEFAULT_RESPONSE_DATA');
            imgData = DEFAULT_RESPONSE_DATA;
        }

        if (imgData.length === 0) {
            console.log('No results');
            setStatusText(noResults);
            return;
        }

        const cardObjs = [];
        if (imgData) {
            for (let i = 0; i < cardCount; i++) {
                const entry = imgData[i];
                // console.log(entry.images.downsized.url);
                cardObjs.push({
                    id: crypto.randomUUID(),
                    url: entry.images.fixed_height_small.url
                });
            }
            setCardObjs(cardObjs);
            setShuffledCards(getShuffledCards(cardObjs));
        }
    }

    useEffect(() => {
        getGiphyImages();
    }, []);

    useEffect(() => {
        if (searchStr !== 'corgis' ) { setHasSearched(true); }
        if (cardCount !== 12) { setHasChangedCount(true); }

        // Only immediately search if nothing has happened.
        if (!hasPlayed && !hasSearched && !hasChangedCount) {
            getGiphyImages();
            return;
        }

        // Delay new search for images when searchStr changes
        const timeout = setTimeout(() => {
            resetGame(currScore, RESET_GAME_TYPE.SEARCH);
            getGiphyImages();
        }, SEARCH_DELAY);

        return () => {
            clearTimeout(timeout);
        };

    }, [searchStr, cardCount]);

    
    // useEffect(() => {
    //     // Only run when currScore is reset to 0, and not on initial mount
    //     if (currScore !== 0 || !hasPlayed) {
    //         return;
    //     }

    //     flashCoverEl();
    // }, [currScore])

    function flashCoverEl() {
        setCardsDisabled(true);
        const coverEl = document.querySelector('#cover');
        const anim = coverEl.animate([
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
        anim.addEventListener('finish', () => {
            console.log('animation end!');
            setCardsDisabled(false);
        });
    }

    function getShuffledCards(cardObjArr) {
        if (cardObjArr.length === 0) {
            return [];
        }

        const shuffled = cardObjArr.slice();
        // Durstenfeld shuffle from StackOverflow.
        for (let i = shuffled.length -1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];   
        }
        return shuffled;
    }

    function resetGame(score, resetType = null) {
        if (!resetType || resetType !== RESET_GAME_TYPE.SEARCH) {
            setPrevScore(score);
            flashCoverEl();
        }
        setCurrScore(0);
        setClickedCardIDs([]);
    }

    function onCardClick(cardID) {
        if (cardsDisabled) {
            return;
        }

        setHasPlayed(true);
        const alreadyClicked = clickedCardIDs.find((clickedID) => { return cardID === clickedID; });
        if (alreadyClicked) {
            // End game run.
            console.log("LOSER");
            if (currScore > bestScore) {
                setBestScore(currScore);
            }
            resetGame(currScore);
            return;
        }
        setCurrScore(currScore + 1);
        
        if (currScore + 1 >= cardCount) {
            flashCoverEl();
            setBestScore(currScore + 1);
            resetGame(currScore + 1);
        } else {
            setClickedCardIDs([
                ...clickedCardIDs,
                cardID
            ]);
            setShuffledCards(getShuffledCards(cardObjs));
        }
    }

    return (
        <div id="game-output">
            <h1>Ready to play? Get clicking!</h1>
            <div id="search-section">
                <label>
                    Change Image Search:
                    <input type="text" value={searchStr} 
                        onChange={(evt) => { setSearchStr(evt.target.value); }} 
                        disabled={searchDisabled}
                    />
                </label>
                <label>
                    Number of Cards:
                    <input type="number" value={cardCount}
                        onChange={(evt => { setCardCount(parseInt(evt.target.value, 10)); })} 
                        disabled={searchDisabled}
                    />
                </label>
                <br/>
                { searchDisabled && <span className="error-note">There was an error fetching data, search is currently disabled.</span> }
            </div>
            <div id="cover">
                { prevScore >= cardCount ? 
                    <>
                    You win!<br/>
                    Your Score: {prevScore}
                    </> 
                    :
                    <>
                    Oops! Try again!<br/>
                    Your Score: {prevScore}<br/>
                    Best Score: {bestScore}
                    </>
                }
            </div>
            <div id="card-draw">
                { 
                    !shuffledCards.length ? <div>{statusText}</div> :

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
            </div>
        </div>
    )
}

export default Game;
