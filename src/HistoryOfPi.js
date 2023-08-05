import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsSunFill } from 'react-icons/bs';
import { IoIosMoon } from 'react-icons/io';

const HistoryOfPi = () => {
  const [activeParagraph, setActiveParagraph] = useState(0);
  const [darkMode, setDarkMode] = useState(getInitialDarkModeState());

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

  const handleParagraphClick = (index) => {
    setActiveParagraph(index);
  };

  const paragraphGroups = [
    [
      "The first known uses of the mathematical constant we know today as Pi can be traced nearly 4000 years back to the Ancient Babylonian and Egyptian societies.",
      "The Babylonians, for instance, calculated the area of a given circle by taking 3 times the square of its radius, giving pi an approximate value of 3. This value, while incorrect in hindsight, was sufficient for the architectural projects of the time. One Babylonian tablet dated to around 1980-1680 BC indicates a value of 3.125 for Pi.",
      "The Rhind Papyrus, created in or around 1650 BC in Ancient Egypt, showed that the Egyptians calculated the area of a circle by a formula that gave the approximate value of 3.16 for Pi.",
      "In the 3rd century BC, Archimedes of Syracuse used a method called the method of exhaustion to approximate the value of pi. He inscribed and circumscribed polygons around a circle to estimate its circumference. By increasing the number of sides on the polygons, he narrowed down the range of possible values for pi. Archimedes concluded that pi lay between 3.1408 and 3.1429."
    ],
    [
      "Around 600 years later during the 3rd century AD in Ancient China, Liu Hui, a Chinese mathematician, developed a polygonal algorithm to approximate pi by inscribing and circumscribing polygons with many sides, much like Archimedes. His calculations, outlined in his book 'The Method of the Calculation of Pi,' yielded a value close to 3.14159. In the 5th century AD, Zu Chongzhi, another Chinese mathematician (in addition to being an astronomer, politician, inventor, and writer!), developed the Liu Hui-Zu Chongzhi algorithm which combined the polygonal algorithm of Liu Hui with a clever recursive approach. It involved inscribing and circumscribing polygons with a large number of sides, like Archimedes and Hui, and recursively improving the approximations. With this algorithm, Chongzhi computed Pi to between 3.1415926 and 3.1415927, an unprecedentedly accurate approximation. This approximation was so good, in fact, that it would not improve for over 900 years. Pi would remain at a standstill until the middle ages.",
      "During the 14th century BC, Madhava of Sangamagrama, an Indian mathematician, developed an infinite series expansion for the arc tangent function to approximate pi. He derived a series known as the Madhava-Leibniz series, which converges to pi/4. This calculation yielded an accurate approximation of pi correct to 11 decimal places. In the 1660s, Isaac Newton and Gottfried Wilhelm Leibniz discovered calculus, which led to the development of many infinite series for approximating pi. Newton, in specific, used the infinite series to calculate Pi to 15 digits. 40 years later in 1706, John Machin, a professor of astronomy at Gresham College, used Gregory’s series to reach 100 digits of pi. Things only picked up speed from here."
    ],
    [
      "In 1910, the Indian mathematician Srinivasa Ramanujan found several rapidly converging infinite series of pi. These series are now the basis for the fastest algorithms currently used to calculate pi.",
      "From the mid 20th century onwards, all calculations of pi have been done with the help of calculators and computers. In the early years of the computer, pi was computed to 100,000 decimal places by mathematician Daniel Shanks and his team at the United States Naval Research Laboratory in Washington, D.C. Then, in 1989, the Chudnovsky brothers computed pi to over 1 billion decimal places on the supercomputer IBM 3090 using a variation of Ramanujan's infinite series of pi. Every single record since then has used this modified algorithm, aptly named the Chudnovsky algorithm. As of 2023, pi has been calculated to 100 trillion digits."
    ]
  ];

  const paragraphStyle = {
    fontSize: '14px',
    maxWidth: '800px',
    margin: '20px auto',
  };

  const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px 0',
  };

  return (
    <div className="container">
      <h1>The History of Pi</h1>
      <div className="button-group">
        <button
          className={`paragraph-button ${activeParagraph === 0 ? 'active' : ''}`}
          onClick={() => handleParagraphClick(0)}
        >
          Ancient History
        </button>
        <button
          className={`paragraph-button ${activeParagraph === 1 ? 'active' : ''}`}
          onClick={() => handleParagraphClick(1)}
        >
          The Middle Ages
        </button>
        <button
          className={`paragraph-button ${activeParagraph === 2 ? 'active' : ''}`}
          onClick={() => handleParagraphClick(2)}
        >
          Modern Era
        </button>
      </div>
      <div className="paragraph-box">
        {paragraphGroups[activeParagraph]?.map((paragraph, index) => (
          <div key={index} className="paragraph-container" style={{ ...paragraphStyle, ...centerStyle }}>
            <p className="paragraph-text">{paragraph}</p>
          </div>
        ))}
      </div>
      <b><div className="navigation-links" style={centerStyle}>
        <Link to="/" className="active" style={{textDecoration: 'none'}}>PiTyper | </Link>
        <Link to="/Leaderboard" style={{textDecoration: 'none'}}>‎ leaderboard | </Link>
        <Link to="/github" className="active" style={{textDecoration: 'none'}}>‎ github</Link>
      </div></b>
      <div className="dark-mode-toggle" onClick={toggleDarkMode} style={{ ...centerStyle, marginTop: '.1px', fontSize: '24px' }}>
        {darkMode ? <IoIosMoon /> : <BsSunFill />}
      </div>
    </div>
  );
};

export default HistoryOfPi;