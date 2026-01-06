import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import RoutePage from './pages/RoutePage';

function App() {

  return (
    <Routes>
       <Route path="/" element={<HomePage/>}/>
       <Route path="/routeplan" element={<RoutePage/>}/>
    </Routes>
  );
}
export default App;
