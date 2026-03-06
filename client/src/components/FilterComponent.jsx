import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = ['TV', 'Cooler', 'Sofa', 'Bed', 'Wash. Machine', 'Home Theatre', 'Dining', 'Table Fan', 'Ceiling Fan', 'Almirah', 'Fridge'];
const BRANDS = ['Samsung', 'LG', 'Sony', 'Symphony', 'Bajaj', 'Voltas', 'Godrej', 'Nilkamal', 'Local'];

export default function FilterComponent({
    selectedCategories,
    setSelectedCategories,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    showDelivery,
    setShowDelivery
}) {
    const [openCategory, setOpenCategory] = useState(true);
    const [openPrice, setOpenPrice] = useState(true);
    const [openBrand, setOpenBrand] = useState(true);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleBrandChange = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
    };

    return (
        <div className="bg-white rounded shadow-sm border border-gray-100 flex flex-col h-full text-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between font-bold text-gray-800">
                Filters
                <button
                    onClick={() => {
                        setSelectedCategories([]);
                        setSelectedBrands([]);
                        setPriceRange('');
                        setShowDelivery(false);
                    }}
                    className="text-xs text-[#2874f0] font-medium hover:underline"
                >
                    CLEAR ALL
                </button>
            </div>

            {/* Categories */}
            <div className="border-b border-gray-200">
                <div
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => setOpenCategory(!openCategory)}
                >
                    <span className="font-semibold text-gray-800">CATEGORIES</span>
                    {openCategory ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
                {openCategory && (
                    <div className="px-4 pb-4 max-h-48 overflow-y-auto scrollbar-thin">
                        {CATEGORIES.map(category => (
                            <label key={category} className="flex items-center gap-2 mb-2 cursor-pointer hover:text-[#2874f0]">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-[#2874f0] rounded border-gray-300 focus:ring-[#2874f0] cursor-pointer"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                <span className="text-gray-700">{category}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Price */}
            <div className="border-b border-gray-200">
                <div
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => setOpenPrice(!openPrice)}
                >
                    <span className="font-semibold text-gray-800">PRICE</span>
                    {openPrice ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
                {openPrice && (
                    <div className="px-4 pb-4 flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-[#2874f0]">
                            <input
                                type="radio"
                                name="priceGroup"
                                value="0-10000"
                                checked={priceRange === '0-10000'}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-4 h-4 text-[#2874f0] focus:ring-[#2874f0] cursor-pointer"
                            />
                            <span className="text-gray-700">Under ₹10,000</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-[#2874f0]">
                            <input
                                type="radio"
                                name="priceGroup"
                                value="10000-20000"
                                checked={priceRange === '10000-20000'}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-4 h-4 text-[#2874f0] focus:ring-[#2874f0] cursor-pointer"
                            />
                            <span className="text-gray-700">₹10,000 - ₹20,000</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-[#2874f0]">
                            <input
                                type="radio"
                                name="priceGroup"
                                value="20000-50000"
                                checked={priceRange === '20000-50000'}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-4 h-4 text-[#2874f0] focus:ring-[#2874f0] cursor-pointer"
                            />
                            <span className="text-gray-700">₹20,000 - ₹50,000</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-[#2874f0]">
                            <input
                                type="radio"
                                name="priceGroup"
                                value="50000-"
                                checked={priceRange === '50000-'}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-4 h-4 text-[#2874f0] focus:ring-[#2874f0] cursor-pointer"
                            />
                            <span className="text-gray-700">Over ₹50,000</span>
                        </label>
                    </div>
                )}
            </div>

            {/* Brands */}
            <div className="border-b border-gray-200">
                <div
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => setOpenBrand(!openBrand)}
                >
                    <span className="font-semibold text-gray-800">BRAND</span>
                    {openBrand ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
                {openBrand && (
                    <div className="px-4 pb-4 max-h-48 overflow-y-auto scrollbar-thin">
                        {BRANDS.map(brand => (
                            <label key={brand} className="flex items-center gap-2 mb-2 cursor-pointer hover:text-[#2874f0]">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-[#2874f0] rounded border-gray-300 focus:ring-[#2874f0] cursor-pointer"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => handleBrandChange(brand)}
                                />
                                <span className="text-gray-700">{brand}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Delivery Toggle Placeholder (Optional but matching previous UI style) */}
            <div className="p-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-10 h-5 rounded-full p-1 flex relative transition-colors ${showDelivery ? 'bg-[#2874f0]' : 'bg-gray-300'}`}>
                        <div className={`bg-white w-3 h-3 rounded-full shadow-md transition-transform ${showDelivery ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Show Delivery Charge Items</span>
                    <input type="checkbox" className="hidden" checked={showDelivery} onChange={() => setShowDelivery(!showDelivery)} />
                </label>
            </div>

        </div>
    );
}
