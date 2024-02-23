import React, { useState, useEffect } from 'react';
import './styles.css'; // Import the CSS file

const buttonPositions = [
  ['Cider', 'Seafood Casserole', 'Modern Art', 'Each Other'],
  ['New Nanny', 'Family Business', 'Anonymous Blogger', 'New Money'],
  ['Coat', 'Locket', 'Sweater', 'Book'],
  ['Selfie', 'Aerial Shot', 'Shrimp', 'Shadow']
];

const buttonsByArray = [
  ['Shadow', 'Selfie', 'Shrimp', 'Aerial Shot'],
  ['Modern Art', 'Seafood Casserole', 'Cider', 'Each Other'],
  ['Anonymous Blogger', 'New Nanny', 'Family Business', 'New Money'],
  ['Sweater', 'Book', 'Locket', 'Coat'],
];

const arrayColors = ['maroon', 'green', 'navy', 'purple'];
const arrayNames = ['Lock screens of each other', 'Things we enjoyed on dates', 'Synopsis of shows we watched', 'Gifts to each other'];

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const App = () => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [checkButtonEnabled, setCheckButtonEnabled] = useState(false);
  const [matchedArrays, setMatchedArrays] = useState(new Set());
  const [shouldShake, setShouldShake] = useState(false);
  const [lastMatchedArray, setLastMatchedArray] = useState(null);
  const [shuffledButtons, setShuffledButtons] = useState([]);

  useEffect(() => {
    setCheckButtonEnabled(selectedItems.size === 4);
  }, [selectedItems]);

  useEffect(() => {
    if (shouldShake) {
      const timer = setTimeout(() => setShouldShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shouldShake]);

  useEffect(() => {
    setShuffledButtons(shuffleArray(buttonsByArray.flat()));
  }, [buttonsByArray]);

  const handleButtonClick = (item) => {
    if (selectedItems.has(item)) {
      const updatedSelectedItems = new Set(selectedItems);
      updatedSelectedItems.delete(item);
      setSelectedItems(updatedSelectedItems);
    } else if (selectedItems.size < 4) {
      setSelectedItems(new Set(selectedItems).add(item));
    }
  };

  const isItemSelected = (item) => {
    return selectedItems.has(item);
  };

  const handleCheckButtonClick = () => {
    const selectedArray = buttonsByArray.find(array => {
      return [...selectedItems].every(item => array.includes(item));
    });

    if (selectedArray) {
      console.log('All selected items belong to the same array:', selectedArray);
      const matchedIndex = buttonsByArray.findIndex(array => array === selectedArray);
      setMatchedArrays(new Set([...matchedArrays, matchedIndex]));
      setLastMatchedArray(matchedIndex); // Store last matched array
      setSelectedItems(new Set());
      setShouldShake(false);
    } else {
      console.log('Selected items do not belong to the same array');
      setShouldShake(true);
    }
  };

  return (
    <div>
      <div className="heading-wrapper"><h1>♥ Connections ♥</h1></div>
      {lastMatchedArray !== null && (
        <div className="subheading" style={{ color: arrayColors[lastMatchedArray] }}>
          {arrayNames[lastMatchedArray]}
        </div>
      )}
      <div className={`grid-container ${shouldShake ? 'shake-animation' : ''}`}>
        {shuffledButtons.map((item, index) => {
          const arrayIndex = buttonsByArray.findIndex(array => array.includes(item));
          const isMatched = matchedArrays.has(arrayIndex);
          return (
            <button
              key={index}
              className={`${isItemSelected(item) ? 'selected' : ''} ${isMatched ? 'matched' : ''}`}
              style={{
                backgroundColor: isMatched ? arrayColors[arrayIndex] : null,
              }}
              onClick={() => handleButtonClick(item)}
              disabled={isMatched}
            >
              {item}
            </button>
          );
        })}
      </div>
      <div className="check-button-container">
        <button
          className="check-button"
          disabled={!checkButtonEnabled}
          onClick={handleCheckButtonClick}
        >
          Check
        </button>
      </div>
    </div>
  );
};

export default App;
