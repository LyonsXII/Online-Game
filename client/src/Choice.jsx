import React, { useState } from "react";
import Button from '@mui/material/Button';

function Choices(props) {
  const trueOrFalse = props.correct == true ? {backgroundColor: "green"} : {backgroundColor: "red"};

  return (
          <div className="choice">
              <Button onClick={props.handleClick} variant="contained" className="option-button" index={props.index} correct={props.correct} style={props.showAnswer ? trueOrFalse : null }>
                {props.property}
              </Button>
          </div>
          )
}

export default Choices