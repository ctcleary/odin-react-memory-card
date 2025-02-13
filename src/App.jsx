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
        <GameStatus 
          currScore={currScore}
          bestScore={bestScore}
        />
        <Game 
          currScore={currScore}
          setCurrScore={setCurrScore}
        />
      </div>
    </div>
    </>
  )
}

export default App
