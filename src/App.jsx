// import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage'
import UserProfile from './UserProfile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  )
}

export default App
