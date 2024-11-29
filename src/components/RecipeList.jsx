import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel } from '@headlessui/react';
import RecipeDetails from './RecipeDetails';

const RecipeList = ({ ingredients }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [showRecipe, setShowRecipe] = useState(false);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!ingredients || ingredients.every(i => i === '')) return;

      setLoading(true);
      setError(null);

      try {
        const validIngredients = ingredients.filter(i => i !== '');
        // Convert array to comma-separated string and encode it
        const ingredientsParam = encodeURIComponent(validIngredients.join(','));
        const response = await axios.get(`http://localhost:8080/recipes/search?ingredients=${ingredientsParam}`);
        console.log(`http://localhost:8080/recipes/search?ingredients=${ingredientsParam}`)
        setRecipes(response.data);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again later.');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [ingredients]);

  const addRecipeToFavorites = async (recipe) => {
    const response = await axios.put(`http://localhost:8080/api/users/1`, {
      ...user,
      savedRecipes: [...user.savedRecipes, recipe],
    });
    await fetchUser();
  }
  
  const removeRecipeFromFavorites = async (recipe) => {
    const updatedFavorites = user.savedRecipes.filter(r => r.id !== recipe.id);
    const response = await axios.put(`http://localhost:8080/api/users/1`, {
      ...user,
      savedRecipes: [...updatedFavorites],
    });
    await fetchUser();
  }

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/users/1`);
      const { data } = response;
      setUser(data);
    } catch (err) {
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!recipes.length) {
    return (
      <div className="mt-6 text-center text-gray-600 w-full">
        <p>No recipes found. Try selecting different ingredients.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {console.log(recipe)}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.name}</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {recipe.isDairyFree && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Dairy Free
                  </span>
                )}
                {recipe.isGlutenFree && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Gluten Free
                  </span>
                )}
                {recipe.isHealthy && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Healthy
                  </span>
                )}
                {recipe.isCheap && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                    Budget Friendly
                  </span>
                )}
              </div>

              {user.savedRecipes.some(r => r.id === recipe.id) && (
                <button
                  onClick={() => {
                    removeRecipeFromFavorites(recipe)
                  }}
                  className="mb-2 w-full bg-red-200 hover:bg-red-300 text-red-600 font-medium py-2 px-4 rounded"
                >
                  Remove from favorites
                </button>
              )}

              {!user.savedRecipes.some(r => r.id === recipe.id) && (
                <button
                  onClick={() => {
                    addRecipeToFavorites(recipe)
                  }}
                  className="mb-2 w-full bg-yellow-200 hover:bg-yellow-300 text-yellow-600 font-medium py-2 px-4 rounded"
                >
                  Add to favorites
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedRecipeId(recipe.id)
                  setShowRecipe(true)
                }} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              >
                View recipe details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe dialog / modal window */}
      <Dialog open={showRecipe} onClose={() => setShowRecipe(false)} className="relative z-100">
        <div className="fixed inset-0 flex w-screen items-center justify-center py-8 bg-slate-500 bg-opacity-40">
          <DialogPanel className="min-w-2xl max-h-[90vh] overflow-y-auto border rounded-lg shadow-lg bg-white px-16 py-12">
            <RecipeDetails id={selectedRecipeId} setShowRecipe={setShowRecipe} />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default RecipeList;
