import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/recipes/${id}`);
        // The response.data is already JSON, no need to parse
        setRecipe(response.data);
      } catch (err) {
        setError('Failed to fetch recipe details.');
        console.error('Error fetching recipe details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded"
              >
                Back
              </button>
            </div>

            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.extendedIngredients?.map((ingredient, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-2 text-sm">
                        {index + 1}
                      </span>
                      <span>{ingredient.original}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Details</h2>
                <div className="space-y-3">
                  <p><span className="font-medium">Ready in:</span> {recipe.readyInMinutes} minutes</p>
                  <p><span className="font-medium">Servings:</span> {recipe.servings}</p>
                  <p><span className="font-medium">Price per serving:</span> ${(recipe.pricePerServing / 100).toFixed(2)}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {recipe.vegetarian && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Vegetarian
                      </span>
                    )}
                    {recipe.vegan && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Vegan
                      </span>
                    )}
                    {recipe.glutenFree && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        Gluten Free
                      </span>
                    )}
                    {recipe.dairyFree && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Dairy Free
                      </span>
                    )}
                    {recipe.veryHealthy && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Very Healthy
                      </span>
                    )}
                    {recipe.cheap && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        Budget Friendly
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {recipe.instructions && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3">Instructions</h2>
                <div className="prose max-w-none" 
                     dangerouslySetInnerHTML={{ __html: recipe.instructions }} 
                />
              </div>
            )}

            {recipe.summary && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3">Summary</h2>
                <div className="prose max-w-none" 
                     dangerouslySetInnerHTML={{ __html: recipe.summary }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
