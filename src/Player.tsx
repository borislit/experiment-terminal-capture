import "./App.css";
import logo from "./logo.svg";
import * as AsciinemaPlayer from "asciinema-player";
import { useEffect } from "react";
export function Player() {
    useEffect(() => {
      AsciinemaPlayer.create(
        "ws://localhost:3002",
        document.getElementById("demo"),
        { autoPlay: true }
      );
    }, []);
  
    return <div id="demo"></div>;
  }