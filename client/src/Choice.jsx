import React from "react";
import Button from '@mui/material/Button';

function Choices(props) {
  const trueOrFalse = props.correct === true ? {backgroundColor: "green", height: "100%", width: "100%"} : {backgroundColor: "red", height: "100%", width: "100%"};

  return (
            <Button onClick={() => {props.handleClick(props.correct)}} variant="contained" className="option-button" index={props.index} correct={props.correct} sx={{ boxShadow: 10, border: "2px solid antiquewhite", typography: "h4", padding: 0}} style={props.showAnswer ? trueOrFalse : {height: "100%", width: "100%"} }>
              {props.property}
            </Button>
          )
}

export default Choices