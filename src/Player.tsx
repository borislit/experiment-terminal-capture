import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Frame, useEventEmitter } from "./App";
import { RECORDER_EVENTS } from "./Recorder";
import "gantt-task-react/dist/index.css";
import { Gantt, Task } from "gantt-task-react";

interface EventTask extends Task {
  data: any;
}

function useEventsLog() {
  const { event } = useEventEmitter();
  const [events, setEvents] = useState<EventTask[]>([]);

  useEffect(() => {
    if (event?.event === "FRAME_CREATED") {
      const frame: Frame = event.data as Frame;
      const frameId = `Task_${Math.random()}`;
      const taskStart = new Date();
      taskStart.setDate(taskStart.getDate() + frame.id + 5)
      const actionTasks: EventTask[] = frame.actions.map((action) => ({
        id: `Action_${Math.random()}`,
        name: action.action,
        progress: 0,
        type: "task",
        start: taskStart,
        end: taskStart,
        data: action,
      }));

      const frameTask: EventTask = {
        id: frameId,
        name: `Frame ${frameId}`,
        progress: 0,
        type: "task",
        start: taskStart,
        end: taskStart,
        data: event.data,
        dependencies: actionTasks.map((action) => action.id),
      };

      setEvents((prev) => [...prev, frameTask, ...actionTasks]);
    }
  }, [event]);

  return events;
}

const SelectedTask: React.FC<{ task: Task }> = ({ task }) => {
  const eventTask: EventTask = task as EventTask;
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    function onTimeChange(e: any) {
      console.log("TIMEUPDATE", e);
    }

    audioRef.current?.addEventListener("timeupdate", onTimeChange);

    return audioRef.current?.removeEventListener("timeupdate", onTimeChange);
  }, []);

  if (eventTask.name == RECORDER_EVENTS.NEW) {
    return (
      <audio
        key={eventTask.id}
        src={eventTask.data.data.url as string}
        controls
        ref={audioRef}
      />
    );
  } else {
    return <div key={eventTask.id}>{eventTask.name}</div>;
  }
};

export const Player: React.FC = () => {
  const events = useEventsLog();
  const [task, setTask] = useState<EventTask>();
  if (!events.length) {
    return <div>No events</div>;
  }
  return (
    <>
      <Gantt
        headerHeight={0}
        tasks={events}
        onSelect={(task) => setTask(task as EventTask)}
      />
      {task && <SelectedTask task={task} />}
    </>
  );

  // return (
  //   <div id="demo">
  //     {events.map((event, index) => {
  //       if (event.event == RECORDER_EVENTS.NEW) {
  //         return (
  //           <audio
  //             key={index}
  //             src={event.data as string}
  //             controls
  //             ref={audioRef}
  //           />
  //         );
  //       } else {
  //         return <div key={index}>{event.data}</div>;
  //       }
  //     })}
  //   </div>
  // );
};
