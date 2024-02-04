import React from "react";
import Button from '@mui/material/Button';
import { Home } from '@mui/icons-material';

function HomeButton(props) {
  return <Button onClick={props.resetGame} variant="contained" class="home-button"><Home /></Button>
}

export default HomeButton