import getBlobDuration from "get-blob-duration";
import { useEffect, useState } from "react";
import { useVoiceRecorder } from "use-voice-recorder";
import { Message, Step, useEventEmitter } from "./App";

export enum RECORDER_EVENTS {
  START = "START_RECORDING",
  STOP = "STOP_RECORDING",
  NEW = "NEW_RECORDING",
}

export const Recorder: React.FC = () => {
  const { event, emitRemote } = useEventEmitter();

  const { isRecording, stop, start } = useVoiceRecorder((blob) => {
    getBlobDuration(blob).then(function (duration) {
      emitRemote({
        timestamp: Date.now(),
        event: RECORDER_EVENTS.NEW,
        data: {
          duration,
          url: window.URL.createObjectURL(blob),
        },
      });
    });
  });

  useEffect(() => {
    if (event) {
      if (event.event === RECORDER_EVENTS.START) {
        start();
      } else if (event.event === RECORDER_EVENTS.STOP) {
        stop();
      }
    }
  }, [event]);

  return (
    <div>
      <div>On air: {isRecording ? "on" : "off"}</div>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
};
