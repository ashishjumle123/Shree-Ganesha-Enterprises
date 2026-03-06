import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const categories = [
    { name: "AC", image: "https://tse4.mm.bing.net/th/id/OIP.U5Kz7N59I3v67vS6V1u3AHaHa?pid=ImgDet&rs=1", fallback: "AC", route: "/category/AC", type: "Electronics" },
    { name: "Televisions", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", fallback: "TV", route: "/category/TV", type: "Electronics" },
    { name: "Air Coolers", image: "https://images.unsplash.com/photo-1618218168354-e75c2e173eec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", fallback: "Co", route: "/category/Air Coolers", type: "Electronics" },
    { name: "Refrigerators", image: "https://tse4.mm.bing.net/th/id/OIP.DWeH9qsyl3B3xdSbmML_ZQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3", fallback: "Re", route: "/category/Refrigerators", type: "Electronics" },
    { name: "Sofa", image: "https://th.bing.com/th/id/OIP.J83SxVi9L12fQX6PmaVcvwHaE4?w=274&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", fallback: "So", route: "/category/Sofa", type: "Furniture" },
    { name: "Bed", image: "https://images.unsplash.com/photo-1505693419148-4030a90441c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", fallback: "Be", route: "/category/Bed", type: "Furniture" },
    { name: "Ceiling Fan", image: "https://th.bing.com/th/id/OIP.bivmvb3nB0d9PWAdYZfw2gHaHa?w=203&h=203&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", fallback: "CF", route: "/category/Ceiling Fan", type: "Furniture" },
    { name: "Almirah", image: "https://th.bing.com/th/id/OIP.jBxoAro1xYPz7m4NKScPnwHaHa?w=192&h=192&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", fallback: "Al", route: "/category/Almirah", type: "Furniture" },
    { name: "Washing Machine", image: "https://th.bing.com/th/id/OIP.i8-eNpg4fCG6CzTqkwPycwHaE8?w=296&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", fallback: "WM", route: "/category/Washing Machine", type: "Furniture" },
    { name: "Small Appliances", image: "https://th.bing.com/th?q=Small+Electronic+Drum+Set&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247", fallback: "SA", route: "/category/Small Appliances", type: "Electronics" },
];

export default function CategoryBar() {
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const navigate = useNavigate();

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        const timer = setTimeout(checkScroll, 500);
        return () => {
            window.removeEventListener('resize', checkScroll);
            clearTimeout(timer);
        };
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            setTimeout(checkScroll, 500);
        }
    };

    return (
        <div className="bg-white shadow-sm border-b border-gray-100 mb-2 relative group w-full">
            <div className="max-w-[1400px] mx-auto relative px-2 py-2 overflow-hidden">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <div className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-white via-white/80 to-transparent w-16 flex items-center">
                        <button
                            onClick={() => scroll('left')}
                            className="bg-white shadow-md border border-gray-100 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors ml-1"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex items-center gap-3 overflow-x-auto scrollbar-hide snap-x scroll-smooth px-4"
                >
                    {categories.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(item.route)}
                            className="flex items-center gap-2 shrink-0 cursor-pointer snap-start group/item bg-white hover:bg-blue-50/50 px-2 py-1.5 rounded-full border border-transparent hover:border-blue-100 transition-all duration-300"
                        >
                            <div className="w-[36px] h-[36px] rounded-full bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100 shadow-sm group-hover/item:shadow-md transition-shadow">
                                <img
                                    src={item.image}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${item.fallback}&background=f0f5ff&color=2874f0&rounded=true&size=36&font-size=0.4`;
                                    }}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover/item:text-[#2874f0] whitespace-nowrap pr-2 transition-colors">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                {showRightArrow && (
                    <div className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-white via-white/80 to-transparent w-16 flex items-center justify-end">
                        <button
                            onClick={() => scroll('right')}
                            className="bg-white shadow-md border border-gray-100 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors mr-1"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
