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
  { option: 'Pizza', category: 'American', distance: 5, style: { backgroundColor: '#ff0000', color: '#f5f5f5' } },
  { option: 'Burger', category: 'American', distance: 3, style: { backgroundColor: '#f5f5f5', color: '#000000' } },
  { option: 'Sushi', category: 'Asian', distance: 8, style: { backgroundColor: '#ff0000', color: '#f5f5f5' } },
  { option: 'Tacos', category: 'Mexican', distance: 4, style: { backgroundColor: '#f5f5f5', color: '#000000' } },
  { option: 'Pasta', category: 'Mediterranean', distance: 6, style: { backgroundColor: '#ff0000', color: '#f5f5f5' } },
  { option: 'Salad', category: 'Office Favourites', distance: 2, style: { backgroundColor: '#f5f5f5', color: '#000000' } },
  { option: 'Chicken', category: 'Office Favourites', distance: 3, style: { backgroundColor: '#ff0000', color: '#f5f5f5' } },
  { option: 'Fish', category: 'Mediterranean', distance: 7, style: { backgroundColor: '#f5f5f5', color: '#000000' } },
  { option: 'Steak', category: 'American', distance: 10, style: { backgroundColor: '#ff0000', color: '#f5f5f5' } },
  { option: 'Soup', category: 'Office Favourites', distance: 1, style: { backgroundColor: '#f5f5f5', color: '#000000' } },
  { option: 'Sandwich', category: 'Office Favourites', distance: 2, style: { backgroundColor: '#ff0000', color: '#f5f5f5' } },
  { option: 'Rice Bowl', category: 'Asian', distance: 5, style: { backgroundColor: '#f5f5f5', color: '#000000' } },
];

const CATEGORIES = ['All', 'American', 'Asian', 'Mediterranean', 'Mexican', 'Office Favourites'];

const DISTANCE_OPTIONS = [
  { value: 'all', label: 'Any distance' },
  { value: 5, label: '5 min walk (400m)' },
  { value: 10, label: '10 min walk (800m)' },
  { value: 20, label: '20 min walk (650m)' },
  { value: 30, label: '30 min walk (800m)' },
  { value: 60, label: '60 min walk (1.2km)' },
];

function App() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxDistance, setMaxDistance] = useState('all');
  const [excludedOptions, setExcludedOptions] = useState(new Set());
  const [joinedMembers, setJoinedMembers] = useState([]);

  // Filter options based on category, distance, and exclusions
  const getFilteredOptions = () => {
    let filtered = options;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(option => option.category === selectedCategory);
    }
    
    if (maxDistance !== 'all') {
      filtered = filtered.filter(option => option.distance <= maxDistance);
    }
    
    // Remove excluded options
    filtered = filtered.filter(option => !excludedOptions.has(option.option));
    
    return filtered;
  };

  const handleSpinComplete = (winner) => {
    setSelectedOption(winner.option);
  };

  const handleAddOption = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newOption = formData.get('option').trim();
    const newCategory = formData.get('category');
    const newDistance = parseInt(formData.get('distance'));
    
    if (newOption && !options.some(opt => opt.option === newOption)) {
      const newStyle = options.length % 2 === 0 
        ? { backgroundColor: '#ff0000', color: '#f5f5f5' }
        : { backgroundColor: '#f5f5f5', color: '#000000' };
      setOptions([...options, { option: newOption, category: newCategory, distance: newDistance, style: newStyle }]);
    }
    e.target.reset();
  };

  const handleRemoveOption = (optionToRemove) => {
    if (options.length > 1) {
      setOptions(options.filter(option => option.option !== optionToRemove));
      setExcludedOptions(prev => {
        const newSet = new Set(prev);
        newSet.delete(optionToRemove);
        return newSet;
      });
      if (selectedOption === optionToRemove) {
        setSelectedOption(null);
      }
    }
  };

  const handleToggleExclude = (optionName) => {
    setExcludedOptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(optionName)) {
        newSet.delete(optionName);
      } else {
        newSet.add(optionName);
      }
      return newSet;
    });
    
    // Clear selection if it was the excluded option
    if (selectedOption === optionName) {
      setSelectedOption(null);
    }
  };

  const handleReset = () => {
    setOptions(DEFAULT_OPTIONS);
    setSelectedOption(null);
    setExcludedOptions(new Set());
    setSelectedCategory('All');
    setMaxDistance('all');
  };

  const handleJoinLunch = () => {
    const name = prompt("Enter your name to join lunch:");
    if (name && name.trim() && !joinedMembers.includes(name.trim())) {
      setJoinedMembers([...joinedMembers, name.trim()]);
    }
  };

  const filteredOptions = getFilteredOptions();

  return (
    <div className="app">
      <div className="wheel-section">
        <h2>Food Decision Wheel</h2>
        
        {/* Filters */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label htmlFor="categoryFilter" style={{ marginRight: '10px', fontWeight: 'bold' }}>
              Category:
            </label>
            <select 
              id="categoryFilter"
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="distanceFilter" style={{ marginRight: '10px', fontWeight: 'bold' }}>
              Max walk:
            </label>
            <select 
              id="distanceFilter"
              value={maxDistance} 
              onChange={(e) => setMaxDistance(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
            >
              {DISTANCE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredOptions.length > 0 ? (
          <SimpleWheel items={filteredOptions} onSpinComplete={handleSpinComplete} />
        ) : (
          <div style={{ 
            width: '300px', 
            height: '300px', 
            border: '5px solid black', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto',
            backgroundColor: '#f0f0f0',
            color: '#666'
          }}>
            No options available<br/>for this filter
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <button onClick={handleReset} className="reset-button" style={{ marginRight: '10px' }}>
            Reset All
          </button>
          <button 
            onClick={handleJoinLunch} 
            style={{
              padding: '8px 15px',
              border: 'none',
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Join Lunch
          </button>
        </div>

        {selectedOption && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
            <h3>🎉 Winner: {selectedOption}!</h3>
          </div>
        )}

        {joinedMembers.length > 0 && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
            <h4>Lunch Members ({joinedMembers.length}):</h4>
            <p>{joinedMembers.join(', ')}</p>
          </div>
        )}
      </div>
      
      <div className="options-section">
        <h2>Food Options ({options.length})</h2>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
          Showing: {selectedCategory} • {maxDistance === 'all' ? 'Any distance' : `≤${maxDistance} min walk`} ({filteredOptions.length} available)
        </p>
        
        <ul>
          {options.map((option) => {
            const isExcluded = excludedOptions.has(option.option);
            const isInCurrentFilter = (selectedCategory === 'All' || option.category === selectedCategory) &&
                                    (maxDistance === 'all' || option.distance <= maxDistance);
            
            return (
              <li key={option.option} style={{ 
                opacity: isExcluded ? 0.5 : 1,
                backgroundColor: isExcluded ? '#ffebee' : (isInCurrentFilter ? '#f5f5f5' : '#f9f9f9')
              }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <span style={{ flex: 1 }}>
                    {option.option}
                    <small style={{ color: '#666', marginLeft: '10px' }}>
                      ({option.category} • {option.distance} min walk)
                    </small>
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => handleToggleExclude(option.option)}
                    style={{
                      padding: '4px 8px',
                      border: 'none',
                      backgroundColor: isExcluded ? '#4caf50' : '#ff9800',
                      color: 'white',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginRight: '5px'
                    }}
                    title={isExcluded ? "Include this option" : "Don't want this option"}
                  >
                    {isExcluded ? '✓' : '✗'}
                  </button>
                  {options.length > 1 && (
                    <button
                      onClick={() => handleRemoveOption(option.option)}
                      className="remove-button"
                    >
                      X
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        
        <form onSubmit={handleAddOption}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              name="option" 
              placeholder="Enter a food" 
              maxLength="30" 
              className="add-input" 
              required
              style={{ flex: 1, minWidth: '150px' }}
            />
            <select 
              name="category" 
              required
              style={{ padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }}
            >
              {CATEGORIES.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select 
              name="distance" 
              required
              style={{ padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }}
            >
              <option value="5">5 min</option>
              <option value="10">10 min</option>
              <option value="20">20 min</option>
              <option value="30">30 min</option>
              <option value="60">60 min</option>
            </select>
          </div>
          <button type="submit" className="add-button">Add Option</button>
        </form>
      </div>
    </div>
  );
}

export default App;