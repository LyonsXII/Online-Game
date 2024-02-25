import React from "react";
import Button from '@mui/material/Button';

function Choices(props) {
  const trueOrFalse = props.correct === true ? {backgroundColor: "green", width: "100%"} : {backgroundColor: "red", width: "100%"};

  return (
          <div>
              <Button onClick={() => {props.handleClick(props.correct)}} variant="contained" className="option-button" index={props.index} correct={props.correct} sx={{boxShadow: 10, border: "2px solid antiquewhite"}} style={props.showAnswer ? trueOrFalse : {width: "100%"} }>
                {props.property}
              </Button>
          </div>
          )
}

export default Choices