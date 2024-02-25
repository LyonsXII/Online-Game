import React, { useState } from "react";

function Video(props) {

  return (<div>
            <iframe src={props.url} style={{height: "310px", border: "5px dashed antiquewhite", width: "100%"}}>
            </iframe>
          </div>)
}

export default Video