import React, { useEffect, useState } from 'react';
import HomeButton from "./HomeButton";
import Video from "./Video";
import Choices from "./Choices"
import Button from '@mui/material/Button';

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
      <div>
        <HomeButton resetGame={resetGame}/>
        <Button onClick={startGame} variant="contained" class="option-button">Start</Button>
      </div>
    )
  } else {
    return (
      <div>
        <HomeButton resetGame={resetGame}/>
        {hidden ? 
          <img src="https://images.twinkl.co.uk/tw1n/image/private/t_630/u/ux/question-mark_ver_1.jpg"
           height="280" width="500"></img> : 
          <Video hidden={hidden} url="https://www.youtube.com/embed/kNyR46eHDxE" />
        }
        <Choices hideVideo={toggleVideo}/>
      </div>
    )
  }
}

export default App
