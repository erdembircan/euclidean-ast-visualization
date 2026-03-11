import { useState, useEffect, useRef, useCallback } from 'react';
import { executeAlgorithm } from '../data/executor';

const SPEEDS = { slow: 2000, normal: 1000, fast: 400 };

export default function ExecutionPanel({ onStepChange }) {
  const [inputA, setInputA] = useState(12);
  const [inputB, setInputB] = useState(8);
  const [steps, setSteps] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState('normal');
  const intervalRef = useRef(null);

  const currentStep = steps ? steps[stepIndex] : null;

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    clearInterval_();
  }, [clearInterval_]);

  const play = useCallback(() => {
    if (!steps) {
      const a = Math.max(1, Math.floor(inputA));
      const b = Math.max(1, Math.floor(inputB));
      setSteps(executeAlgorithm(a, b));
      setStepIndex(0);
    }
    setIsPlaying(true);
  }, [steps, inputA, inputB]);

  const reset = useCallback(() => {
    stop();
    setSteps(null);
    setStepIndex(0);
    onStepChange(null);
  }, [stop, onStepChange]);

  const stepForward = useCallback(() => {
    if (steps && stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    }
  }, [steps, stepIndex]);

  const stepBackward = useCallback(() => {
    if (steps && stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  }, [steps, stepIndex]);

  // Auto-play
  useEffect(() => {
    clearInterval_();
    if (isPlaying && steps) {
      intervalRef.current = setInterval(() => {
        setStepIndex((i) => {
          if (i >= steps.length - 1) {
            setIsPlaying(false);
            return i;
          }
          return i + 1;
        });
      }, SPEEDS[speed]);
    }
    return clearInterval_;
  }, [isPlaying, steps, speed, clearInterval_]);

  // Notify parent
  useEffect(() => {
    onStepChange(currentStep || null);
  }, [currentStep, onStepChange]);

  const progress = steps ? ((stepIndex + 1) / steps.length) * 100 : 0;

  return (
    <div className="execution-panel">
      <h3 className="exec-title">Execution</h3>

      {!steps ? (
        <div className="exec-setup">
          <div className="exec-input-group">
            <label className="exec-label">
              <span>a</span>
              <input
                type="number"
                value={inputA}
                onChange={(e) => setInputA(Number(e.target.value))}
                min={1}
                className="exec-input"
              />
            </label>
            <label className="exec-label">
              <span>b</span>
              <input
                type="number"
                value={inputB}
                onChange={(e) => setInputB(Number(e.target.value))}
                min={1}
                className="exec-input"
              />
            </label>
          </div>
          <button onClick={play} className="exec-play-btn">
            Play
          </button>
        </div>
      ) : (
        <div className="exec-running">
          <div className="exec-values">
            <div className="exec-var">
              <span className="exec-var-label">a</span>
              <span className="exec-var-value">{currentStep?.a}</span>
            </div>
            <div className="exec-var">
              <span className="exec-var-label">b</span>
              <span className="exec-var-value">{currentStep?.b}</span>
            </div>
          </div>

          <div className="exec-desc">{currentStep?.desc}</div>

          <div className="exec-progress-wrap">
            <div className="exec-progress-bar">
              <div
                className="exec-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="exec-step-count">
              {stepIndex + 1} / {steps.length}
            </span>
          </div>

          <div className="exec-controls">
            <button
              onClick={stepBackward}
              disabled={stepIndex === 0}
              className="exec-ctrl-btn"
            >
              &#9198;
            </button>
            <button
              onClick={isPlaying ? stop : play}
              className="exec-ctrl-btn exec-ctrl-play"
            >
              {isPlaying ? '\u23F8' : '\u25B6'}
            </button>
            <button
              onClick={stepForward}
              disabled={stepIndex >= steps.length - 1}
              className="exec-ctrl-btn"
            >
              &#9197;
            </button>
            <button onClick={reset} className="exec-ctrl-btn exec-reset">
              Reset
            </button>
          </div>

          <div className="exec-speed">
            {['slow', 'normal', 'fast'].map((s) => (
              <button
                key={s}
                className={`speed-btn${speed === s ? ' active' : ''}`}
                onClick={() => setSpeed(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
