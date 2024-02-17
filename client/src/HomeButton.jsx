import React from "react";
import Button from '@mui/material/Button';
import { Home } from '@mui/icons-material';

function HomeButton(props) {
  return (<Button onClick={props.resetGame} variant="contained">
            <Home sx={{height: 24, width: 24}} />
          </Button>)
}

export default HomeButton