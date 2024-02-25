import React, { useState } from "react";
import { useSound } from 'use-sound';
import axios from "axios";

import { Container, Box, Grid, Typography, createTheme } from "@mui/material";
import { Repeat } from '@mui/icons-material';
import { SkipNext } from '@mui/icons-material';

import HomeButton from "./HomeButton";
import Video from "./Video";
import Choice from "./Choice"
import Button from '@mui/material/Button';

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
  const [songInfo, setSongInfo] = useState([{}]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [videoURL, setVideoURL] = useState("https://www.youtube.com/watch?v=7U7BDn-gU18");
  const [clickNoise] = useSound(click);
  const [playWin] = useSound(victory);
  const [playLose] = useSound(defeat);
  const [selectedSong, setSelectedSong] = useState(myAudio);
  const [play, { stop }] = useSound(selectedSong);
  const [playing, setPlaying] = useState(false);

  // Fetch options from database
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
      const data = response.data[0];
      setSongInfo({property: data.property, song_name: data.song_name, difficulty: data.difficulty});
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

  function nextQuestion() {
    clickNoise();
    fetchData();
    setShowAnswer(false);
    setHidden(true);
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


  let songTimeout;
  function playSong() {
    clearTimeout(songTimeout);
    if (playing === true) {
      stop();
      setPlaying(false);
    } else {
      play();
      setPlaying(true);
      songTimeout = setTimeout(() => {setPlaying(false);}, 5000);
    }
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

  const theme = createTheme({
    palette: {
      primary: {
        main: "#4f3b78"
      },
      secondary: {
        main: "#927fbf"
      },
      typography: {
        fontFamily: [
          'Anta',
          'Roboto'
        ].join(',')
      },
    }
  })

  if (intro) {
    return (
        <div>
          <Box sx={{ position: "absolute", top: 0, right: 0, marginTop: 2, marginRight: 2 }}>
            <HomeButton resetGame={resetGame}/>
          </Box>

          <Container sx={{ display: "flex", width: 0.8, justifyContent: "center", alignItems: "center" }} style={{ minHeight: "100vh" }}>
            <Grid container spacing={2} sx={{ width: 1 }}>

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography variant="h1" color="antiquewhite" sx={{ textShadow: "4px 4px #000000" }}>Song Guesser</Typography>
              </Grid>

              <Grid container spacing={2} sx={{ marginRight: 4, width: 0.5, marginTop: 2 }}>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Anime" variant="contained" sx={{width: 1}}>Anime</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Indie" variant="contained" sx={{width: 1}}>Indie</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Games" variant="contained" sx={{width: 1}}>Games</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Games" variant="contained" sx={{width: 1 }}>Movies</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Games" variant="contained" sx={{width: 1}}>TV</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Games" variant="contained" sx={{width: 1}}>Top 40</Button>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ width: 0.5, justifyContent: "center", alignItems: "center", marginTop: 2 }}>
                <Grid item xs={6}>
                  <Button onClick={handleDifficulty} value="Easy" variant="contained" sx={{width: 1}}>Easy</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleDifficulty} value="Hard" variant="contained" sx={{width: 1}}>Hard</Button>
                </Grid>
                <Grid item xs={12}>
                  <Button onClick={startGame} variant="contained" sx={{width: 1, height: 90}}>Start</Button>
                </Grid>
              </Grid>

            </Grid>
          </Container>
        </div>
    )
  } else {
    return (
      <div>
        <Box sx={{ position: "absolute", top: 0, right: 0, marginTop: 2, marginRight: 2 }}>
          <HomeButton resetGame={resetGame}/>
        </Box>
        <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: 0.8 }} style={{minHeight: "100vh"}}>
          <Grid container spacing={2} sx={{ width: 1, justifyContent: "center", alignItems: "center"}}>
            <Grid item xs={10} style={{width: 1}}>
              {hidden ? 
                <div className="empty-box">
                  <h1>Guess the Song... <Repeat onClick={() => playSong()} fontSize="large" sx={{textShadow: 5, marginLeft: 2}} /></h1>
                </div> 
                : <Video hidden={hidden} url={videoURL}  />
              }
            </Grid>

            {hidden ? null 
              : <Grid item xs={1} sx={{marginLeft: 1, width: "10px !important"}}>
                  <Button onClick={nextQuestion} variant="contained" sx={{height: "80px", width: "10px", minWidth: "unset"}}><SkipNext sx={{height: "40px"}}/></Button>
                  <Button onClick={playSong} variant="contained" sx={{height: "80px", width: "10px", minWidth: "unset", marginTop: 2}}><Repeat sx={{height: "40px"}}/></Button>
                </Grid>
            }

            {hidden ? null 
              : <Box>
                  <Grid item xs={12} sx={{alignSelf: "start", height: "20px", margin: 0, marginTop: 1}}>
                    <h1 style={{margin: "0px"}}>{songInfo.property}</h1>
                  </Grid>
                  <Grid item xs={12} sx={{height: "14px", margin: 0}}><h2>{songInfo.song_name}</h2></Grid>
                </Box>
            }

            <Grid container spacing={1} sx={{ width: 1, marginTop: 3 }}>
              {choices.map((choice, index) => {
                return <Grid item xs={6} sx={{ width: 1, height: 1 }}><Choice key={index} index={index} id={choice.id} property={choice.property} correct={choice.correct} showAnswer={showAnswer} handleClick={handleClick} /></Grid>
              })}
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  }
}

export default App
