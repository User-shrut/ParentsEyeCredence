import React from 'react';

const ProgressBar = ({ progress }) => (
  <div style={{ width: '100%', background: '#ccc' }}>
    <div style={{ width: `${progress}%`, background: 'blue', height: '10px' }} />
  </div>
);

export default ProgressBar;
