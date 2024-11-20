import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogPanel } from '@headlessui/react';
import RecipeDetails from './RecipeDetails';

const RecipeSearchResults = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [showRecipe, setShowRecipe] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract search parameters from RecipeGenerator state
  const {
    includedIngredients = [],
    excludedIngredients = [],
    cuisine = '',
    filters = {},
    nutritionRanges = {}
  } = location.state || {};

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Construct query parameters
        const params = new URLSearchParams();
        if (includedIngredients.length) {
          params.append('ingredients', includedIngredients.join(','));
        }
        if (excludedIngredients.length) {
          params.append('exclude', excludedIngredients.join(','));
        }
        if (cuisine) {
          params.append('cuisine', cuisine);
        }
        
        // Add dietary filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, 'true');
        });

        const response = await axios.get(`http://localhost:8080/recipes/search?${params}`);
        setRecipes(response.data);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [includedIngredients, excludedIngredients, cuisine, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement local search filtering if needed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white shadow">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search within results..."
                  className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50"
                />
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Results Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-8">
            {recipes.length ? `We found ${recipes.length} matches!` : 'No recipes found'}
          </h1>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
            {error}
          </div>
        ) : (
          <>
            {/* Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recipes.map((recipe) => (
                <div 
                  key={recipe.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-4">
                    <img
                      src={recipe.image || '/placeholder-recipe.jpg'}
                      alt={recipe.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
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
                      onClick={() => {
                        setSelectedRecipeId(recipe.id);
                        setShowRecipe(true);
                      }}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                    >
                      View Recipe Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Recipe dialog / modal window */}
      <Dialog open={showRecipe} onClose={() => setShowRecipe(false)} className="relative z-100">
        <div className="fixed inset-0 flex w-screen items-center justify-center py-8 bg-slate-500 bg-opacity-40">
          <DialogPanel className="min-w-2xl max-h-[90vh] overflow-y-auto border rounded-lg shadow-lg bg-white px-16 py-12">
            <RecipeDetails id={selectedRecipeId} setShowRecipe={setShowRecipe} />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default RecipeSearchResults;