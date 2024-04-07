import React, { useState, useEffect } from "react";
import { useSound } from 'use-sound';
import axios from "axios";

import { Container, Box, Grid, Typography, CardMedia, createTheme, ThemeProvider } from "@mui/material";
import { Repeat } from '@mui/icons-material';
import { SkipNext } from '@mui/icons-material';

import HomeButton from "./HomeButton";
import ToggleTheme from "./ToggleTheme";
import Video from "./Video";
import Choice from "./Choice"
import Button from '@mui/material/Button';

import click from "./music/misc/Click.mp3";
import victory from "./music/misc/Victory.mp3";
import defeat from "./music/misc/Defeat.mp3";

function App() {
  const [hidden, setHidden] = useState(true);
  const [intro, setIntro] = useState(true);
  const [difficulty, setDifficulty] = useState("Easy");
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

  const [songFilePath, setSongFilePath] = useState("");
  const [pipelineAudioFile, setPipelineAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);

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
        const choicesPostData = {"category": category, "difficulty": difficulty, "excluded": []};
      }
      const choicesPostData = {"category": category, "difficulty": difficulty, "excluded": excluded};
      const response = await axios.post('/choices', choicesPostData);

      // Setting retrieved data
      const data = response.data[0];
      setVideoURL(data.video_link);
      setSongFilePath(data.location);
      setExcluded((prev) => [...prev, data.id]);
      setSongInfo({id: data.id, property: data.property, song_name: data.song_name, difficulty: data.difficulty});
      const shuffledChoices = shuffle(response.data);
      setChoices(shuffledChoices);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };

  // Fetch chosen .mp3 from backend
  async function getAudio() {
    const songPostData = {"location": songFilePath};
    console.log("axios", songPostData);
    const songData = await axios.post('/mp3', songPostData, {responseType: "blob"});
    return songData.data
  }

  // Updating .mp3 reference whenever new songFilePath pulled
  useEffect(() => {
    if (songFilePath) {
      const fetchAudio = async () => {
        const audio = await getAudio();
        const url = URL.createObjectURL(audio);
        setPipelineAudioFile(url);
      };
  
      fetchAudio();
    }
   }, [songFilePath]);

  function startGame() {
    clickNoise();
    getNumQuestions();
    fetchData();
    setIntro(false);
    setShowAnswer(false);
    setScore(0);
    setExcluded([]);
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
    console.log(difficulty);
    setDifficulty(difficulty);
  }

  function toggleVideo() {
    hidden ? setHidden(false) : setHidden(true);
  }

  function handleClick(correct) {
    clickNoise();
    handleAnswer(correct);
    toggleVideo();
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
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
  }

  function toggleAudioPlayback() {
    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(!isPlaying);
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
      }
    },
    typography: {
      poster: {
        fontSize: "10rem",
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
    },
    typography: {
      poster: {
        fontSize: "10rem",
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
    },
    typography: {
      poster: {
        fontSize: "10rem",
      },
    }
  })];

  if (intro) {
    return (
        <ThemeProvider theme={themes[currTheme]}>
          <Box sx={{ position: "absolute", top: 0, right: 0, marginTop: 2, marginRight: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            <HomeButton resetGame={resetGame}/>
            <ToggleTheme toggleTheme={toggleTheme}/>
          </Box>
          <Box sx={{ position: "absolute", top: 0, right: 0, marginTop: 2, marginRight: 2 }}></Box>

          <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "98vw", minHeight: "98vh", marginTop: 2, '&.MuiContainer-root': {maxWidth: 'unset'} }}>

            <Grid container spacing={2} sx={{ width: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>

              <Grid item xs={12} sx={{textAlign: "center"}}>
                  <Typography variant="poster" color={themes[currTheme].palette.secondary.main} 
                    sx={{ textShadow: "4px 4px #000000", fontFamily: "Anta" }}>
                      Song Guesser
                  </Typography>
              </Grid>

              <Grid container spacing={2} sx={{ marginRight: 4, width: 0.4, marginTop: 4, height: "30vh" }}>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Anime" variant="contained" sx={{ width: 1, boxShadow: 10, border: "2px solid antiquewhite", height: "100%", padding: 0, typography: "h4", fontFamily: "Anta" }}>
                      Anime
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Indie" variant="contained" sx={{ width: 1, boxShadow: 10, border: "2px solid antiquewhite", height: "100%", padding: 0, typography: "h4", fontFamily: "Anta" }}>                    
                      Indie
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Video Games" variant="contained" sx={{ width: 1, boxShadow: 10, border: "2px solid antiquewhite", height: "100%", padding: 0, typography: "h4", fontFamily: "Anta" }}>
                      Video Games
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Movies" variant="contained" sx={{ width: 1, boxShadow: 10, border: "2px solid antiquewhite", height: "100%", padding: 0, typography: "h4", fontFamily: "Anta" }}>
                      Movies
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="TV Shows" variant="contained" sx={{ width: 1, boxShadow: 10, border: "2px solid antiquewhite", height: "100%", padding: 0, typography: "h4", fontFamily: "Anta" }}>
                      TV Shows
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleCategory} value="Top 40" variant="contained" sx={{ width: 1, boxShadow: 10, border: "2px solid antiquewhite", height: "100%", padding: 0, typography: "h4", fontFamily: "Anta" }}>
                      Top 40
                  </Button>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ width: 0.4, marginTop: 4, height: "20vh"}}>
                <Grid item xs={6}>
                  <Button onClick={handleDifficulty} value="Easy" variant="contained" sx={{ width: 1, boxShadow: 10, border: "2px solid antiquewhite", height: "100%", padding: 0, typography: "h3", fontFamily: "Anta" }}>
                      Easy
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleDifficulty} value="Hard" variant="contained" sx={{ width: 1, boxShadow: 10, border: "2px solid antiquewhite", height: "100%",padding: 0, typography: "h3", fontFamily: "Anta" }}>
                      Hard
                  </Button>
                </Grid>
                <Grid item xs={12} sx={{display: "flex", justifyContent: "center"}}>
                  <Button onClick={startGame} variant="contained" sx={{ width: 0.8, height: 90, boxShadow: 10, border: "2px solid antiquewhite", height: "100%", padding: 0, typography: "h3", fontFamily: "Anta" }}>
                      Start
                  </Button>
                </Grid>
              </Grid>

            </Grid>
          </Container>
        </ThemeProvider>
    )
  } else {
    return (
      <ThemeProvider theme={themes[currTheme]}>
        <Box sx={{ position: "absolute", top: 0, right: 0, marginTop: 2, marginRight: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <HomeButton resetGame={resetGame}/>
          <ToggleTheme toggleTheme={toggleTheme}/>
        </Box>

        <Box sx={{ position: "absolute", top: 0, left: 0, marginTop: 2, marginLeft: 2 }}>
            <Typography variant="h2" color={themes[currTheme].palette.secondary.main} sx={{ textShadow: "4px 4px #000000" }}>Score: {score}/{numQuestions - 3}</Typography>
        </Box>

        <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: 0.7, minHeight: "98vh", marginTop: 2, '&.MuiContainer-root': {maxWidth: 'unset'} }}>
          <Grid container spacing={2} sx={{ width: 1, justifyContent: "center", alignItems: "center"}}>
            <CardMedia component="audio" ref={audioRef} style={{display: "none"}} src={pipelineAudioFile}
              sx={{height: "100%", width: "100%", boxShadow: 10, borderRadius: "10px", border: "2px solid antiquewhite"}}
            />
            <Grid item xs={12} style={{width: 0.7}}>
              {hidden ?
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                  <Typography variant="h1" color={themes[currTheme].palette.secondary.main} 
                    sx={{ width: "100%", textShadow: "4px 4px #000000", marginRight: "0px", textAlign: "center"}}>
                    Guess the Song...
                    <Repeat onClick={toggleAudioPlayback} sx={{height: "100px", width: "100px", marginLeft: 4}}></Repeat>
                  </Typography>
                </Box>
                : <Box sx={{ display: "flex", justifyContent: "center", width: 1 }}>
                    <Grid item xs={11} >
                      <Video hidden={hidden} url={videoURL}/>
                    </Grid>
                    <Grid item xs={1} sx={{ marginLeft: 0, width: "100%"}}>
                      <Button onClick={nextQuestion} variant="contained" sx={{height: "calc(20vh - 3px)", width: "100%", minWidth: "unset", boxShadow: 10, border: "2px solid antiquewhite", marginLeft: 2 + "8px"}}><SkipNext sx={{height: "40px"}}/></Button>
                      <Button onClick={null} variant="contained" sx={{height: "calc(20vh - 3px)", width: "100%", minWidth: "unset", marginTop: 2, boxShadow: 10, border: "2px solid antiquewhite", marginLeft: 2 + "8px"}}><Repeat onClick={toggleAudioPlayback} sx={{height: "40px"}}/></Button>
                    </Grid>
                  </Box>
              }
            </Grid>

            {hidden ? null 
              : <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "end", margin: 0,  marginTop: 2 }}>
                    <Grid item ><Typography variant="h2" color={themes[currTheme].palette.secondary.main} sx={{ textShadow: "4px 4px #000000"}}>{songInfo.property}</Typography></Grid>
                    <Grid item ><Typography variant="h3" color={themes[currTheme].palette.secondary.main} sx={{ marginLeft: 4, textShadow: "4px 4px #000000" }}>{songInfo.song_name}</Typography></Grid>
                </Grid>
            }

            <Grid container spacing={2} sx={{width: 1, marginTop: 2}}>
              {choices.map((choice, index) => {
                return <Grid item xs={6} sx={{ width: 1, height: "100px" }}>
                  <Choice key={index} index={index} id={choice.id} property={choice.property} correct={choice.correct} showAnswer={showAnswer} handleClick={handleClick} style={{height: "100%"}}/>
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
