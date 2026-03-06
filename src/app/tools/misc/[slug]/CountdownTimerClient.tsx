'use client';

import { useState, useEffect, useRef } from 'react';

export default function CountdownTimerClient() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const start = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds <= 0) return;

    if (!isRunning) {
      setTimeLeft(totalSeconds);
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(true);
  };

  const resume = () => {
    setIsPaused(false);
  };

  const reset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return `${pad(m)}:${pad(s)}`;
  };

  const progress = isRunning
    ? ((hours * 3600 + minutes * 60 + seconds - timeLeft) / (hours * 3600 + minutes * 60 + seconds)) * 100
    : 0;

  return (
    <div className="space-y-6">
      {!isRunning ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Set Timer</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hours</label>
              <input
                type="number"
                min="0"
                max="99"
                value={hours}
                onChange={(e) => setHours(Math.max(0, Math.min(99, Number(e.target.value))))}
                className="w-full px-3 py-2 text-sm text-center border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                className="w-full px-3 py-2 text-sm text-center border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
                className="w-full px-3 py-2 text-sm text-center border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={() => { setHours(0); setMinutes(1); setSeconds(0); }} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full">1 min</button>
            <button onClick={() => { setHours(0); setMinutes(5); setSeconds(0); }} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full">5 min</button>
            <button onClick={() => { setHours(0); setMinutes(10); setSeconds(0); }} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full">10 min</button>
            <button onClick={() => { setHours(0); setMinutes(15); setSeconds(0); }} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full">15 min</button>
            <button onClick={() => { setHours(0); setMinutes(30); setSeconds(0); }} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full">30 min</button>
            <button onClick={() => { setHours(1); setMinutes(0); setSeconds(0); }} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full">1 hour</button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-7xl font-mono font-bold text-gray-800 mb-6">
            {formatTime(timeLeft)}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          {timeLeft === 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
              <p className="text-lg font-medium text-green-700">Timer Complete!</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <button onClick={start} className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Start</button>
        ) : (
          <>
            {!isPaused ? (
              <button onClick={pause} className="px-6 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors">Pause</button>
            ) : (
              <button onClick={resume} className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">Resume</button>
            )}
            <button onClick={reset} className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Reset</button>
          </>
        )}
      </div>
    </div>
  );
}
