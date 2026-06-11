import { StrictMode } from 'react';
import './App.css'
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/Router';

function App() {

  return (
   <StrictMode>
    <BrowserRouter>
    <Router/>
    </BrowserRouter>
   </StrictMode>

  )
}

export default App
