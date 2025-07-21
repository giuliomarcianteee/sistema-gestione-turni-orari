import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Components
import HomePage from './components/HomePage';
import NegozioDetailPage from './components/NegozioDetailPage';
import GrigliaOrariPage from './components/GrigliaOrariPage';
import ConfiguraTurniPage from './components/ConfiguraTurniPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/negozio/:codice" element={<NegozioDetailPage />} />
            <Route path="/negozi/:codiceNegozio/configura-turni" element={<ConfiguraTurniPage />} />
            <Route path="/griglia/:codice/:mese" element={<GrigliaOrariPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
