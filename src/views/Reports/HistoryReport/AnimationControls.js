import React from 'react';

const AnimationControls = ({ playing, onPlayPause, onForward, onBackward, setSpeed }) => (
  <div>
    <button onClick={onPlayPause}>{playing ? 'Pause' : 'Play'}</button>
    <button onClick={onBackward}>-10s</button>
    <button onClick={onForward}>+10s</button>
    <label>
      Speed:
      <select onChange={(e) => setSpeed(Number(e.target.value))}>
        <option value={1}>1x</option>
        <option value={2}>2x</option>
        <option value={3}>3x</option>
      </select>
    </label>
  </div>
);

export default AnimationControls;
