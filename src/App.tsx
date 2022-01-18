import { useEffect, useState } from "react";
import { Player } from "./Player";
import { XTerm } from "./Xterm";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Player />
      {/* <XTerm /> */}
    </div>
  );
}

export default App;
