import React from 'react';
import { useFilterContext } from '../context/FilterContext';

const CATEGORIES = [
    'TV', 'Cooler', 'Sofa', 'Bed', 'Wash. Machine',
    'Home Theatre', 'Dining', 'Table Fan', 'Ceiling Fan',
    'Almirah', 'Fridge'
];

const BRANDS = [
    'Samsung', 'LG', 'Symphony', 'Godrej',
    'Whirlpool', 'Sony', 'Panasonic', 'Voltas'
];

const FilterOptions = () => {
    const {
        activeCategories,
        toggleCategory,
        activeBrands,
        toggleBrand,
        maxPrice,
        setMaxPrice,
    } = useFilterContext();

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Categories Filter */}
            <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-lg text-gray-800">Categories</h3>
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto custom-scrollbar">
                    {CATEGORIES.map((category) => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={activeCategories.includes(category)}
                                onChange={() => toggleCategory(category)}
                            />
                            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                                {category}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Brands Filter */}
            <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-lg text-gray-800">Brands</h3>
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto custom-scrollbar">
                    {BRANDS.map((brand) => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={activeBrands.includes(brand)}
                                onChange={() => toggleBrand(brand)}
                            />
                            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                                {brand}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Price Filter */}
            <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-lg text-gray-800">Max Price: ₹{maxPrice.toLocaleString()}</h3>
                <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 font-medium tracking-wide">
                    <span>₹0</span>
                    <span>₹100,000</span>
                </div>
            </div>
        </div>
    );
};

export default FilterOptions;
