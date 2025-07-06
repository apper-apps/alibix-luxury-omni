import 'react-toastify/dist/ReactToastify.css'
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Please refresh the page or try again later.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Mock Data
const mockProducts = [
  {
    Id: 1,
    name: { en: "Premium Leather Shoes", ur: "پریمیم چمڑے کے جوتے" },
    price: 2000,
    originalPrice: 2500,
    discount: 20,
    image: "/api/placeholder/300/300",
    category: "mens-shoes",
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["black", "brown", "tan"],
    inStock: true,
    rating: 4.5,
    reviews: 128,
    country: "Pakistan"
  },
  {
    Id: 2,
    name: { en: "Designer Handbag", ur: "ڈیزائنر ہینڈ بیگ" },
    price: 1600,
    originalPrice: 2000,
    discount: 20,
    image: "/api/placeholder/300/300",
    category: "womens-fashion",
    colors: ["red", "black", "blue"],
    inStock: true,
    rating: 4.7,
    reviews: 89,
    country: "Turkey"
  },
  {
    Id: 3,
    name: { en: "Kids Educational Toy", ur: "بچوں کا تعلیمی کھلونا" },
    price: 800,
    originalPrice: 1000,
    discount: 20,
    image: "/api/placeholder/300/300",
    category: "kids-toys",
    inStock: false,
    rating: 4.3,
    reviews: 45,
    country: "China"
  },
  {
    Id: 4,
    name: { en: "Kitchen Appliance Set", ur: "کچن اپلائنس سیٹ" },
    price: 4000,
    originalPrice: 5000,
    discount: 20,
    image: "/api/placeholder/300/300",
    category: "kitchen",
    inStock: true,
    rating: 4.6,
    reviews: 203,
    country: "Germany"
  },
  {
    Id: 5,
    name: { en: "Beauty Care Kit", ur: "بیوٹی کیئر کٹ" },
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    image: "/api/placeholder/300/300",
    category: "beauty",
    inStock: true,
    rating: 4.4,
    reviews: 167,
    country: "Korea"
  },
  {
    Id: 6,
    name: { en: "Gaming Laptop", ur: "گیمنگ لیپ ٹاپ" },
    price: 80000,
    originalPrice: 100000,
    discount: 20,
    image: "/api/placeholder/300/300",
    category: "electronics",
    inStock: true,
    rating: 4.8,
    reviews: 312,
    country: "USA"
  }
];

const mockCategories = [
  { Id: 1, name: { en: "Men Shoes", ur: "مردوں کے جوتے" }, icon: "👞", slug: "mens-shoes" },
  { Id: 2, name: { en: "Women Fashion", ur: "خواتین کا فیشن" }, icon: "👗", slug: "womens-fashion" },
  { Id: 3, name: { en: "Kids Toys", ur: "بچوں کے کھلونے" }, icon: "🧸", slug: "kids-toys" },
  { Id: 4, name: { en: "Kitchen", ur: "کچن" }, icon: "🍳", slug: "kitchen" },
  { Id: 5, name: { en: "Beauty", ur: "خوبصورتی" }, icon: "💄", slug: "beauty" },
  { Id: 6, name: { en: "Electronics", ur: "الیکٹرانکس" }, icon: "📱", slug: "electronics" },
  { Id: 7, name: { en: "Computers", ur: "کمپیوٹرز" }, icon: "💻", slug: "computers" },
  { Id: 8, name: { en: "Sports", ur: "کھیل" }, icon: "⚽", slug: "sports" }
];

// Global State Management
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    const existingItem = cart.find(item => 
      item.Id === product.Id && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );

    if (existingItem) {
      setCart(cart.map(item => 
        item.Id === product.Id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity, selectedSize, selectedColor }]);
    }
    
    toast.success(`${product.name[language]} added to cart!`);
  };

  const removeFromCart = (productId, selectedSize = null, selectedColor = null) => {
    setCart(cart.filter(item => 
      !(item.Id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
    ));
    toast.success('Item removed from cart');
  };

  const addToWishlist = (product) => {
    if (!wishlist.find(item => item.Id === product.Id)) {
      setWishlist([...wishlist, product]);
      toast.success(`${product.name[language]} added to wishlist!`);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item.Id !== productId));
    toast.success('Item removed from wishlist');
  };

  const addToRecentlyViewed = (product) => {
    const filtered = recentlyViewed.filter(item => item.Id !== product.Id);
    setRecentlyViewed([product, ...filtered].slice(0, 10));
  };

  const value = {
    language,
    setLanguage,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    recentlyViewed,
    addToRecentlyViewed,
    searchHistory,
    setSearchHistory,
    user,
    setUser,
    isAdmin,
    setIsAdmin
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Components
const LanguageToggle = () => {
  const { language, setLanguage } = useApp();
  
  return (
    <div className="language-toggle">
      <button 
        className={`language-option ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button 
        className={`language-option ${language === 'ur' ? 'active' : ''}`}
        onClick={() => setLanguage('ur')}
      >
        اردو
      </button>
    </div>
  );
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { language, searchHistory, setSearchHistory } = useApp();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setSearchHistory([searchTerm, ...searchHistory.filter(term => term !== searchTerm)].slice(0, 5));
      
      setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        setIsSearching(false);
      }, 500);
    }
  };

  const handleCameraSearch = () => {
    toast.info(language === 'en' ? 'Camera search feature coming soon!' : 'کیمرہ سرچ فیچر جلد آ رہا ہے!');
  };

  return (
    <div className="search-bar">
      <ApperIcon name="Search" size={20} className="text-gray-400" />
      <input
        type="text"
        placeholder={language === 'en' ? 'Search products...' : 'پروڈکٹس تلاش کریں...'}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        className="flex-1 bg-transparent outline-none text-sm"
      />
      <button 
        onClick={handleCameraSearch}
        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
      >
        <ApperIcon name="Camera" size={20} className="text-gray-600" />
      </button>
      {isSearching && (
        <div className="animate-spin">
          <ApperIcon name="Loader2" size={16} className="text-primary" />
        </div>
      )}
    </div>
  );
};

const CategoryScroll = () => {
  const { language } = useApp();
  const navigate = useNavigate();

  return (
    <div className="category-scroll mb-6">
      <div className="flex gap-4 overflow-x-auto hide-scrollbar mobile-scroll px-4">
        {mockCategories.map(category => (
          <div
            key={category.Id}
            onClick={() => navigate(`/category/${category.slug}`)}
            className="category-card min-w-[80px] cursor-pointer touch-feedback"
          >
            <div className="text-3xl mb-2">{category.icon}</div>
            <div className="text-xs font-medium text-center text-bilingual">
              {category.name[language]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { language, addToCart, addToWishlist, wishlist, addToRecentlyViewed } = useApp();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isInWishlist = wishlist.some(item => item.Id === product.Id);
  const discountAmount = Math.round(product.originalPrice - product.price);

  const handleProductClick = () => {
    addToRecentlyViewed(product);
    navigate(`/product/${product.Id}`);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (product.inStock) {
      addToCart(product, 1, selectedSize, selectedColor);
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      // Remove from wishlist logic would go here
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="product-card cursor-pointer touch-feedback" onClick={handleProductClick}>
      <div className="relative">
        <div className="image-gallery">
          {!imageLoaded && (
            <div className="skeleton-image w-full aspect-square"></div>
          )}
          <img
            src={product.image}
            alt={product.name[language]}
            className={`image-gallery-main ${imageLoaded ? 'block' : 'hidden'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 discount-badge">
              -{product.discount}%
            </div>
          )}
          
          {!product.inStock && (
            <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold">
              {language === 'en' ? 'Sold Out' : 'ختم'}
            </div>
          )}
          
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
          >
            <ApperIcon 
              name={isInWishlist ? "Heart" : "Heart"} 
              size={16} 
              className={isInWishlist ? "text-red-500 fill-current" : "text-gray-400"}
            />
          </button>
        </div>
        
        <div className="p-4">
          <div className="country-badge mb-2">
            {product.country}
          </div>
          
          <h3 className="font-semibold mb-2 text-sm text-bilingual line-clamp-2">
            {product.name[language]}
          </h3>
          
          <div className="star-rating mb-2">
            {[...Array(5)].map((_, i) => (
              <ApperIcon
                key={i}
                name="Star"
                className={`star ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'empty'}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="price-discount">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="price-original">Rs. {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          
          {product.sizes && (
            <div className="mb-3">
              <div className="text-xs text-gray-600 mb-1">
                {language === 'en' ? 'Size:' : 'سائز:'}
              </div>
              <div className="flex gap-1 flex-wrap">
                {product.sizes.slice(0, 3).map(size => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`size-option text-xs ${selectedSize === size ? 'selected' : ''}`}
                  >
                    {size}
                  </button>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-xs text-gray-500">+{product.sizes.length - 3}</span>
                )}
              </div>
            </div>
          )}
          
          {product.colors && (
            <div className="mb-3">
              <div className="text-xs text-gray-600 mb-1">
                {language === 'en' ? 'Color:' : 'رنگ:'}
              </div>
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map(color => (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(color);
                    }}
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                )}
              </div>
            </div>
          )}
          
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              product.inStock
                ? 'bg-primary text-white hover:bg-orange-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {!product.inStock 
              ? (language === 'en' ? 'Out of Stock' : 'ختم') 
              : (language === 'en' ? 'Add to Cart' : 'کارٹ میں شامل کریں')
            }
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileNavigation = () => {
  const { cart, wishlist } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: 'Home', label: 'Home' },
    { path: '/categories', icon: 'Grid3x3', label: 'Categories' },
    { path: '/search', icon: 'Search', label: 'Search' },
    { path: '/wishlist', icon: 'Heart', label: 'Wishlist', badge: wishlist.length },
    { path: '/profile', icon: 'User', label: 'Profile' }
  ];

  return (
    <div className="bottom-nav mobile-nav-safe md:hidden">
      <div className="flex justify-around">
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div className="relative">
              <ApperIcon name={item.icon} size={20} />
              {item.badge > 0 && (
                <div className="cart-badge text-xs">
                  {item.badge > 99 ? '99+' : item.badge}
                </div>
              )}
            </div>
            <span className="mt-1">{item.label}</span>
          </button>
        ))}
      </div>
      
      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => navigate('/cart')}
          className="cart-floating"
        >
          <ApperIcon name="ShoppingCart" size={24} />
          <div className="cart-badge">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </div>
        </button>
      )}
    </div>
  );
};

const Layout = ({ children }) => {
  const { language, cart, isAdmin } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ApperIcon name="ShoppingBag" size={28} className="text-primary" />
              <h1 className="text-xl font-bold gradient-text">AliBix</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <LanguageToggle />
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  {language === 'en' ? 'Home' : 'ہوم'}
                </Link>
                <Link to="/categories" className="text-gray-600 hover:text-primary transition-colors">
                  {language === 'en' ? 'Categories' : 'کیٹیگریز'}
                </Link>
                <Link to="/cart" className="text-gray-600 hover:text-primary transition-colors relative">
                  {language === 'en' ? 'Cart' : 'کارٹ'}
                  {cart.length > 0 && (
                    <div className="cart-badge">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                  )}
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-primary transition-colors">
                  {language === 'en' ? 'Profile' : 'پروفائل'}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-600 hover:text-primary transition-colors">
                    {language === 'en' ? 'Admin' : 'ایڈمن'}
                  </Link>
                )}
              </nav>
            </div>
          </div>
          
          {/* Search Bar */}
          {!location.pathname.includes('/admin') && <SearchBar />}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pb-20 md:pb-4">
        {children}
      </main>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

// Page Components
const Home = () => {
  const { language, recentlyViewed } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerSlides = [
    { id: 1, image: '/api/placeholder/800/300', title: 'Summer Sale 50% Off', subtitle: 'Limited Time Offer' },
    { id: 2, image: '/api/placeholder/800/300', title: 'New Arrivals', subtitle: 'Fresh Collections' },
    { id: 3, image: '/api/placeholder/800/300', title: 'Electronics Sale', subtitle: 'Up to 70% Off' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="hero-banner mx-4">
        <div className="banner-carousel flex overflow-x-auto">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`banner-slide w-full transition-transform duration-500 ${
                index === currentSlide ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-xl flex items-center">
                <div className="text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                  <p className="text-lg">{slide.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="swipe-indicators">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`swipe-dot ${index === currentSlide ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <CategoryScroll />

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="px-4">
          <h2 className="text-xl font-bold mb-4">
            {language === 'en' ? 'Recently Viewed' : 'حال ہی میں دیکھے گئے'}
          </h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar mobile-scroll">
            {recentlyViewed.slice(0, 5).map(product => (
              <div key={product.Id} className="min-w-[150px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="px-4">
        <h2 className="text-xl font-bold mb-4">
          {language === 'en' ? 'Featured Products' : 'نمایاں پروڈکٹس'}
        </h2>
        <div className="product-grid">
          {mockProducts.map(product => (
            <ProductCard key={product.Id} product={product} />
          ))}
        </div>
      </div>

      {/* Discount Timer */}
      <div className="mx-4 bg-gradient-to-r from-primary to-orange-600 text-white p-4 rounded-xl">
        <div className="text-center">
          <h3 className="text-lg font-bold mb-2">
            {language === 'en' ? 'Flash Sale Ends In:' : 'فلیش سیل ختم ہونے میں:'}
          </h3>
          <div className="flex justify-center gap-4 text-2xl font-bold">
            <div className="text-center">
              <div>02</div>
              <div className="text-xs">Hours</div>
            </div>
            <div>:</div>
            <div className="text-center">
              <div>30</div>
              <div className="text-xs">Minutes</div>
            </div>
            <div>:</div>
            <div className="text-center">
              <div>45</div>
              <div className="text-xs">Seconds</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Categories = () => {
  const { language } = useApp();
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'All Categories' : 'تمام کیٹیگریز'}
      </h1>
      
      <div className="category-grid">
        {mockCategories.map(category => (
          <div
            key={category.Id}
            onClick={() => navigate(`/category/${category.slug}`)}
            className="category-card cursor-pointer touch-feedback"
          >
            <div className="text-4xl mb-3">{category.icon}</div>
            <h3 className="font-semibold text-center text-bilingual">
              {category.name[language]}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryPage = () => {
  const { language } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const categorySlug = location.pathname.split('/category/')[1];
  const category = mockCategories.find(cat => cat.slug === categorySlug);
  const categoryProducts = mockProducts.filter(product => product.category === categorySlug);

  if (!category) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-600">
          {language === 'en' ? 'Category Not Found' : 'کیٹیگری نہیں ملی'}
        </h1>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ApperIcon name="ArrowLeft" size={20} />
        </button>
        <div className="text-3xl">{category.icon}</div>
        <h1 className="text-2xl font-bold">
          {category.name[language]}
        </h1>
      </div>
      
      <div className="product-grid">
        {categoryProducts.map(product => (
          <ProductCard key={product.Id} product={product} />
        ))}
      </div>
      
      {categoryProducts.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Package" size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {language === 'en' ? 'No products found in this category' : 'اس کیٹیگری میں کوئی پروڈکٹ نہیں ملا'}
          </p>
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { language, addToCart, addToWishlist, wishlist, addToRecentlyViewed } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const productId = parseInt(location.pathname.split('/product/')[1]);
  const product = mockProducts.find(p => p.Id === productId);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  const isInWishlist = wishlist.some(item => item.Id === productId);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);

  if (!product) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-600">
          {language === 'en' ? 'Product Not Found' : 'پروڈکٹ نہیں ملا'}
        </h1>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.inStock) {
      addToCart(product, quantity, selectedSize, selectedColor);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      // Remove from wishlist logic
    } else {
      addToWishlist(product);
    }
  };

  const images = [product.image, product.image, product.image]; // Mock multiple images

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ApperIcon name="ArrowLeft" size={20} />
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <ApperIcon name="Share" size={20} />
          </button>
          <button 
            onClick={handleWishlistToggle}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ApperIcon 
              name="Heart" 
              size={20} 
              className={isInWishlist ? "text-red-500 fill-current" : ""}
            />
          </button>
        </div>
      </div>

      {/* Product Images */}
      <div className="image-gallery mx-4">
        <img
          src={images[currentImage]}
          alt={product.name[language]}
          className="image-gallery-main"
        />
        
        <div className="image-gallery-thumbnails">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name[language]} ${index + 1}`}
              className={`image-gallery-thumbnail ${index === currentImage ? 'active' : ''}`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="country-badge mb-3">
          {product.country}
        </div>
        
        <h1 className="text-2xl font-bold mb-3 text-bilingual">
          {product.name[language]}
        </h1>
        
        <div className="star-rating mb-4">
          {[...Array(5)].map((_, i) => (
            <ApperIcon
              key={i}
              name="Star"
              className={`star ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'empty'}`}
            />
          ))}
          <span className="text-gray-500 ml-2">({product.reviews} reviews)</span>
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl font-bold text-primary">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-xl text-gray-500 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
              <span className="discount-badge">
                -{product.discount}%
              </span>
            </>
          )}
        </div>

        {/* Size Selection */}
        {product.sizes && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">
              {language === 'en' ? 'Size' : 'سائز'}
            </h3>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {product.colors && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">
              {language === 'en' ? 'Color' : 'رنگ'}
            </h3>
            <div className="flex gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">
            {language === 'en' ? 'Quantity' : 'مقدار'}
          </h3>
          <div className="quantity-selector">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="quantity-btn"
            >
              <ApperIcon name="Minus" size={16} />
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="quantity-input"
            />
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="quantity-btn"
            >
              <ApperIcon name="Plus" size={16} />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-all ${
            product.inStock
              ? 'bg-primary text-white hover:bg-orange-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {!product.inStock 
            ? (language === 'en' ? 'Out of Stock' : 'ختم') 
            : (language === 'en' ? 'Add to Cart' : 'کارٹ میں شامل کریں')
          }
        </button>

        {/* Product Description */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3">
            {language === 'en' ? 'Description' : 'تفصیل'}
          </h3>
          <p className="text-gray-600 text-bilingual">
            {language === 'en' 
              ? 'High-quality product with premium materials and excellent craftsmanship. Perfect for everyday use and special occasions.'
              : 'اعلیٰ معیار کا پروڈکٹ جو بہترین مواد اور عمدہ کاریگری کے ساتھ بنایا گیا ہے۔ روزمرہ استعمال اور خصوصی مواقع کے لیے بہترین۔'
            }
          </p>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3">
            {language === 'en' ? 'Customer Reviews' : 'کسٹمر ریویوز'}
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map(review => (
              <div key={review} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">Customer {review}</div>
                  <div className="star-rating">
                    {[...Array(5)].map((_, i) => (
                      <ApperIcon
                        key={i}
                        name="Star"
                        className={`star ${i < 4 ? 'text-yellow-400' : 'empty'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {language === 'en' 
                    ? 'Great product! Highly recommended.' 
                    : 'بہترین پروڈکٹ! بہت تجویز کرتا ہوں۔'
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const { language, cart, setCart, removeFromCart } = useApp();
  const navigate = useNavigate();

  const updateQuantity = (productId, selectedSize, selectedColor, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId, selectedSize, selectedColor);
    } else {
      setCart(cart.map(item => 
        item.Id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 300;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center py-12">
        <ApperIcon name="ShoppingCart" size={48} className="text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">
          {language === 'en' ? 'Your cart is empty' : 'آپ کا کارٹ خالی ہے'}
        </h2>
        <p className="text-gray-500 mb-6">
          {language === 'en' ? 'Add some products to get started' : 'شروع کرنے کے لیے کچھ پروڈکٹس شامل کریں'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          {language === 'en' ? 'Start Shopping' : 'خریداری شروع کریں'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Shopping Cart' : 'شاپنگ کارٹ'}
      </h1>
      
      <div className="space-y-4 mb-6">
        {cart.map((item, index) => (
          <div key={`${item.Id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="product-card p-4">
            <div className="flex gap-4">
              <img
                src={item.image}
                alt={item.name[language]}
                className="w-20 h-20 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-bilingual">
                  {item.name[language]}
                </h3>
                
                {item.selectedSize && (
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'en' ? 'Size:' : 'سائز:'} {item.selectedSize}
                  </p>
                )}
                
                {item.selectedColor && (
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'en' ? 'Color:' : 'رنگ:'} 
                    <span 
                      className="inline-block w-4 h-4 rounded-full ml-2 border"
                      style={{ backgroundColor: item.selectedColor }}
                    />
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">
                      Rs. {item.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      × {item.quantity}
                    </span>
                  </div>
                  
                  <div className="quantity-selector">
                    <button 
                      onClick={() => updateQuantity(item.Id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      <ApperIcon name="Minus" size={16} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.Id, item.selectedSize, item.selectedColor, parseInt(e.target.value) || 1)}
                      className="quantity-input"
                    />
                    <button 
                      onClick={() => updateQuantity(item.Id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      <ApperIcon name="Plus" size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => removeFromCart(item.Id, item.selectedSize, item.selectedColor)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
              >
                <ApperIcon name="Trash2" size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Order Summary */}
      <div className="order-summary">
        <h3 className="font-semibold mb-4">
          {language === 'en' ? 'Order Summary' : 'آرڈر کا خلاصہ'}
        </h3>
        
        <div className="flex justify-between mb-2">
          <span>{language === 'en' ? 'Subtotal:' : 'ذیلی کل:'}</span>
          <span>Rs. {subtotal.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span>{language === 'en' ? 'Shipping:' : 'شپنگ:'}</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600">
                {language === 'en' ? 'Free' : 'مفت'}
              </span>
            ) : (
              `Rs. ${shipping.toLocaleString()}`
            )}
          </span>
        </div>
        
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>{language === 'en' ? 'Total:' : 'کل:'}</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/checkout')}
          className="btn-primary w-full mt-4"
        >
          {language === 'en' ? 'Proceed to Checkout' : 'چیک آؤٹ کی طرف بڑھیں'}
        </button>
      </div>
    </div>
  );
};

const Checkout = () => {
  const { language, cart } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cod'
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 300;
  const total = subtotal + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(language === 'en' ? 'Order placed successfully!' : 'آرڈر کامیابی سے دیا گیا!');
    navigate('/orders');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Checkout' : 'چیک آؤٹ'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Information */}
        <div className="admin-card">
          <h3 className="font-semibold mb-4">
            {language === 'en' ? 'Shipping Information' : 'شپنگ کی معلومات'}
          </h3>
          
          <div className="admin-form">
            <div>
              <label>{language === 'en' ? 'Full Name' : 'مکمل نام'}</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label>{language === 'en' ? 'Email' : 'ای میل'}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label>{language === 'en' ? 'Phone' : 'فون'}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label>{language === 'en' ? 'Address' : 'پتہ'}</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label>{language === 'en' ? 'City' : 'شہر'}</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="admin-card">
          <h3 className="font-semibold mb-4">
            {language === 'en' ? 'Payment Method' : 'ادائیگی کا طریقہ'}
          </h3>
          
          <div className="space-y-3">
            <div 
              className={`payment-method ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}
              onClick={() => setFormData({...formData, paymentMethod: 'cod'})}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  readOnly
                />
                <div>
                  <div className="font-semibold">
                    {language === 'en' ? 'Cash on Delivery' : 'ڈیلیوری پر نقد'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? 'Pay when you receive' : 'جب آپ کو موصول ہو تو ادائیگی کریں'}
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              className={`payment-method ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setFormData({...formData, paymentMethod: 'card'})}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  readOnly
                />
                <div>
                  <div className="font-semibold">
                    {language === 'en' ? 'Credit/Debit Card' : 'کریڈٹ/ڈیبٹ کارڈ'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? 'Pay online securely' : 'آن لائن محفوظ ادائیگی'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="admin-card">
          <h3 className="font-semibold mb-4">
            {language === 'en' ? 'Order Summary' : 'آرڈر کا خلاصہ'}
          </h3>
          
          <div className="space-y-3">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name[language]} × {item.quantity}</span>
                <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            
            <div className="border-t pt-3">
              <div className="flex justify-between mb-2">
                <span>{language === 'en' ? 'Subtotal:' : 'ذیلی کل:'}</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>{language === 'en' ? 'Shipping:' : 'شپنگ:'}</span>
                <span>Rs. {shipping.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg">
                <span>{language === 'en' ? 'Total:' : 'کل:'}</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          {language === 'en' ? 'Place Order' : 'آرڈر دیں'}
        </button>
      </form>
    </div>
  );
};

const Orders = () => {
  const { language } = useApp();
  
  const mockOrders = [
    {
      Id: 1,
      orderNumber: 'ALB-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 3200,
      items: 3
    },
    {
      Id: 2,
      orderNumber: 'ALB-2024-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 1800,
      items: 2
    },
    {
      Id: 3,
      orderNumber: 'ALB-2024-003',
      date: '2024-01-05',
      status: 'processing',
      total: 5400,
      items: 1
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-badge pending';
      case 'processing': return 'status-badge processing';
      case 'shipped': return 'status-badge shipped';
      case 'delivered': return 'status-badge delivered';
      case 'cancelled': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: { en: 'Pending', ur: 'منتظر' },
      processing: { en: 'Processing', ur: 'عمل میں' },
      shipped: { en: 'Shipped', ur: 'بھیجا گیا' },
      delivered: { en: 'Delivered', ur: 'پہنچایا گیا' },
      cancelled: { en: 'Cancelled', ur: 'منسوخ' }
    };
    return statusMap[status]?.[language] || status;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Order History' : 'آرڈر کی تاریخ'}
      </h1>
      
      <div className="space-y-4">
        {mockOrders.map(order => (
          <div key={order.Id} className="product-card p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold mb-1">{order.orderNumber}</h3>
                <p className="text-sm text-gray-600">{order.date}</p>
              </div>
              <span className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? `${order.items} items` : `${order.items} آئٹمز`}
                </p>
                <p className="font-bold text-primary">
                  Rs. {order.total.toLocaleString()}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button className="admin-btn admin-btn-secondary">
                  {language === 'en' ? 'View Details' : 'تفصیلات دیکھیں'}
                </button>
                {order.status === 'delivered' && (
                  <button className="admin-btn admin-btn-primary">
                    {language === 'en' ? 'Reorder' : 'دوبارہ آرڈر'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Profile = () => {
  const { language, user, setUser, wishlist, recentlyViewed, isAdmin, setIsAdmin } = useApp();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Mock Google login
    setUser({
      name: 'John Doe',
      email: 'alibix07@gmail.com',
      avatar: '/api/placeholder/100/100'
    });
    setIsAdmin(true);
    toast.success(language === 'en' ? 'Logged in successfully!' : 'کامیابی سے لاگ ان ہوگئے!');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    toast.success(language === 'en' ? 'Logged out successfully!' : 'کامیابی سے لاگ آؤٹ ہوگئے!');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Profile' : 'پروفائل'}
      </h1>
      
      {!user ? (
        <div className="text-center py-12">
          <ApperIcon name="User" size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">
            {language === 'en' ? 'Sign in to your account' : 'اپنے اکاؤنٹ میں سائن ان کریں'}
          </h2>
          <p className="text-gray-500 mb-6">
            {language === 'en' ? 'Access your orders, wishlist, and more' : 'اپنے آرڈرز، خواہش کی فہرست اور مزید تک رسائی حاصل کریں'}
          </p>
          <button
            onClick={handleGoogleLogin}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <ApperIcon name="Mail" size={20} />
            {language === 'en' ? 'Sign in with Google' : 'گوگل کے ساتھ سائن ان کریں'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Info */}
          <div className="admin-card">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                {isAdmin && (
                  <span className="status-badge processing">
                    {language === 'en' ? 'Admin' : 'ایڈمن'}
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="admin-btn admin-btn-secondary"
            >
              {language === 'en' ? 'Logout' : 'لاگ آؤٹ'}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="admin-card text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {wishlist.length}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Wishlist Items' : 'خواہش کی فہرست'}
              </div>
            </div>
            
            <div className="admin-card text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {recentlyViewed.length}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Recently Viewed' : 'حال ہی میں دیکھے گئے'}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            <button
              onClick={() => navigate('/orders')}
              className="w-full admin-card p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ApperIcon name="Package" size={20} />
                <span>{language === 'en' ? 'My Orders' : 'میرے آرڈرز'}</span>
              </div>
              <ApperIcon name="ChevronRight" size={20} />
            </button>
            
            <button
              onClick={() => navigate('/wishlist')}
              className="w-full admin-card p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ApperIcon name="Heart" size={20} />
                <span>{language === 'en' ? 'Wishlist' : 'خواہش کی فہرست'}</span>
              </div>
              <ApperIcon name="ChevronRight" size={20} />
            </button>
            
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="w-full admin-card p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ApperIcon name="Settings" size={20} />
                  <span>{language === 'en' ? 'Admin Panel' : 'ایڈمن پینل'}</span>
                </div>
                <ApperIcon name="ChevronRight" size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Wishlist = () => {
  const { language, wishlist, removeFromWishlist, addToCart } = useApp();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="p-4 text-center py-12">
        <ApperIcon name="Heart" size={48} className="text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">
          {language === 'en' ? 'Your wishlist is empty' : 'آپ کی خواہش کی فہرست خالی ہے'}
        </h2>
        <p className="text-gray-500 mb-6">
          {language === 'en' ? 'Save items you love for later' : 'بعد کے لیے پسندیدہ آئٹمز محفوظ کریں'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          {language === 'en' ? 'Start Shopping' : 'خریداری شروع کریں'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'My Wishlist' : 'میری خواہش کی فہرست'}
      </h1>
      
      <div className="product-grid">
        {wishlist.map(product => (
          <div key={product.Id} className="product-card">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name[language]}
                className="w-full aspect-square object-cover rounded-t-xl"
              />
              
              <button
                onClick={() => removeFromWishlist(product.Id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
              >
                <ApperIcon name="X" size={16} className="text-gray-400" />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold mb-2 text-sm text-bilingual">
                {product.name[language]}
              </h3>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="price-discount">Rs. {product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="price-original">Rs. {product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    product.inStock
                      ? 'bg-primary text-white hover:bg-orange-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.inStock 
                    ? (language === 'en' ? 'Add to Cart' : 'کارٹ میں شامل کریں')
                    : (language === 'en' ? 'Out of Stock' : 'ختم')
                  }
                </button>
                
                <button
                  onClick={() => navigate(`/product/${product.Id}`)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ApperIcon name="Eye" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SearchPage = () => {
  const { language } = useApp();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';
  
  const filteredProducts = mockProducts.filter(product =>
    product.name[language].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'en' ? `Search Results for "${searchQuery}"` : `"${searchQuery}" کے نتائج`}
      </h1>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">
            {language === 'en' ? 'No products found' : 'کوئی پروڈکٹ نہیں ملا'}
          </h2>
          <p className="text-gray-500">
            {language === 'en' ? 'Try adjusting your search terms' : 'اپنی تلاش کی شرائط کو بہتر بنانے کی کوشش کریں'}
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.Id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  const { language, user, isAdmin } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user || !isAdmin) {
    return (
      <div className="p-4 text-center py-12">
        <ApperIcon name="Lock" size={48} className="text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">
          {language === 'en' ? 'Access Denied' : 'رسائی مسترد'}
        </h2>
        <p className="text-gray-500 mb-6">
          {language === 'en' ? 'You need admin privileges to access this page' : 'اس صفحے تک رسائی کے لیے آپ کو ایڈمن کی اجازت درکار ہے'}
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="btn-primary"
        >
          {language === 'en' ? 'Go to Profile' : 'پروفائل پر جائیں'}
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: language === 'en' ? 'Dashboard' : 'ڈیش بورڈ', icon: 'BarChart3' },
    { id: 'products', label: language === 'en' ? 'Products' : 'پروڈکٹس', icon: 'Package' },
    { id: 'categories', label: language === 'en' ? 'Categories' : 'کیٹیگریز', icon: 'Grid3x3' },
    { id: 'orders', label: language === 'en' ? 'Orders' : 'آرڈرز', icon: 'ShoppingCart' },
    { id: 'discounts', label: language === 'en' ? 'Discounts' : 'ڈسکاؤنٹس', icon: 'Percent' }
  ];

  const AdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-primary">{mockProducts.length}</p>
            </div>
            <ApperIcon name="Package" size={32} className="text-primary" />
          </div>
        </div>
        
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-primary">156</p>
            </div>
            <ApperIcon name="ShoppingCart" size={32} className="text-primary" />
          </div>
        </div>
        
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-primary">Rs. 1,24,500</p>
            </div>
            <ApperIcon name="DollarSign" size={32} className="text-primary" />
          </div>
        </div>
        
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-primary">89</p>
            </div>
            <ApperIcon name="Users" size={32} className="text-primary" />
          </div>
        </div>
      </div>
      
      <div className="admin-card">
        <h3 className="font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ALB-2024-001</td>
                <td>John Doe</td>
                <td><span className="status-badge delivered">Delivered</span></td>
                <td>Rs. 3,200</td>
                <td>2024-01-15</td>
              </tr>
              <tr>
                <td>ALB-2024-002</td>
                <td>Jane Smith</td>
                <td><span className="status-badge shipped">Shipped</span></td>
                <td>Rs. 1,800</td>
                <td>2024-01-14</td>
              </tr>
              <tr>
                <td>ALB-2024-003</td>
                <td>Mike Johnson</td>
                <td><span className="status-badge processing">Processing</span></td>
                <td>Rs. 5,400</td>
                <td>2024-01-13</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AdminProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Product Management</h3>
        <button className="admin-btn admin-btn-primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Product
        </button>
      </div>
      
      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map(product => (
                <tr key={product.Id}>
                  <td>
                    <img 
                      src={product.image} 
                      alt={product.name[language]}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                  <td>{product.name[language]}</td>
                  <td>Rs. {product.price.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${product.inStock ? 'processing' : 'cancelled'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="capitalize">{product.category.replace('-', ' ')}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="admin-btn admin-btn-secondary">
                        <ApperIcon name="Edit" size={16} />
                      </button>
                      <button className="admin-btn admin-btn-danger">
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AdminCategories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Category Management</h3>
        <button className="admin-btn admin-btn-primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Category
        </button>
      </div>
      
      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name (English)</th>
                <th>Name (Urdu)</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCategories.map(category => (
                <tr key={category.Id}>
                  <td className="text-2xl">{category.icon}</td>
                  <td>{category.name.en}</td>
                  <td>{category.name.ur}</td>
                  <td>{category.slug}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="admin-btn admin-btn-secondary">
                        <ApperIcon name="Edit" size={16} />
                      </button>
                      <button className="admin-btn admin-btn-danger">
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AdminOrders = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Order Management</h3>
      
      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({length: 10}, (_, i) => (
                <tr key={i}>
                  <td>ALB-2024-{String(i + 1).padStart(3, '0')}</td>
                  <td>Customer {i + 1}</td>
                  <td>{Math.floor(Math.random() * 5) + 1}</td>
                  <td>Rs. {(Math.random() * 5000 + 1000).toFixed(0)}</td>
                  <td>
                    <span className={`status-badge ${['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)]}`}>
                      {['Pending', 'Processing', 'Shipped', 'Delivered'][Math.floor(Math.random() * 4)]}
                    </span>
                  </td>
                  <td>2024-01-{String(15 - i).padStart(2, '0')}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="admin-btn admin-btn-secondary">
                        <ApperIcon name="Eye" size={16} />
                      </button>
                      <button className="admin-btn admin-btn-primary">
                        <ApperIcon name="Edit" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AdminDiscounts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Discount Management</h3>
        <button className="admin-btn admin-btn-primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Discount
        </button>
      </div>
      
      <div className="admin-card">
        <div className="admin-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Discount Type</label>
              <select>
                <option>Percentage</option>
                <option>Fixed Amount</option>
              </select>
            </div>
            
            <div>
              <label>Discount Value</label>
              <input type="number" placeholder="20" />
            </div>
            
            <div>
              <label>Start Date</label>
              <input type="date" />
            </div>
            
            <div>
              <label>End Date</label>
              <input type="date" />
            </div>
          </div>
          
          <button className="admin-btn admin-btn-primary">
            Apply Discount
          </button>
        </div>
      </div>
      
      <div className="admin-card">
        <h4 className="font-semibold mb-4">Active Discounts</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-semibold">Site-wide Sale</div>
              <div className="text-sm text-gray-600">20% off all items</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-badge processing">Active</span>
              <button className="admin-btn admin-btn-danger">
                <ApperIcon name="Trash2" size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-semibold">Electronics Sale</div>
              <div className="text-sm text-gray-600">30% off electronics</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-badge processing">Active</span>
              <button className="admin-btn admin-btn-danger">
                <ApperIcon name="Trash2" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'products': return <AdminProducts />;
      case 'categories': return <AdminCategories />;
      case 'orders': return <AdminOrders />;
      case 'discounts': return <AdminDiscounts />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="admin-header">
        <h1 className="text-2xl font-bold">
          {language === 'en' ? 'Admin Panel' : 'ایڈمن پینل'}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {language === 'en' ? 'Welcome,' : 'خوش آمدید،'} {user.name}
          </span>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>
      
      <div className="admin-content">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Layout>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;