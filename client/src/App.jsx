import React, { useEffect, useState } from 'react';
import HomeButton from "./HomeButton";
import Video from "./Video";
import Choices from "./Choices"
import Button from '@mui/material/Button';
import { Repeat } from '@mui/icons-material';

function App() {
  const [hidden, setHidden] = useState(true);
  const [intro, setIntro] = useState(true);

  function startGame() {
    setIntro(false);
  }

  function resetGame() {
    setIntro(true);
    setHidden(true);
  }

  function toggleVideo() {
    hidden ? setHidden(false) : setHidden(true);
  }

  if (intro) {
    return (
      <div class="flexbox">
        <HomeButton resetGame={resetGame}/>
        <Button onClick={startGame} variant="contained" class="option-button">Start</Button>
      </div>
    )
  } else {
    return (
      <div>
        <HomeButton resetGame={resetGame}/>
        {hidden ? 
          <div class="empty-box"><h1>Guess the Song... <Repeat fontSize="large" sx={{ textShadow: 5, marginLeft: 2 }} /></h1></div> : 
          <Video hidden={hidden} url="https://www.youtube.com/embed/kNyR46eHDxE" />
        }
        <Choices hideVideo={toggleVideo}/>
      </div>
    )
  }
}

export default App
