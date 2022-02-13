import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Player } from "./Player";
import { Recorder } from "./Recorder";
import { XTerm } from "./Xterm";


type Action = {
  relativeStartTime: number;
  relativeEndTime: number;
  action: string;
  data: any;
};

export type Frame = {
  id: number;
  actions: Action[];
  starTime: number;
}

export type Message = {
  timestamp: number;
  event: string;
  data: Object;
};

export function useEventEmitter() {
  return useContext(SocketContext);
}

const SocketContext = createContext<{
  event: Message | undefined;
  emit: (event: Message) => void;
  emitRemote: (event: Message) => void;
}>(null as any);

const SocketProvider: React.FC = ({ children }) => {
  const [connection] = useState<WebSocket>(
    () => new WebSocket("ws://localhost:3002")
  );
  const [event, emit] = useState<Message>();

  const emitRemote = useCallback((event: Message) => {
    connection.send(JSON.stringify(event));
  },[connection]);
  

  useEffect(() => {
    connection.onmessage = (event) => emit(JSON.parse(event.data));
  }, []);
  return (
    <SocketContext.Provider value={{ event, emit, emitRemote }}>
      {children}
    </SocketContext.Provider>
  );
};

function App() {
  return (
    <SocketProvider>
      <div className="App">
        <Recorder />
        <Player />
      </div>
    </SocketProvider>
  );
}

export default App;
