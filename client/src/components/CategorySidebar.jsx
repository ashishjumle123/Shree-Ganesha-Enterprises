import React from 'react';

export const PRICE_RANGES = [
    { id: '0-10k', label: '₹0 - ₹10,000', min: 0, max: 10000 },
    { id: '10k-30k', label: '₹10,000 - ₹30,000', min: 10000, max: 30000 },
    { id: '30k-60k', label: '₹30,000 - ₹60,000', min: 30000, max: 60000 },
    { id: '60k-plus', label: '₹60,000+', min: 60000, max: 999999999 }
];

const CategorySidebar = ({
    uniqueBrands,
    activeBrands,
    toggleBrand,
    activePrices,
    togglePrice
}) => {
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Filters Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
            </div>

            <hr className="border-gray-200" />

            {/* Brands Filter */}
            <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-lg text-gray-800">Brands</h3>
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto custom-scrollbar">
                    {uniqueBrands.length > 0 ? (
                        uniqueBrands.map((brand) => (
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
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No brands found.</p>
                    )}
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Price Filter */}
            <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-lg text-gray-800">Price</h3>
                <div className="flex flex-col gap-2">
                    {PRICE_RANGES.map((range) => (
                        <label key={range.id} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={activePrices.includes(range.id)}
                                onChange={() => togglePrice(range.id)}
                            />
                            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                                {range.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategorySidebar;
