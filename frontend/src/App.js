import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Home from './pages/Home';
import CreateGroup from './pages/createGroup';
import Expense from './pages/Expense';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import SettleUp from './pages/SettleUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/creategroup" element={<CreateGroup/>}/>
        <Route path="/expense" element={<Expense/>}/>
        <Route path="/reports" element={<Reports/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/groups" element={<Groups/>}/>
        <Route path="/groupdetails/:groupId" element={<GroupDetails/>}/>
        <Route path="/settleup" element={<SettleUp/>}/>
      </Routes>
    </Router>
  );
}

export default App;