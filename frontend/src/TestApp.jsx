import React from 'react';

const TestApp = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Test App is Working!</h1>
      <p>If you can see this, React is mounting correctly.</p>
      <div style={{ 
        width: '100px', 
        height: '100px', 
        backgroundColor: '#4f46e5', 
        margin: '20px auto',
        borderRadius: '8px'
      }}></div>
    </div>
  );
};

export default TestApp;
