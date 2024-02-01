import React, { useEffect, useState } from 'react';
import Title from './Title';
import Video from "./Video";
import Choices from "./Choices"

function App() {
  const [hidden, setHidden] = useState(true);

  function toggleVideo() {
    hidden ? setHidden(false) : setHidden(true);
  }

  return (
    <div>
      {hidden ? 
        <Video hidden={hidden} url="https://www.youtube.com/embed/kNyR46eHDxE" /> : 
        <img src="https://images.twinkl.co.uk/tw1n/image/private/t_630/u/ux/question-mark_ver_1.jpg"
         height="250" width="250"></img>
      }
      <Choices hideVideo={toggleVideo}/>
    </div>
  )
}

export default App
