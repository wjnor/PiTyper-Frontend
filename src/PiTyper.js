import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { BsSunFill } from 'react-icons/bs';
import { IoIosMoon } from 'react-icons/io';
import Modal from 'react-modal';
import './App.css';
import { piValue } from './pi';
import HistoryOfPi from './HistoryOfPi';
import Leaderboard from './Leaderboard';
import axios from 'axios';

// axios.defaults.baseURL = 'https://pityper-backend-5d98e8be79da.herokuapp.com:3000';

const PiTyper = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [inputVisible, setInputVisible] = useState(true);
  const [timerVisible, setTimerVisible] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(null);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [inputStarted, setInputStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [darkMode, setDarkMode] = useState(getInitialDarkModeState());
  const [correctDigits, setCorrectDigits] = useState(0);
  const [showTextInput, setShowTextInput] = useState(false);
  const [username, setUsername] = useState('');
  const [score, setScore] = useState(0);

  const numberInputRef = useRef(null);
  const timerElementRef = useRef(null);
  const displayElementRef = useRef(null);
  const buttonsRef = useRef([]);

  function getInitialDarkModeState() {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    buttonsRef.current.forEach((button) => {
      button.addEventListener('click', () => handleButtonClick(button.textContent));
    });
  }, []);

  const handleButtonClick = (difficulty) => {
    setInputStarted(false);
    setSecondsRemaining(getTimeForDifficulty(difficulty));
    numberInputRef.current.value = '';

    setSelectedDifficulty(difficulty);
    setErrorMessage('');
  };

  const getTimeForDifficulty = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 45;
      case 'medium':
        return 30;
      case 'hard':
        return 15;
      default:
        return 60;
    }
  };

  const startTimer = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    const countdown = () => {
      setSecondsRemaining((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
    };

    setCountdownInterval(setInterval(countdown, 1000));

    buttonsRef.current.forEach((button) => {
      button.disabled = true;
    });
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value.trim();
    if (selectedDifficulty && !inputStarted && inputValue) {
      setInputStarted(true);
      startTimer();
    }

    let correctCount = 0;
    const userInputDigits = inputValue.split('');
    for (let i = 0; i < userInputDigits.length; i++) {
      if (userInputDigits[i] === piValue[i]) {
        correctCount++;
      }
    }
    setCorrectDigits(correctCount);
  };

  useEffect(() => {
    if (numberInputRef.current) {
      numberInputRef.current.addEventListener('paste', (e) => {
        e.preventDefault();
      });
    }
  }, []);

  useEffect(() => {
    if (secondsRemaining === 0) {
      const inputNumber = numberInputRef.current.value.trim();
      setShowPopup(true);
    }
  }, [secondsRemaining]);

  const handlePopupClose = () => {
    setShowPopup(false);
    if (correctDigits > 0) {
      submitScoreToLeaderboard();
    }
    window.location.reload();
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value.trim());
  };

  const submitScoreToLeaderboard = () => {
    if (username.length === 3) {
      const difficulty = selectedDifficulty.toLowerCase();
      axios
        .post('https://pityper-backend-5d98e8be79da.herokuapp.com/api/leaderboard', { username, correctDigits, difficulty })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error submitting score:', error);
        });
    } else {
      console.error('Invalid username:', username);
    }
  };

  const handleScoreSubmit = () => {
    if (username.length === 3) {
      setScore(correctDigits);
      handlePopupClose();
    } else {
      alert('Username must be exactly 3 characters long.');
    }
  };

  return (
    <div>
      <h1>PiTyper</h1>
      <div className={`button-group ${darkMode ? 'dark-mode' : ''}`}>
        {['easy', 'medium', 'hard'].map((difficulty) => (
          <button
            key={difficulty}
            className={`button ${difficulty}${selectedDifficulty === difficulty ? ' clicked' : ''}`}
            onClick={() => handleButtonClick(difficulty)}
            ref={(el) => (buttonsRef.current[difficulty] = el)}
            disabled={selectedDifficulty === difficulty || inputStarted}
          >
            {difficulty}
          </button>
        ))}
      </div>
      <div className={`textbox-container ${darkMode ? 'dark-mode' : ''}`} style={{ display: inputVisible ? 'flex' : 'none' }}>
        <div>
          <input
            type="number"
            id="numberInput"
            className="number-input"
            ref={numberInputRef}
            onChange={handleInputChange}
            onPaste={(e) => e.preventDefault()}
          />
        </div>
        {timerVisible && (
          <div className={`timer-container ${darkMode ? 'dark-mode' : ''}`}>
            <span className={`timer ${darkMode ? 'dark-mode' : ''}`} ref={timerElementRef}>
              {secondsRemaining >= 0 ? secondsRemaining : 0}
            </span>
          </div>
        )}
      </div>
      {errorMessage && <p className={`error-message ${darkMode ? 'dark-mode' : ''}`}>{errorMessage}</p>}
      <p>
        <span id="displayNumber" ref={displayElementRef}></span>
      </p>
      <p>
        <b>
          <Link to="/history-of-pi" className="history-of-pi" style={{ textDecoration: 'none' }}>
            history of pi |
          </Link>
        </b>
        <b>
          <Link to="/leaderboard" className="leaderboard" style={{ textDecoration: 'none' }}>
            {' '}
            leaderboard
          </Link>{' '}
          | <a href="https://github.com/wjnor/PiTyper-Frontend/tree/main" className='github' style={{ textDecoration: 'none' }}>github</a>
        </b>
      </p>
      <Modal isOpen={showPopup} onRequestClose={handlePopupClose} className={`modal ${darkMode ? 'dark-mode' : ''}`} overlayClassName="overlay">
        <div>
          <button onClick={handlePopupClose} className={`modal-close ${darkMode ? 'dark-mode' : ''}`} style={{ background: 'transparent', position: 'absolute', top: '10px', right: '10px' }}>
            <span className={`close-icon ${darkMode ? 'dark-mode' : ''}`} style={{ background: 'transparent' }}>
              ✕
            </span>
          </button>
          {!showTextInput ? (
            <div>
              <h2>Correct Digits: {correctDigits}</h2>
              <h2 style={{ fontSize: '20px' }}>Pi vs. (Your Digits):</h2>
              <p>
                {piValue.slice(0, numberInputRef.current?.value.length).split('').map((piDigit, index) => (
                  <span key={piDigit}>
                    {piDigit} ({numberInputRef.current?.value.charAt(index) || ' '})
                    <br />
                  </span>
                ))}
              </p>
              <div>
                <h2 style={{ marginBottom: '2px' }}>
                  <center>Enter Your Username:</center>
                </h2>
                <center>
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    maxLength={3}
                    className={`username-input ${darkMode ? 'dark-mode' : ''}`}
                  />
                  <br />
                  <button onClick={handleScoreSubmit} className={`button submit ${darkMode ? 'dark-mode' : ''}`} style={{ fontSize: '15px', marginTop: '13px', padding: '7px' }}>
                    Submit Score
                  </button>
                </center>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
      <button
        onClick={toggleDarkMode}
        className={`dark-mode-toggle ${darkMode ? 'dark-mode' : ''}`}
        style={{ border: 'none', backgroundColor: darkMode ? '#222' : 'white', marginLeft: '200.5px', fontSize: '24px' }}
      >
        {darkMode ? <IoIosMoon /> : <BsSunFill />}
      </button>
    </div>
  );
};

export default PiTyper;
