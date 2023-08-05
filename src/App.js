import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PiTyper from './PiTyper';
import HistoryOfPi from './HistoryOfPi';
import Leaderboard from './Leaderboard';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<PiTyper />} />
          <Route path="/history-of-pi" element={<HistoryOfPi />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
