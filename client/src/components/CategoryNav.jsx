import { Monitor, Wind, Sofa, Bed, Waves, Speaker, Utensils, Fan, Activity, Archive, Box, Layers } from 'lucide-react';

export default function CategoryNav({ selectedCategory, onSelectCategory }) {
    const categories = [
        { name: 'TV', icon: Monitor },
        { name: 'Cooler', icon: Wind },
        { name: 'Sofa', icon: Sofa },
        { name: 'Bed', icon: Bed },
        { name: 'Wash. Machine', icon: Waves },
        { name: 'Home Theatre', icon: Speaker },
        { name: 'Dining', icon: Utensils },
        { name: 'Table Fan', icon: Fan },
        { name: 'Ceiling Fan', icon: Activity },
        { name: 'Almirah', icon: Archive },
        { name: 'Fridge', icon: Box },
        { name: 'All Categories', icon: null }
    ];

    return (
        <div className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] mb-1">
            <div className="max-w-7xl mx-auto flex overflow-x-auto gap-6 p-4 scrollbar-hide no-scrollbar snap-x">
                {categories.map((cat, index) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.name;

                    return (
                        <div
                            key={index}
                            onClick={() => onSelectCategory(cat.name)}
                            className={`flex flex-col items-center justify-center min-w-[70px] cursor-pointer snap-start transition-all duration-200 hover:text-[#2874f0] ${isSelected ? 'text-[#2874f0] font-bold' : 'text-gray-600'}`}
                        >
                            <div className={`w-14 h-14 md:w-16 md:h-16 mb-2 flex items-center justify-center rounded-full transition-all duration-200 ${isSelected ? 'bg-blue-50' : 'bg-gray-50 group-hover:bg-blue-50 hover:scale-105'}`}>
                                {Icon ? <Icon strokeWidth={isSelected ? 2 : 1.5} className="w-6 h-6 md:w-8 md:h-8" /> : <Layers className="w-6 h-6 md:w-8 md:h-8" />}
                            </div>
                            <span className="text-xs md:text-sm text-center whitespace-nowrap">{cat.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
