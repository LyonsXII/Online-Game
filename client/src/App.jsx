import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSound } from 'use-sound';
import HomeButton from "./HomeButton";
import Video from "./Video";
import Choice from "./Choice"
import Button from '@mui/material/Button';
import { Repeat } from '@mui/icons-material';
import myAudio from "./music/anime/Angel Beats OP1 - Easy.mp3";

// Importing all mp3 files located src/music
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
  const [difficulty, setDifficulty] = useState("Easy");
  const [category, setCategory] = useState("Anime");
  const [choices, setChoices] = useState([{}]);
  const [answer, setAnswer] = useState({option1: null, option2: null, option3: null, option4: null});
  const [selectedSong, setSelectedSong] = useState(myAudio);
  const [play, { stop }] = useSound(selectedSong);

  const fetchData = async () => {
    try {
      // Make a POST request to your backend endpoint with the postData
      const postData = {"category": category, "difficulty": difficulty};
      const response = await axios.post('/choices', postData);
      
      // Set the data received from the backend to the state
      setChoices(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {updateSong()}, [choices]);

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

  function updateSong() {
    const chosenSong = choices.filter((choice) => {return choice.correct === true;});
    if (chosenSong.length == 1) {setSelectedSong(audioFiles[chosenSong[0].location]);}
  }

  function startGame() {
    fetchData();
    setIntro(false);
  }

  function resetGame() {
    setIntro(true);
    setHidden(true);
  }

  function handleCategory(event) {
    const category = event.target.value;
    setCategory(category);
  }

  function handleDifficulty(event) {
    const difficulty = event.target.value;
    setDifficulty(difficulty);
  }

  function toggleVideo() {
    hidden ? setHidden(false) : setHidden(true);
  }

  function handleClick(event) {
    handleAnswer(event);
    toggleVideo();
  }

  function handleAnswer(event) {
    const {index, id, property, correct} = event.target;
    const optionNumber = "option" + index;
    setAnswer((prevValue) => {
      return {
        ...prevValue,
        [optionNumber]: correct
      }
    });
  }

  if (intro) {
    return (
      <div>
        <HomeButton resetGame={resetGame}/>
        <div className="grid">
          <div className = "flexbox">
            <Button onClick={handleCategory} value="Anime" variant="contained" className="option-button">Anime</Button>
            <Button onClick={handleCategory} value="TV" variant="contained" className="option-button">TV</Button>
            <Button onClick={handleCategory} value="Movies" variant="contained" className="option-button">Movies</Button>
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
          <Video hidden={hidden} url="https://www.youtube.com/embed/kNyR46eHDxE" />
        }
        <div className="grid">
          {choices.map((choice, index) => {
            return <Choice key={index} index={index} id={choice.id} property={choice.property} correct={choice.correct} onClick={handleClick}/>
          })}
        </div>
      </div>
    )
  }
}

export default App
