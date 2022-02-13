import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { useEffect } from "react";

const term = new Terminal();

export function XTerm() {
  useEffect(() => {
    term.open(document.getElementById("container")!);
    term.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
  },[]);

  return <div id="container"></div>;
}
