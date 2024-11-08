import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { ChevronDownIcon } from 'lucide-react';
import axios from 'axios';
import RecipeList from './components/RecipeList';
import { useNavigate } from 'react-router-dom';

const filters = [
  "Dairy products", "Meat products", "Sweets and candy", "Bread and cereals",
  "Beef and veals", "Fish and seafood", "Milk, cheese and egs", "Oils and fats",
  "Fruit and berries", "Vegetables"
];

const Homepage = () => {
  const [selectedIngredients, setSelectedIngredients] = useState(Array(3).fill(''));
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8080/api/price');
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // const testData = {
    //   categories: [
    //     '2022M01', '2022M02', '2022M03', '2022M04', '2022M05', '2022M06',
    //     '2022M07', '2022M08', '2022M09', '2022M10', '2022M11', '2022M12',
    //     '2023M01', '2023M02', '2023M03', '2023M04', '2023M05', '2023M06'
    //   ],
    //   series: [
    //     {
    //       name: 'Bread and cereals',
    //       data: [103.61, 105.09, 105.9, 107.39, 109.66, 111.18, 114.25, 115.21, 119.92, 120.64, 120.4, 120.61, 121.65, 124.01, 125.33, 126.44, 127.11, 126.74]
    //     },
    //     {
    //       name: 'Meat products',
    //       data: [100.2, 101.5, 102.8, 104.1, 105.4, 106.7, 108.0, 109.3, 110.6, 111.9, 113.2, 114.5, 115.8, 117.1, 118.4, 119.7, 121.0, 122.3]
    //     },
    //     {
    //       name: 'Fish and seafood',
    //       data: [98.5, 99.2, 99.9, 100.6, 101.3, 102.0, 102.7, 103.4, 104.1, 104.8, 105.5, 106.2, 106.9, 107.6, 108.3, 109.0, 109.7, 110.4]
    //     },
    //     {
    //       name: 'Milk, cheese and eggs',
    //       data: [101.8, 102.6, 103.4, 104.2, 105.0, 105.8, 106.6, 107.4, 108.2, 109.0, 109.8, 110.6, 111.4, 112.2, 113.0, 113.8, 114.6, 115.4]
    //     },
    //     {
    //       name: 'Oils and fats',
    //       data: [105.3, 107.1, 108.9, 110.7, 112.5, 114.3, 116.1, 117.9, 119.7, 121.5, 123.3, 125.1, 126.9, 128.7, 130.5, 132.3, 134.1, 135.9]
    //     },
    //     {
    //       name: 'Fruit and berries',
    //       data: [97.8, 98.1, 98.4, 98.7, 99.0, 99.3, 99.6, 99.9, 100.2, 100.5, 100.8, 101.1, 101.4, 101.7, 102.0, 102.3, 102.6, 102.9]
    //     },
    //     {
    //       name: 'Vegetables',
    //       data: [99.5, 100.2, 100.9, 101.6, 102.3, 103.0, 103.7, 104.4, 105.1, 105.8, 106.5, 107.2, 107.9, 108.6, 109.3, 110.0, 110.7, 111.4]
    //     },
    //     {
    //       name: 'Sweets and candy',
    //       data: [102.1, 102.9, 103.7, 104.5, 105.3, 106.1, 106.9, 107.7, 108.5, 109.3, 110.1, 110.9, 111.7, 112.5, 113.3, 114.1, 114.9, 115.7]
    //     }
    //   ],
    // }

    // setChartData(testData);

    fetchData();
  }, []);

  useEffect(() => {
    if (chartData && typeof chartData !== 'undefined') {
      console.log(chartData);
      const chart = echarts.init(chartRef.current);
      const option = {
        title: {
          text: 'Food Price Dashboard',
          left: 'center',
          top: 0
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: chartData.series.map(item => item.name),
          top: 30,
          type: 'scroll',  // Add scrolling for better legend handling
          padding: [5, 50], // Add padding
          height: 80  // Set specific height for legend area
        },
        grid: {
          top: 130,  // Increase top margin to accommodate legend
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.categories
        },
        yAxis: {
          type: 'value'
        },
        series: chartData.series.map(series => ({
          name: series.name,
          type: 'line',
          data: series.data.map(value => value === 0 ? '-' : value),
          connectNulls: true
        })),
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            start: 0,
            end: 100
          },
          {
            type: 'slider',
            yAxisIndex: 0,
            right: 10,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            start: 0,
            end: 100
          }
        ]
      };
      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, [chartData]);

  const handleRangeChange = (e) => {
    const [min, max] = e.target.value.split(',').map(Number);
    setTimeRange([min, max]);
    // Here you would update the chart data based on the new time range
  };

  const getDateFromPercentage = (percentage) => {
    const startDate = new Date(1970, 0, 1);
    const endDate = new Date(2024, 7, 1);
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const days = totalDays * (percentage / 100);
    const date = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleGenerateClick = () => {
    // Filter out empty strings and pass only selected ingredients
    const filteredIngredients = selectedIngredients.filter(ingredient => ingredient);
    navigate('/recipe-generator', { state: { includedIngredients: filteredIngredients } });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Recipe Finder</h1>
          <a href="/profile" className="text-blue-600 hover:text-blue-800">User Profile</a>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* <div className="bg-white shadow rounded-lg p-6 text-black flex flex-col justify-center items-center h-full">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div>
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input type="checkbox" id={`filter-${index}`} className="mr-2" defaultChecked />
                  <label htmlFor={`filter-${index}`}>{filter}</label>
                </div>
              ))}
            </div>
          </div> */}
          <div className="md:col-span-3 bg-white shadow rounded-lg p-6">
            <div ref={chartRef} style={{height: '400px'}} />
            {/* <div className="mt-4 flex justify-between items-center">
              <span>{getDateFromPercentage(timeRange[0])}</span>
              <input
                type="range"
                className="w-3/4"
                min="0"
                max="100"
                value={`${timeRange[0]},${timeRange[1]}`}
                onChange={handleRangeChange}
                multiple
              />
              <span>{getDateFromPercentage(timeRange[1])}</span>
            </div> */}
            {/* <div className="text-center text-sm text-gray-500 mt-2">Set Date Range</div> */}
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-black flex flex-col justify-center h-full">
            <h2 className="text-lg font-semibold mb-4">Recipe Generator</h2>
            <div className="grid grid-cols-1">
              {[1, 2, 3].map((num) => (
                <div key={num} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Include as ingredient #{num} for recipe
                  </label>
                  <div className="relative">
                    <select
                      value={selectedIngredients[num - 1]}
                      onChange={(e) => {
                        const newIngredients = [...selectedIngredients];
                        newIngredients[num - 1] = e.target.value;
                        setSelectedIngredients(newIngredients);
                      }}
                      className="block appearance-none w-full bg-white border border-gray-300 rounded-md py-2 px-3 pr-8 leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Value</option>
                      {filters.map((filter, index) => (
                        <option key={index} value={filter}>{filter}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDownIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleGenerateClick}
            >
              Click to generate recipes
            </button>
          </div>
          
        </div>
        <RecipeList ingredients={selectedIngredients} />
        
      </main>
    </div>
  );
};

export default Homepage;
