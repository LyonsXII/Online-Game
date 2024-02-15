import React, { useState } from "react";
import axios from "axios";
import { useSound } from 'use-sound';
import HomeButton from "./HomeButton";
import Video from "./Video";
import Choice from "./Choice"
import Button from '@mui/material/Button';
import { Repeat } from '@mui/icons-material';
import myAudio from "./music/anime/Angel Beats OP1 - Easy.mp3";
import click from "./music/misc/Click.mp3";
import victory from "./music/misc/Victory.mp3";
import defeat from "./music/misc/Defeat.mp3";

// Import all mp3 files located inside src/music
// Files can be accessed via format audioFiles["music/anime/AngelBeats OP1 - Easy"]
const importAll = (context) => {
  let audioFiles = {};
  context.keys().forEach((filename) => {
    const audioName = filename.replace("./", "").replace(".mp3", "");
    audioFiles[audioName] = context(filename);
  });
  return audioFiles;
};
const audioContext = require.context("./", true, /\.mp3$/);
const audioFiles = importAll(audioContext);

function App() {
  const [hidden, setHidden] = useState(true);
  const [intro, setIntro] = useState(true);
  const [difficulty, setDifficulty] = useState("Hard");
  const [category, setCategory] = useState("Anime");
  const [choices, setChoices] = useState([{}]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [videoURL, setVideoURL] = useState("https://www.youtube.com/watch?v=7U7BDn-gU18");
  const [clickNoise] = useSound(click);
  const [playWin] = useSound(victory);
  const [playLose] = useSound(defeat);
  const [selectedSong, setSelectedSong] = useState(myAudio);
  const [play, { stop }] = useSound(selectedSong);

  // Fetch four options from our database 
  async function fetchData() {
    function shuffle(array) {
      // Fisher-Yates shuffle algorithm
      var m = array.length, t, i;
  
      while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
  
      return array;
    }
    try {
      // Post request to backend
      const postData = {"category": category, "difficulty": difficulty};
      const response = await axios.post('/choices', postData);

      // Setting retrieved data
      setVideoURL(response.data[0].video_link);
      setSelectedSong(audioFiles[response.data[0].location]);
      const shuffledChoices = shuffle(response.data);
      setChoices(shuffledChoices);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  function startGame() {
    clickNoise();
    fetchData();
    setIntro(false);
    setShowAnswer(false);
  }

  function resetGame() {
    clickNoise();
    setIntro(true);
    setHidden(true);
  }

  function handleCategory(event) {
    clickNoise();
    const category = event.target.value;
    setCategory(category);
  }

  function handleDifficulty(event) {
    clickNoise();
    const difficulty = event.target.value;
    setDifficulty(difficulty);
  }

  function toggleVideo() {
    hidden ? setHidden(false) : setHidden(true);
  }

  function handleClick(correct) {
    clickNoise();
    handleAnswer(correct);
    toggleVideo();
  }

  function handleAnswer(correct) {
    if (correct) {
      playWin();
    } else {
      playLose();
    }
    setShowAnswer(true);
    stop();
  }

  if (intro) {
    return (
      <div>
        <HomeButton resetGame={resetGame}/>
        <div className="grid">
          <div className = "flexbox">
            <Button onClick={handleCategory} value="Anime" variant="contained" className="option-button">Anime</Button>
            <Button onClick={handleCategory} value="Indie" variant="contained" className="option-button">Indie</Button>
            <Button onClick={handleCategory} value="Games" variant="contained" className="option-button">Games</Button>
          </div>
          <div className = "flexbox">
            <Button onClick={handleDifficulty} value="Easy" variant="contained" className="option-button">Easy</Button>
            <Button onClick={handleDifficulty} value="Hard" variant="contained" className="option-button">Hard</Button>
          </div>
          <div className="flexbox">
            <Button onClick={startGame} variant="contained" className="option-button">Start</Button>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <HomeButton resetGame={resetGame}/>
        {hidden ? 
          <div className="empty-box"><h1>Guess the Song... <Repeat onClick={() => play()} fontSize="large" sx={{ textShadow: 5, marginLeft: 2 }} /></h1></div> : 
          <Video hidden={hidden} url={videoURL} />
        }
        <div className="grid">
          {choices.map((choice, index) => {
            return <Choice key={index} index={index} id={choice.id} property={choice.property} correct={choice.correct} showAnswer={showAnswer} handleClick={handleClick} />
          })}
        </div>
      </div>
    )
  }
}

export default App
