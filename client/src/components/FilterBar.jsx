import { ChevronDown, RotateCcw } from 'lucide-react';

export default function FilterBar({
    priceRange,
    setPriceRange,
    brand,
    setBrand,
    showDelivery,
    setShowDelivery,
    resetFilters
}) {
    // Exact requested Price Option Dropdowns mappings...
    const priceOptions = [
        { label: 'Any Price', value: '' },
        { label: 'Under ₹10,000', value: '0-10000' },
        { label: '₹10,000 - ₹20,000', value: '10000-20000' },
        { label: 'Over ₹20,000', value: '20000-1000000' }
    ];

    // Requested generic Brand options (this could ideally map dynamic states later)
    const brandOptions = [
        'Select Brand', 'Samsung', 'LG', 'Symphony', 'Sony', 'Godrej', 'Local'
    ];

    return (
        <div className="bg-white rounded p-3 md:p-4 shadow-sm mb-4 border border-gray-100 flex flex-wrap items-center justify-between gap-4 w-full">
            <div className="flex flex-wrap items-center gap-3 md:gap-6 flex-1">

                {/* Price Filter */}
                <div className="relative flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 hidden sm:block">Price:</span>
                    <div className="relative">
                        <select
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[130px]"
                        >
                            {priceOptions.map((opt, i) => (
                                <option key={i} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Brand Filter */}
                <div className="relative flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 hidden sm:block">Brand:</span>
                    <div className="relative">
                        <select
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[130px]"
                        >
                            {brandOptions.map((b, i) => (
                                <option key={i} value={b}>{b}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Reset Buttons */}
                <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-[#2874f0] hover:text-blue-800 text-sm font-medium transition-colors p-1"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All
                </button>
            </div>

            {/* Delivery Toggle (Right Side) */}
            <div className="flex items-center gap-2 cursor-pointer border-l border-gray-100 pl-4 sm:pl-6" onClick={() => setShowDelivery(!showDelivery)}>
                <span className="text-sm font-medium text-gray-700">Delivery Charge</span>
                <div className={`relative w-10 h-5 rounded-full transition-colors flex items-center ${showDelivery ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`absolute w-4 h-4 rounded-full bg-white shadow transform transition-transform ${showDelivery ? 'translate-x-[22px]' : 'translate-x-1'}`} />
                </div>
            </div>
        </div>
    );
}
