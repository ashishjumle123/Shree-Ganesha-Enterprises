import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import CategorySidebar from './CategorySidebar';

const CategoryMobileDrawer = ({
    onClose,
    uniqueBrands,
    activeBrands,
    toggleBrand,
    activePrices,
    togglePrice
}) => {
    // Prevent body scroll when the drawer is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const drawerContent = (
        <div className="fixed inset-0 z-50 bg-black/50 transition-opacity flex flex-col justify-end">
            {/* Invisible overlay area to click to close */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Drawer Container */}
            <div
                className="absolute bottom-0 left-0 right-0 w-full h-[85vh] bg-white rounded-t-2xl p-4 overflow-y-auto transform transition-transform shadow-2xl flex flex-col pt-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end items-center mb-2 border-b pb-3 border-gray-100">
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content inside Drawer */}
                <div className="flex-1 overflow-y-auto mb-20 px-1">
                    <CategorySidebar
                        uniqueBrands={uniqueBrands}
                        activeBrands={activeBrands}
                        toggleBrand={toggleBrand}
                        activePrices={activePrices}
                        togglePrice={togglePrice}
                    />
                </div>

                {/* Fixed Apply Button at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={onClose}
                        className="w-full bg-[#2874f0] text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-600 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(drawerContent, document.body);
};

export default CategoryMobileDrawer;
