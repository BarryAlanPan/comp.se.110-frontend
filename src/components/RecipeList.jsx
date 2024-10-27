import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecipeList = ({ ingredients }) => {
  const [recipes, setRecipes] = useState([]);
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
    <div className="mt-6 grid grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
            <button 
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              View Recipe Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
