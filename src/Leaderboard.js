import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsSunFill } from 'react-icons/bs';
import { IoIosMoon } from 'react-icons/io';
import { useTable } from 'react-table';
import axios from 'axios';

const Leaderboard = () => {
  const [darkMode, setDarkMode] = useState(getInitialDarkModeState());
  const [difficulty, setDifficulty] = useState('');

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

  const fetchLeaderboardData = async (difficulty) => {
    try {
      const response = await axios.get(`https://pityper-backend-5d98e8be79da.herokuapp.com/api/leaderboard/${difficulty}`);
      const leaderboardData = response.data;
      setData(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  useEffect(() => {
    if (difficulty) {
      fetchLeaderboardData(difficulty);
    }
  }, [difficulty]);

  const [data, setData] = useState([]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'username',
        headerClassName: darkMode ? 'dark-header' : 'light-header',
      },
      {
        Header: 'Digits Typed',
        accessor: 'digits_typed',
        headerClassName: darkMode ? 'dark-header' : 'light-header',
      },
    ],
    [darkMode]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div>
      <h1 align='center' style={{ marginBottom: '30px' }}>Leaderboard</h1>
      <div className="leaderboard-difficulty-buttons" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button className='button easy' onClick={() => setDifficulty('easy')}>easy</button>
        <button className='button medium' onClick={() => setDifficulty('medium')}>medium</button>
        <button className='button hard' onClick={() => setDifficulty('hard')}>hard</button>
      </div>
      <div className="leaderboard-table">
        <table {...getTableProps()} style={{ borderCollapse: 'collapse', border: '1px solid black', width: '100%', backgroundColor: 'transparent' }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} style={{ background: 'aliceblue', color: 'black', fontWeight: 'bold' }}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} style={{ borderBottom: 'solid 3px red', padding: '8px', border: '1px solid black', background: darkMode ? 'transparent' : 'black', color: darkMode ? 'black' : 'white' }}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} style={{ background: 'transparent' }}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} style={{ padding: '8px', border: '1px solid black', background: 'transparent' }}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <b><div className="navigation-links" style={{marginTop: "20px"}}>
        <Link to="/" className="active" style={{ textDecoration: 'none' }}>
          PiTyper |
        </Link>
        <Link to="/history-of-pi" style={{ textDecoration: 'none' }}>
        ‎ history of pi |‎
        </Link>
          <a href="https://github.com/wjnor/PiTyper-Frontend/tree/main" className='github' style={{ textDecoration: 'none' }}>‎ github</a>
      </div></b>
      <div className="dark-mode-toggle" onClick={toggleDarkMode} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', fontSize: '24px' }}>
        {darkMode ? <IoIosMoon /> : <BsSunFill />}
      </div>
    </div>
  );
};

export default Leaderboard;
