import React, { useState } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';

const Profile = () => {
  const [name, setName] = useState('');
  const [diet, setDiet] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [newAllergy, setNewAllergy] = useState('');
  const navigate = useNavigate();

  const handleAddAllergy = () => {
    if (newAllergy.trim() !== '') {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (index) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const savedRecipes = [
    { name: 'Pasta Carbonara', image: '/api/placeholder/50/50' },
    { name: 'Cucumber Salad', image: '/api/placeholder/50/50' },
    { name: 'Chicken Salad', image: '/api/placeholder/50/50' },
    { name: 'Grilled Vegetables', image: '/api/placeholder/50/50' },
    { name: 'Salmon Dish', image: '/api/placeholder/50/50' },
    { name: 'Noodle Soup', image: '/api/placeholder/50/50' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6 flex justify-center">
              <img src="/api/placeholder/150/150" alt="Profile" className="rounded-full" />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diet</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select diet</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="omnivore">Omnivore</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favourite Cuisine</label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select cuisine</option>
                  <option value="italian">Italian</option>
                  <option value="japanese">Japanese</option>
                  <option value="mexican">Mexican</option>
                  <option value="indian">Indian</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add allergy"
                  />
                  <button
                    onClick={handleAddAllergy}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
                      <span>{allergy}</span>
                      <X
                        className="h-5 w-5 text-gray-500 cursor-pointer"
                        onClick={() => handleRemoveAllergy(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Saved Recipes</h3>
            <div className="space-y-4">
              {savedRecipes.map((recipe, index) => (
                <div key={index} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md">
                  <img src={recipe.image} alt={recipe.name} className="w-12 h-12 rounded-md" />
                  <span className="flex-grow">{recipe.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Select recipe</option>
                {savedRecipes.map((recipe, index) => (
                  <option key={index} value={recipe.name}>{recipe.name}</option>
                ))}
              </select>
            </div>
            <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Download selected recipes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
