import React from "react";

function Video(props) {

  return (<div>
            <iframe src={props.url} sx={{boxShadow: 10}} style={{height: "240px", width: "100%", border: "2px solid antiquewhite", borderRadius: "25px"}}>
            </iframe>
          </div>)
}

export default Video