import React, { useState, useEffect } from "react";
import { useSound } from 'use-sound';
import axios from "axios";

import { Container, Box, Grid, Typography, createTheme, ThemeProvider } from "@mui/material";
import { Repeat } from '@mui/icons-material';
import { SkipNext } from '@mui/icons-material';

import HomeButton from "./HomeButton";
import ToggleTheme from "./ToggleTheme";
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
  const [numQuestions, setNumQuestions] = useState(0);
  const [songInfo, setSongInfo] = useState([{}]);
  const [excluded, setExcluded] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [videoURL, setVideoURL] = useState("https://www.youtube.com/watch?v=7U7BDn-gU18");

  const [clickNoise] = useSound(click);
  const [playWin] = useSound(victory);
  const [playLose] = useSound(defeat);
  const [selectedSong, setSelectedSong] = useState(myAudio);
  const [play, { stop }] = useSound(selectedSong);
  const [playing, setPlaying] = useState(false);

  const [currTheme, setCurrTheme] = useState(0);

  // Fetch number of possible questions for category from database
  async function getNumQuestions() {
    const postData = {"category": category, "difficulty": difficulty};
    const response = await axios.post('/numQuestions', postData);
    setNumQuestions(response.data[0]["count"]);
  }

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
      if (excluded == [undefined]) {
        const postData = {"category": category, "difficulty": difficulty, "excluded": []};
      }
      const postData = {"category": category, "difficulty": difficulty, "excluded": excluded};
      const response = await axios.post('/choices', postData);

      // Setting retrieved data
      const data = response.data[0];
      setVideoURL(data.video_link);
      setSelectedSong(audioFiles[data.location]);
      setExcluded((prev) => [...prev, data.id]);
      setSongInfo({id: data.id, property: data.property, song_name: data.song_name, difficulty: data.difficulty});
      const shuffledChoices = shuffle(response.data);
      setChoices(shuffledChoices);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  function startGame() {
    clickNoise();
    getNumQuestions();
    fetchData();
    setIntro(false);
    setShowAnswer(false);
    setScore(0);
    setExcluded([]);
    // Insert db call here to query how many rows total
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
    let delayTime;
    if (songInfo.difficulty === "Easy") {delayTime = 10000} else {delayTime = 5000}
    clearTimeout(songTimeout);
    if (playing === true) {
      stop();
      setPlaying(false);
    } else {
      play();
      setPlaying(true);
      songTimeout = setTimeout(() => {setPlaying(false);}, delayTime);
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
      setScore(score + 1);
    } else {
      playLose();
      setScore(0);
    }
    setShowAnswer(true);
    stop();
  }

  function toggleTheme() {
    setCurrTheme((prevTheme) => (prevTheme + 1) % themes.length);
    
    if ((currTheme + 1) % themes.length === 0) {
      document.body.style.backgroundImage = "url('https://www.transparenttextures.com/patterns/cubes.png')";
      document.body.style.backgroundColor = "#3b006e";
    } else if ((currTheme + 1) % themes.length === 1) {
      document.body.style.backgroundImage = "url('https://www.transparenttextures.com/patterns/batthern.png')";
      document.body.style.backgroundColor = "#146e00";
    } else if ((currTheme + 1) % themes.length === 2) {
      document.body.style.backgroundImage = "url('https://www.transparenttextures.com/patterns/dark-wood.png')";
      document.body.style.backgroundColor = "#592500";
    }
  }

  let themes = [createTheme({
    palette: {
      primary: {
        main: "#393db3"
      },
      secondary: {
        main: "#faebd7"
      },
      typography: {
        fontFamily: [
          'Anta',
          'Roboto'
        ].join(',')
      },
    }
  }),
  createTheme({
    palette: {
      primary: {
        main: "#32ab50"
      },
      secondary: {
        main: "#faebd7"
      },
      typography: {
        fontFamily: [
          'Anta',
          'Roboto'
        ].join(',')
      },
    }
  }),
  createTheme({
    palette: {
      primary: {
        main: "#db9c5c"
      },
      secondary: {
        main: "#faebd7"
      },
      typography: {
        fontFamily: [
          'Anta',
          'Roboto'
        ].join(',')
      },
    }
  })];

  if (intro) {
    return (
        <ThemeProvider theme={themes[currTheme]}>
          <Box sx={{ position: "absolute", top: 0, right: 0, marginTop: 2, marginRight: 2, display: "flex", flexDirection: "column", gap: 1}}>
            <HomeButton resetGame={resetGame}/>
            <ToggleTheme toggleTheme={toggleTheme}/>
          </Box>
          <Box sx={{ position: "absolute", top: 0, right: 0, marginTop: 2, marginRight: 2 }}>
            
          </Box>

          <Container sx={{ display: "flex", width: 0.8, justifyContent: "center", alignItems: "center" }} style={{ minHeight: "100vh" }}>
            <Grid container spacing={2} sx={{ width: 1 }}>

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography variant="h1" color={themes[currTheme].palette.secondary.main} sx={{ textShadow: "4px 4px #000000" }}>Song Guesser</Typography>
              </Grid>

              <Grid container spacing={2} sx={{ marginRight: 4, width: 0.5, marginTop: 2 }}>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Anime" variant="contained" sx={{width: 1, boxShadow: 10, border: "2px solid antiquewhite"}}>Anime</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Indie" variant="contained" sx={{width: 1, boxShadow: 10, border: "2px solid antiquewhite"}}>Indie</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Video Games" variant="contained" sx={{width: 1, boxShadow: 10, border: "2px solid antiquewhite"}}>Video Games</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Games" variant="contained" sx={{width: 1, boxShadow: 10, border: "2px solid antiquewhite"}}>Movies</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Games" variant="contained" sx={{width: 1, boxShadow: 10, border: "2px solid antiquewhite"}}>TV</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Games" variant="contained" sx={{width: 1, boxShadow: 10, border: "2px solid antiquewhite"}}>Top 40</Button>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ width: 0.5, justifyContent: "center", alignItems: "center", marginTop: 2 }}>
                <Grid item xs={6}>
                  <Button onClick={handleDifficulty} value="Easy" variant="contained" sx={{width: 1, boxShadow: 10, border: "2px solid antiquewhite"}}>Easy</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleDifficulty} value="Hard" variant="contained" sx={{width: 1, boxShadow: 10, border: "2px solid antiquewhite"}}>Hard</Button>
                </Grid>
                <Grid item xs={12}>
                  <Button onClick={startGame} variant="contained" sx={{width: 1, height: 90, boxShadow: 10, border: "2px solid antiquewhite"}}>Start</Button>
                </Grid>
              </Grid>

            </Grid>
          </Container>
        </ThemeProvider>
    )
  } else {
    return (
      <ThemeProvider theme={themes[currTheme]}>
        <Box sx={{ position: "absolute", top: 0, right: 0, marginTop: 2, marginRight: 2 }}>
          <HomeButton resetGame={resetGame}/>
        </Box>

        <Box sx={{ position: "absolute", top: 0, left: 0, marginTop: 2, marginLeft: 2 }}>
            <Typography variant="h4" color={themes[currTheme].palette.secondary.main} sx={{ textShadow: "4px 4px #000000" }}>Score: {score}/{numQuestions - 3}</Typography>
        </Box>

        <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: 0.8 }} style={{minHeight: "100vh", maxWidth: "2000px"}}>
          <Grid container spacing={2} sx={{ width: 1, justifyContent: "center", alignItems: "center"}}>
            <Grid item xs={8} style={{width: 1}}>
              {hidden ?
                <Typography variant="h4" color={themes[currTheme].palette.secondary.main} sx={{ textShadow: "4px 4px #000000" }}>Guess the Song...<Repeat onClick={() => playSong()} fontSize="large" sx={{textShadow: 5, marginLeft: 2}} /></Typography>
                : <Box sx={{alignSelf: "start"}}>
                    <Video hidden={hidden} url={videoURL}/>
                  </Box>
              }
            </Grid>

            {hidden ? null 
              : <Grid item xs={1} sx={{marginLeft: 1, width: "10px"}}>
                  <Button onClick={nextQuestion} variant="contained" sx={{height: "80px", width: "10px", minWidth: "unset", boxShadow: 10, border: "2px solid antiquewhite"}}><SkipNext sx={{height: "40px"}}/></Button>
                  <Button onClick={playSong} variant="contained" sx={{height: "80px", width: "10px", minWidth: "unset", marginTop: 2, boxShadow: 10, border: "2px solid antiquewhite"}}><Repeat sx={{height: "40px"}}/></Button>
                </Grid>
            }

            {hidden ? null 
              : <Grid item xs={12} sx={{display: "flex", justifyContent: "flex-start", alignItems: "end", margin: 0}}>
                    <Grid item ><Typography variant="h4" color={themes[currTheme].palette.secondary.main} sx={{ textShadow: "4px 4px #000000" }}>{songInfo.property}</Typography></Grid>
                    <Grid item ><Typography variant="h5" color={themes[currTheme].palette.secondary.main} sx={{ marginLeft: 2, textShadow: "4px 4px #000000" }}>{songInfo.song_name}</Typography></Grid>
                </Grid>
            }

            <Grid container spacing={1} sx={{width: 1, marginTop: 2}}>
              {choices.map((choice, index) => {
                return <Grid item xs={6} sx={{ width: 1, height: 1 }}>
                  <Choice key={index} index={index} id={choice.id} property={choice.property} correct={choice.correct} showAnswer={showAnswer} handleClick={handleClick} />
                </Grid>
              })}
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    )
  }
}

export default App
