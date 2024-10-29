import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import Read from './pages/Read';
import Latest from './pages/Latest';
import Summary from './pages/Summary';
import AboutUs from './pages/AboutUs';
import Art from './pages/Art';
import Commerce from './pages/Commerce';
import Science from './pages/Science';
import Login from './pages/login';
import SignUp from './pages/signup';
import { ThemeProvider } from './ThemeContext'; // Import the ThemeProvider

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/read" element={<Read />} />
            <Route path="/latest" element={<Latest />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/art" element={<Art />} />
            <Route path="/commerce" element={<Commerce />} />
            <Route path="/science" element={<Science />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
