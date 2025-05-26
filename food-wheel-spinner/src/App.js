import React, { useState } from 'react';
import './App.css';

// Simple wheel component since react-spinning-wheel might not be available
const SimpleWheel = ({ items, onSpinComplete }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const spinAmount = Math.random() * 360 + 1800; // Random spin + multiple rotations
    const newRotation = rotation + spinAmount;
    setRotation(newRotation);
    
    setTimeout(() => {
      const segmentAngle = 360 / items.length;
      const normalizedRotation = newRotation % 360;
      const winnerIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % items.length;
      onSpinComplete(items[winnerIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  const segmentAngle = 360 / items.length;
  const radius = 150; // Half of 300px wheel

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg 
          width="300" 
          height="300" 
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
            border: '5px solid black',
            borderRadius: '50%'
          }}
        >
          {items.map((item, index) => {
            const startAngle = (index * segmentAngle - 90) * (Math.PI / 180); // -90 to start from top
            const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
            const midAngle = (startAngle + endAngle) / 2;
            
            const x1 = radius + radius * Math.cos(startAngle);
            const y1 = radius + radius * Math.sin(startAngle);
            const x2 = radius + radius * Math.cos(endAngle);
            const y2 = radius + radius * Math.sin(endAngle);
            
            const largeArcFlag = segmentAngle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${radius} ${radius}`, // Move to center
              `L ${x1} ${y1}`, // Line to start point
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc to end point
              'Z' // Close path
            ].join(' ');

            // Text position
            const textRadius = radius * 0.7; // Position text 70% from center
            const textX = radius + textRadius * Math.cos(midAngle);
            const textY = radius + textRadius * Math.sin(midAngle);

            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={item.style.backgroundColor}
                  stroke="#fff"
                  strokeWidth="1"
                />
                <text
                  x={textX}
                  y={textY}
                  fill={item.style.color}
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${index * segmentAngle}, ${textX}, ${textY})`}
                >
                  {item.option}
                </text>
              </g>
            );
          })}
        </svg>
        {/* Pointer */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderTop: '20px solid black',
          zIndex: 10
        }} />
      </div>
      <button 
        onClick={spin} 
        disabled={isSpinning}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isSpinning ? '#ccc' : '#ff0000',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isSpinning ? 'not-allowed' : 'pointer'
        }}
      >
        {isSpinning ? 'Spinning...' : 'SPIN!'}
      </button>
    </div>
  );
};

const DEFAULT_OPTIONS = [
  { option: 'Pizza', style: { backgroundColor: '#ff0000', color: '#f5f5f5' } },
  { option: 'Burger', style: { backgroundColor: '#f5f5f5', color: '#000000' } },
  { option: 'Sushi', style: { backgroundColor: '#ff0000', color: '#f5f5f5' } },
  { option: 'Tacos', style: { backgroundColor: '#f5f5f5', color: '#000000' } },
  { option: 'Pasta', style: { backgroundColor: '#ff0000', color: '#f5f5f5' } },
  { option: 'Salad', style: { backgroundColor: '#f5f5f5', color: '#000000' } },
  { option: 'Chicken', style: { backgroundColor: '#ff0000', color: '#f5f5f5' } },
  { option: 'Fish', style: { backgroundColor: '#f5f5f5', color: '#000000' } },
  { option: 'Steak', style: { backgroundColor: '#ff0000', color: '#f5f5f5' } },
  { option: 'Soup', style: { backgroundColor: '#f5f5f5', color: '#000000' } },
  { option: 'Sandwich', style: { backgroundColor: '#ff0000', color: '#f5f5f5' } },
  { option: 'Rice Bowl', style: { backgroundColor: '#f5f5f5', color: '#000000' } },
];

function App() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSpinComplete = (winner) => {
    setSelectedOption(winner.option);
  };

  const handleAddOption = (e) => {
    e.preventDefault();
    const newOption = e.target.option.value.trim();
    if (newOption && !options.some(opt => opt.option === newOption)) {
      const newStyle = options.length % 2 === 0 
        ? { backgroundColor: '#ff0000', color: '#f5f5f5' }
        : { backgroundColor: '#f5f5f5', color: '#000000' };
      setOptions([...options, { option: newOption, style: newStyle }]);
    }
    e.target.reset();
  };

  const handleRemoveOption = (optionToRemove) => {
    if (options.length > 1) { // Prevent removing all options
      setOptions(options.filter(option => option.option !== optionToRemove));
      if (selectedOption === optionToRemove) {
        setSelectedOption(null);
      }
    }
  };

  const handleReset = () => {
    setOptions(DEFAULT_OPTIONS);
    setSelectedOption(null);
  };

  return (
    <div className="app">
      <div className="wheel-section">
        <h2>Food Decision Wheel</h2>
        <SimpleWheel items={options} onSpinComplete={handleSpinComplete} />
        <button onClick={handleReset} className="reset-button">Reset</button>
        {selectedOption && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
            <h3>🎉 Winner: {selectedOption}!</h3>
          </div>
        )}
      </div>
      <div className="options-section">
        <h2>Food Options ({options.length})</h2>
        <ul>
          {options.map((option) => (
            <li key={option.option}>
              {option.option}
              {options.length > 1 && (
                <button
                  onClick={() => handleRemoveOption(option.option)}
                  className="remove-button"
                >
                  X
                </button>
              )}
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddOption}>
          <input 
            type="text" 
            name="option" 
            placeholder="Enter a food" 
            maxLength="30" 
            className="add-input" 
            required
          />
          <button type="submit" className="add-button">Add</button>
        </form>
      </div>
    </div>
  );
}

export default App;