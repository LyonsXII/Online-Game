import React, { useEffect, useState } from 'react';
import HomeButton from "./HomeButton";
import Video from "./Video";
import Choices from "./Choices"
import Button from '@mui/material/Button';
import { Repeat } from '@mui/icons-material';

function App() {
  const [hidden, setHidden] = useState(true);
  const [intro, setIntro] = useState(true);
  const [choices, setChoices] = useState([{}]);
  const [answer, setAnswer] = useState({option1: null, option2: null, option3: null, option4: null});
  
  function fetchQuestion(difficulty, category) {
    const API_URL = "/choices" + "?difficulty=" + difficulty + "&category=" + category;
    useEffect(() => {
      fetch(API_URL).then(
        response => response.json()
      ).then(
        data => {
          setChoices(data);
        }
      )
    }, []);
    
    // Shuffle choices using Fisher-Yates
    function shuffle(array) {
      var m = array.length, t, i;

      while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    }

    setChoices(shuffle(choices));
  }

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

  function handleCorrect(correct) {
    if (correct) {
      return { backgroundColor: correct }
    } else {
      return { backgroundColor: correct }
    }
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
        {choices.map((choice, index) => {
          <Choice key={index} name={choice.property} onClick={choice.correct ? handleCorrect(choice.correct) : null}/>
        })}
        <Choices hideVideo={toggleVideo}/>
      </div>
    )
  }
}

export default App
