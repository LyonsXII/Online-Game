import React from "react";
import { Box, Slide } from '@mui/material';

function Video(props) {
  return (<Slide direction="right" in={!props.hidden}>
            <Box sx={{height: "240px", width: "100%", boxShadow: 10, border: "4px solid antiquewhite", borderRadius: "20px"}}>
              <iframe src={props.url} 
                style={{ border: "none", borderRadius: "inherit", width: "100%", height: "100%" }}>
              </iframe>
            </Box>
          </Slide>)
}

export default Video