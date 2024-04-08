import React from "react";
import { Box, Grid, Slide } from '@mui/material';
import { SkipNext, Repeat } from '@mui/icons-material';

import Button from '@mui/material/Button';

function Video(props) {
  return (
    <Slide direction="right" in={!props.hidden}>
      <Box sx={{ display: "flex" }}>
          <Box sx={{height: "40vh", width: "60vw", boxShadow: 10, border: "4px solid antiquewhite", borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px"}}>
            <iframe src={props.url} style={{ border: "none", borderRadius: "inherit", width: "100%", height: "100%" }}></iframe>
          </Box>

          <Box sx={{display: "flex", flexDirection: "column"}}>
            <Button onClick={props.nextQuestion} variant="contained" sx={{height: "calc(20vh + 6px)", width: "60px", border: "4px solid antiquewhite", borderRadius: "0px", borderTopRightRadius: "20px", marginLeft: "-4px"}}>
              <SkipNext sx={{height: "40px", width: "40px"}}/>
            </Button>
            <Button onClick={props.toggleAudioPlayback} variant="contained" sx={{height: "calc(20vh + 6px)", width: "60px", border: "4px solid antiquewhite", borderRadius: "0px", borderBottomRightRadius: "20px", marginTop: "-4px", marginLeft: "-4px"}}>
              <Repeat sx={{height: "40px", width: "40px"}}/>
            </Button>
          </Box>
        
        </Box>
    </Slide>
  );
}

export default Video