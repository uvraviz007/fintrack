import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Home from './pages/Home';
import CreateGroup from './pages/createGroup';
import Expense from './pages/Expense';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createGroup" element={<CreateGroup/>}/>
        <Route path="/expense" element={<Expense/>}/>
      </Routes>
    </Router>
  );
}

export default App;