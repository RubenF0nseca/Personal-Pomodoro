import "./App.css";
import { useState, useEffect, useRef } from "react";

function App() {
  const WORK_DURATION = 10; // 50 minutos
  const SHORT_BREAK_DURATION = 10; // 10 minutos
  const LONG_BREAK_DURATION = 10; // 15 minutos

  let [timeLeft, setTimeLeft] = useState<number>(WORK_DURATION);
  let [pomodoroCount, setPomodoroCount] = useState<number>(0);
  // let [isRunning, setIsRunning] = useState<boolean>(false)
  const [breakTime, setBreakTime] = useState<boolean>(false);
  const [bigBreak, setBigBreak] = useState<boolean>(false);
  const [sessionTimes, setSessionTimes] = useState<number>(4);

  const completeSound = useRef<HTMLAudioElement | null>(null);
  const pauseSound = useRef<HTMLAudioElement | null>(null);

  type Title = "Break" | "Pomodoro" | "Big Break";
  const title: Title = bigBreak
    ? "Big Break"
    : breakTime
    ? "Break"
    : "Pomodoro";

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // end of pomodoro, but not the last -> short break
    if (timeLeft === 0 && pomodoroCount + 1 < sessionTimes && !breakTime) {
      setBreakTime(true);
      setTimeLeft(SHORT_BREAK_DURATION);
      setPomodoroCount((prevCount) => prevCount + 1);
    }

    // after short break -> back to work
    if (
      timeLeft === 0 &&
      pomodoroCount < sessionTimes &&
      breakTime &&
      !bigBreak
    ) {
      setBreakTime(false);
      setTimeLeft(WORK_DURATION);
    }

    // last pomodoro -> long break
    if (timeLeft === 0 && pomodoroCount + 1 === sessionTimes && !breakTime) {
      setBreakTime(true);
      setBigBreak(true);
      setTimeLeft(LONG_BREAK_DURATION);
      setPomodoroCount(sessionTimes);
    }

    // reset
    if (timeLeft === 0 && breakTime && bigBreak) {
      setBreakTime(false);
      setBigBreak(false);
      setTimeLeft(WORK_DURATION);
      setPomodoroCount(0);
    }
  }, [timeLeft]);

  const handleSessionDisplay = (): string => {
    if (bigBreak) return `${sessionTimes}/${sessionTimes}`;

    if (!breakTime) return `${pomodoroCount + 1}/${sessionTimes}`;

    return `${pomodoroCount}/${sessionTimes}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-4xl font-bold mb-4">{title}</h1>
        <p className="text-white text-lg opacity-60 mb-10">
          Session {handleSessionDisplay()}
        </p>
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white border-opacity-20">
          <span className="text-8xl font-mono font-bold text-white tracking-wider">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
