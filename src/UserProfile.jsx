import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import Header from './components/Header';
import { Dialog, DialogPanel } from '@headlessui/react';
import RecipeDetails from './components/RecipeDetails';

const Profile = () => {

  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [showRecipe, setShowRecipe] = useState(false);

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [diet, setDiet] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [birthday, setBirthday] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [newAllergy, setNewAllergy] = useState('');
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // We use hard coded user id 1 for now
        const response = await axios.get(`http://localhost:8080/api/users/1`);
        const { data } = response;

        // Populate profile data from the response
        setName(data.name);
        setDiet(data.diet);
        setCuisine(data.favouriteCuisine);
        setAllergies(data.allergies);
        setBirthday(data.birthday);
        setSavedRecipes(data.savedRecipes);
        
        console.log(response.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    // Submit data to the server to update user profile
    const response = await axios.put(`http://localhost:8080/api/users/1`, {
      name,
      diet,
      favouriteCuisine: cuisine,
      allergies,
      birthday,
      savedRecipes: savedRecipes,
    });

    console.log(response)
  };

  useEffect(() => {
    if (name === '' && diet === '' && cuisine === '' && birthday === '') {
      return;
    }
    handleSubmit();
  }, [name, diet, cuisine, allergies, birthday]);

  const handleAddAllergy = () => {
    if (newAllergy.trim() !== '') {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (index) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      {loading && (
        <div className="mt-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading user...</p>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white shadow rounded-lg p-6 col-span-2">
            <h3 className="text-xl font-semibold mb-8">Personal details</h3>

            <img src="/assets/profile-placeholder.png" alt="Profile picture" className="rounded-full w-[150px] h-[150px] bg-gray-200 mb-10" />

            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">                
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diet</label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select diet</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Pescatarian">Pescatarian</option>
                    <option value="Omnivore">Omnivore</option>
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
                    <option value="Italian">Italian</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Indian">Indian</option>
                  </select>
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
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Saved recipes</h3>
            <div className="space-y-4">
              {savedRecipes.map((recipe, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedRecipeId(recipe.id);
                    setShowRecipe(true);
                  }}
                  className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md cursor-pointer"
                >
                  <span className="flex-grow">{recipe.name}</span>
                </div>
              ))}
            </div>
            {/* 
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
            */}
          </div>
        </div>

        {/* Recipe dialog / modal window */}
        <Dialog open={showRecipe} onClose={() => setShowRecipe(false)} className="relative z-100">
          <div className="fixed inset-0 flex w-screen items-center justify-center py-8 bg-slate-500 bg-opacity-40">
            <DialogPanel className="min-w-2xl max-h-[90vh] overflow-y-auto border rounded-lg shadow-lg bg-white px-16 py-12">
              <RecipeDetails id={selectedRecipeId} setShowRecipe={setShowRecipe} />
            </DialogPanel>
          </div>
        </Dialog>
      </main>
    </div>
  );
};

export default Profile;
