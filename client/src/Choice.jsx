import React, { useState } from "react";
import Button from '@mui/material/Button';

function Choices(props) {

  return (
          <div className="choice">
              <Button onClick={props.handleClick} variant="contained" className="option-button">{props.property}</Button>
          </div>
          )
}

export default Choices