import React, { useState } from 'react';
import { ChevronLeft, X, Plus, Minus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Range } from 'react-range';

const RecipeGenerator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cuisine, setCuisine] = useState('');
    const [includedIngredients, setIncludedIngredients] = useState(
        location.state?.includedIngredients || []
    );
    const [excludedIngredients, setExcludedIngredients] = useState([]);
    const [includeInput, setIncludeInput] = useState('');
    const [excludeInput, setExcludeInput] = useState('');

    // Dietary preferences state
    const [filters, setFilters] = useState({
        dairyFree: false,
        glutenFree: false,
        sustainable: false
    });

    // Nutritional ranges state
    const [nutritionRanges, setNutritionRanges] = useState({
        calories: [200, 800],
        protein: [10, 50],
        carbs: [20, 100]
    });

    const [visibleRanges, setVisibleRanges] = useState({
        calories: false,
        protein: false,
        carbs: false
    });

    const handleAddIncluded = () => {
        if (includeInput.trim()) {
            setIncludedIngredients([...includedIngredients, includeInput.trim()]);
            setIncludeInput('');
        }
    };

    const handleAddExcluded = () => {
        if (excludeInput.trim()) {
            setExcludedIngredients([...excludedIngredients, excludeInput.trim()]);
            setExcludeInput('');
        }
    };

    const handleRemoveIncluded = (ingredient) => {
        setIncludedIngredients(includedIngredients.filter(item => item !== ingredient));
    };

    const handleRemoveExcluded = (ingredient) => {
        setExcludedIngredients(excludedIngredients.filter(item => item !== ingredient));
    };

    const handleIncludeKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddIncluded();
        }
    };

    const handleExcludeKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddExcluded();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-500">
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-200 rounded-full bg-white"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-2xl font-semibold ml-4">Recipe Generator</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-6">
                        {/* Cuisine Selector */}
                        <div className="bg-white rounded-lg p-6 shadow">
                            <h2 className="text-lg font-medium mb-4">Cuisine</h2>
                            <select
                                value={cuisine}
                                onChange={(e) => setCuisine(e.target.value)}
                                className="w-full p-2 border rounded-md bg-white"
                            >
                                <option value="">Value</option>
                                <option value="italian">Italian</option>
                                <option value="mexican">Mexican</option>
                                <option value="asian">Asian</option>
                                <option value="american">American</option>
                            </select>
                        </div>

                        {/* Dietary Preferences */}
                        <div className="bg-white rounded-lg p-6 shadow">
                            <h2 className="text-lg font-medium mb-4">Dietary Preferences</h2>
                            <div className="space-y-4">
                                {Object.entries(filters).map(([key, value]) => (
                                    <label key={key} className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={() => setFilters(prev => ({ ...prev, [key]: !prev[key] }))}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-gray-700 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Ingredient Selection */}
                        <div className="bg-white rounded-lg p-6 shadow">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Include Ingredients Column */}
                                <div className="text-center">
                                    <button
                                        onClick={handleAddIncluded}
                                        className="mb-4 p-3 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                                    >
                                        <Plus className="h-6 w-6 text-green-600" />
                                    </button>
                                    <h3 className="text-lg font-medium mb-2">Include Ingredient</h3>
                                    <div className="flex mb-4">
                                        <input
                                            type="text"
                                            value={includeInput}
                                            onChange={(e) => setIncludeInput(e.target.value)}
                                            onKeyPress={handleIncludeKeyPress}
                                            className="w-full p-2 border rounded-md bg-white"
                                            placeholder="Input"
                                        />
                                    </div>
                                    {/* Include Tags */}
                                    <div className="flex flex-col gap-2">
                                        {includedIngredients.map((ingredient, index) => (
                                            <span 
                                                key={index} 
                                                className="inline-flex items-center justify-between bg-green-50 border border-green-100 rounded-lg px-4 py-2 text-sm text-green-800"
                                            >
                                                {ingredient}
                                                <button
                                                    onClick={() => handleRemoveIncluded(ingredient)}
                                                    className="ml-2 p-1 hover:bg-green-100 rounded-full transition-colors bg-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Exclude Ingredients Column */}
                                <div className="text-center">
                                    <button
                                        onClick={handleAddExcluded}
                                        className="mb-4 p-3 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                                    >
                                        <Minus className="h-6 w-6 text-red-600" />
                                    </button>
                                    <h3 className="text-lg font-medium mb-2">Exclude Ingredient</h3>
                                    <div className="flex mb-4">
                                        <input
                                            type="text"
                                            value={excludeInput}
                                            onChange={(e) => setExcludeInput(e.target.value)}
                                            onKeyPress={handleExcludeKeyPress}
                                            className="w-full p-2 border rounded-md bg-white"
                                            placeholder="Input"
                                        />
                                    </div>
                                    {/* Exclude Tags */}
                                    <div className="flex flex-col gap-2">
                                        {excludedIngredients.map((ingredient, index) => (
                                            <span 
                                                key={index} 
                                                className="inline-flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-4 py-2 text-sm text-red-800"
                                            >
                                                {ingredient}
                                                <button
                                                    onClick={() => handleRemoveExcluded(ingredient)}
                                                    className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors bg-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
      {/* Nutritional Ranges */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-lg font-medium mb-4">Nutritional Information</h2>
        <div className="space-y-6">
          {Object.entries(nutritionRanges).map(([key, values]) => (
            <div key={key} className="flex items-center space-x-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={visibleRanges[key]}
                  onChange={() => setVisibleRanges(prev => ({
                    ...prev,
                    [key]: !prev[key]
                  }))}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 capitalize">
                  {visibleRanges[key] ? 'on' : 'off'}
                </span>
              </label>
              <div className="flex-grow">
                <div className="flex justify-between mb-2">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span>{values[0]}-{values[1]}</span>
                </div>
                <Range
                  values={values}
                  step={1}
                  min={key === 'calories' ? 0 : 
                      key === 'protein' ? 0 : 
                      0}
                  max={key === 'calories' ? 1500 : 
                      key === 'protein' ? 100 : 
                      200}
                  onChange={(newValues) => setNutritionRanges(prev => ({
                    ...prev,
                    [key]: newValues
                  }))}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="w-full h-3 bg-gray-200 rounded-full"
                      style={{
                        ...props.style
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      className="h-5 w-5 bg-gray-900 rounded-full focus:outline-none"
                      style={{
                        ...props.style
                      }}
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

</div>
                </div>



                {/* Generate Button */}
                <div className="fixed bottom-6 right-6">
                    <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800">
                        Generate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeGenerator;