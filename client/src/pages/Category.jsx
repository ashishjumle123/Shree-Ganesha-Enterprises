import React, { useState, useEffect, useMemo } from 'react';
import BASE_URL from '../api';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import CategorySidebar, { PRICE_RANGES } from '../components/CategorySidebar';
import CategoryMobileDrawer from '../components/CategoryMobileDrawer';
import { Filter } from 'lucide-react';

const Category = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Active Filters State
    const [activeBrands, setActiveBrands] = useState([]);
    const [activePrices, setActivePrices] = useState([]);

    // Derived unique brands from fetched products
    const uniqueBrands = useMemo(() => {
        const brands = products.map(p => p.brand);
        return [...new Set(brands)].filter(Boolean).sort();
    }, [products]);

    // Mobile Drawer State
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            setActiveBrands([]); // Reset filters on category change
            setActivePrices([]);
            try {
                // Fetch products strictly by category
                const res = await axios.get(`${BASE_URL}/api/products?category=${encodeURIComponent(categoryName)}`);
                if (res.data) {
                    setProducts(res.data.products || res.data);
                }
            } catch (error) {
                console.error("Error fetching category products:", error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryName) {
            fetchCategoryProducts();
        }
    }, [categoryName]);

    // Memoized Filtering Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // 1. Filter by Brand
            const matchesBrand = activeBrands.length === 0 || activeBrands.includes(product.brand);

            // 2. Filter by Price
            let matchesPrice = activePrices.length === 0;
            if (activePrices.length > 0) {
                matchesPrice = activePrices.some(priceId => {
                    const range = PRICE_RANGES.find(r => r.id === priceId);
                    if (!range) return false;
                    return product.price >= range.min && product.price <= range.max;
                });
            }

            return matchesBrand && matchesPrice;
        });
    }, [products, activeBrands, activePrices]);

    const toggleBrand = (brand) => {
        setActiveBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const togglePrice = (priceId) => {
        setActivePrices(prev =>
            prev.includes(priceId) ? prev.filter(p => p !== priceId) : [...prev, priceId]
        );
    };

    return (
        <div className="w-full bg-[#f1f3f6] pb-[100px] md:pb-8 min-h-screen">
            <div className="max-w-[1400px] mx-auto p-2 md:p-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-start">

                {/* 1. Desktop Filter Sidebar */}
                <div className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 border-r bg-white rounded shadow-sm">
                    <CategorySidebar
                        uniqueBrands={uniqueBrands}
                        activeBrands={activeBrands}
                        toggleBrand={toggleBrand}
                        activePrices={activePrices}
                        togglePrice={togglePrice}
                    />
                </div>

                {/* 2. Product Grid Box */}
                <div className="md:col-span-3 lg:col-span-4 bg-white rounded shadow-sm border border-gray-100 p-2 md:p-4 min-h-[60vh]">
                    {/* Header */}
                    <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            {categoryName}
                            <span className="text-xs md:text-sm font-medium text-gray-500 ml-2">
                                ({filteredProducts.length} items)
                            </span>
                        </h2>
                    </div>
                    {/* Uniform Product Grid */}
                    {loading ? (
                        <div className="flex justify-center my-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 pb-12">
                            {filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-gray-500 mt-10">
                            <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="No Results" className="w-48 mb-6 opacity-75" />
                            <h3 className="text-xl font-medium text-gray-800">Sorry, no matching results found!</h3>
                            <p className="text-sm mt-2">Try adjusting your filters or browsing a different category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Button Strip */}
            <div className="flex md:hidden sticky top-[60px] z-30 bg-white border-b py-2 shadow-sm justify-center">
                <button
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="flex items-center justify-center gap-2 font-medium text-gray-700 w-full uppercase tracking-wide text-sm"
                >
                    <Filter className="w-4 h-4 text-gray-600" />
                    Sort & Filter
                    {(activeBrands.length > 0 || activePrices.length > 0) && (
                        <span className="bg-[#2874f0] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center leading-none ml-1">
                            {activeBrands.length + activePrices.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile Drawer Modal */}
            {isMobileDrawerOpen && (
                <CategoryMobileDrawer
                    onClose={() => setIsMobileDrawerOpen(false)}
                    uniqueBrands={uniqueBrands}
                    activeBrands={activeBrands}
                    toggleBrand={toggleBrand}
                    activePrices={activePrices}
                    togglePrice={togglePrice}
                />
            )}
        </div>
    );
};

export default Category;
