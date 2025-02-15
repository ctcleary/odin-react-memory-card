import { useState } from 'react'
import './App.css'
import Game from './Game'
import GameStatus from './GameStatus';

function App() {
  const [currScore, setCurrScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  return (
    <>
    <h1 id="top-level-headline">The Odin Project - React Memory Card Game Assignment</h1>
    <div id="content-wrapper">
      <div id="content-container">  
        <p className="rules"><strong>The Rules:</strong> Click each image only once.<br/>
        The game will end if you select the same image twice!</p>
        <GameStatus 
          currScore={currScore}
          bestScore={bestScore}
        />
        <Game 
          currScore={currScore}
          setCurrScore={setCurrScore}
          bestScore={bestScore}
          setBestScore={setBestScore}
        />
      </div>
    </div>
    </>
  )
}

export default App
