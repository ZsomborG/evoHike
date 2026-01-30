import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import RoutePage from './pages/RoutePage';
import Weather from './pages/Weather';
import JournalPage from './pages/JournalPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/routeplan" element={<RoutePage />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/routeplan" element={<div>Tervezés oldal</div>} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/social" element={<div>Közösség oldal</div>} />
      <Route path="/contact" element={<div>Kapcsolat oldal</div>} />
    </Routes>
  );
}

export default App;
