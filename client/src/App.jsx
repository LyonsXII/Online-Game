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
      <Video hidden={hidden} url="https://www.youtube.com/embed/kNyR46eHDxE" />
      <Choices hideVideo={toggleVideo}/>
    </div>
  )
}

export default App
