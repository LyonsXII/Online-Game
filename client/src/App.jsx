import React, { useEffect, useState } from 'react';
import HomeButton from "./HomeButton";
import Video from "./Video";
import Choices from "./Choices"
import Button from '@mui/material/Button';
import { Repeat } from '@mui/icons-material';

function App() {
  const [hidden, setHidden] = useState(true);
  const [intro, setIntro] = useState(true);

  function fetchQuestion() {
    // Need to pull these from the  database
    // 1 - Query number of ids in table
    const numIDs = 20;
    // 2 - Randomly select one entry to serve as the correct answer and three more to fill the other choices
      let choices = [];
      const correctAnswer = Math.floor(Math.random() * 4);
      for (let i = 0; i < 4; i++) {
        const randChoice = Math.floor(Math.random() * numIDs)
        if (choices.includes(randChoice)) {i--; continue;}
        if (i == correctAnswer) {choices.push({"name": randChoice, "correct": true});}
        else {choices.push({"name": randChoice, "correct": false});}
      }
    // 3 - Use SQL queries to replace ID for each entry of choices with the name of the entry
      for (let i = 0; i < 4; i++) {
        choices[i] = "";
      }
    // 4 - Retrieve full set of details for the correct answer
      const questionData = {};
    // 5 - Shuffle choices using Fisher-Yates
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
      choices = shuffle(choices);
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

  function handleCorrect() {
    
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
          <Choice key={index} name={choice.name} onClick={choice.correct ? handleCorrect : null}/>
        })}
        <Choices hideVideo={toggleVideo}/>
      </div>
    )
  }
}

export default App
