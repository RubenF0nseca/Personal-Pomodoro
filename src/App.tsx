import "./App.css";
import { useState, useEffect } from "react";

function App() {
  let [timeLeft , setTimeLeft] = useState<number>(3000);
  let [pomodoroCount, setPomodoroCount] = useState<number>(0);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  useEffect(() => {

    const interval = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);

      if (timeLeft === 0 && pomodoroCount < 4) {
        setTimeLeft(3000);
        setPomodoroCount(pomodoroCount + 1);
      }

      if (timeLeft === 0 && pomodoroCount === 4) {
        setTimeLeft(3000);
        setPomodoroCount(0);
      }
    }, 1000);



    return () => clearInterval(interval);
  },[])



  return (
    <main className="container">
      <span style={{ fontSize: "50px" }}>{formatTime(timeLeft)}</span>
    </main>
  );
}

export default App;
