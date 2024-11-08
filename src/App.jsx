// import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage'
import UserProfile from './UserProfile'
import RecipeDetails from './components/RecipeDetails'
import RecipeApp from './components/RecipeApp'
import RecipeGenerator from './components/RecipeGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/recipe-generator" element={<RecipeGenerator />} />
      </Routes>
    </Router>
  )
}

export default App
