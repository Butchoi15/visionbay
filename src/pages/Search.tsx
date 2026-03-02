import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { db, Product } from '../lib/db';
import { useCart } from '../context/CartContext';

export function Search() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q');
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const result = await db.getProducts();
        setProducts(result);

        // Dynamically set max price based on actual products
        if (result.length > 0) {
          const highestPrice = Math.max(...result.map(p => p.price));
          const newMax = Math.max(10000, Math.ceil(highestPrice / 100) * 100);
          setMaxPrice(newMax);
          setPriceRange([0, newMax]);
        }
      } catch (e) {
        console.error("Failed to fetch products:", e);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (queryParam) {
      const q = queryParam.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    } else if (categoryParam && categoryParam !== 'deals') {
      filtered = filtered.filter(p => p.category.toLowerCase().includes(categoryParam.toLowerCase()));
    } else if (categoryParam === 'deals') {
      filtered = filtered.filter(p => p.originalPrice);
    }

    if (selectedConditions.length > 0) {
      filtered = filtered.filter(p => selectedConditions.includes(p.condition || 'New'));
    }

    // Mock brand filtering
    if (selectedBrands.length > 0) {
      // In a real app, products would have a brand field
      filtered = filtered.filter(p => selectedBrands.some(b => p.name.includes(b)));
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [categoryParam, queryParam, selectedBrands, selectedCategories, selectedConditions, priceRange, sortBy, products]);

  const brands = ['ProVision', 'Smart', 'Outdoor', 'Wireless'];
  const availableCategories = useMemo(() => Array.from(new Set(products.map(p => p.category))).filter(Boolean).sort(), [products]);
  const availableConditions = useMemo(() => Array.from(new Set(products.map(p => p.condition || 'New'))).filter(Boolean).sort(), [products]);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-3xl overflow-hidden relative h-64 flex items-center"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        <div className="relative z-10 px-12 max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            {queryParam ? `Search Results for "${queryParam}"` : categoryParam === 'deals' ? 'Exclusive Deals' : categoryParam ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}` : 'Secure Your World'}
          </h1>
          <p className="text-slate-300 text-lg">
            Discover top-tier security solutions designed for simplicity and peace of mind.
          </p>
        </div>
      </motion.div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">
          {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:border-orange-500 transition-colors">
              Sort by: {sortBy === 'popular' ? 'Popular' : sortBy === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}
              <ChevronDown size={16} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
              <div className="p-2 flex flex-col gap-1">
                <button onClick={() => setSortBy('popular')} className={`text-left px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors ${sortBy === 'popular' ? 'font-bold text-orange-500' : 'text-slate-700'}`}>Popular</button>
                <button onClick={() => setSortBy('price-low')} className={`text-left px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors ${sortBy === 'price-low' ? 'font-bold text-orange-500' : 'text-slate-700'}`}>Price: Low to High</button>
                <button onClick={() => setSortBy('price-high')} className={`text-left px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors ${sortBy === 'price-high' ? 'font-bold text-orange-500' : 'text-slate-700'}`}>Price: High to Low</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Filter size={18} className="text-orange-500" /> Filters
              </h3>
              <button
                onClick={() => { setSelectedBrands([]); setSelectedCategories([]); setSelectedConditions([]); setPriceRange([0, maxPrice]); }}
                className="text-sm text-orange-500 hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-4 mb-8">
              <h4 className="font-medium text-slate-900">Category</h4>
              <div className="space-y-3">
                {availableCategories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-orange-500 border-orange-500' : 'border-slate-300 group-hover:border-orange-400'}`}>
                      {selectedCategories.includes(cat) && <Check size={14} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedCategories.includes(cat)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedCategories([...selectedCategories, cat]);
                        else setSelectedCategories(selectedCategories.filter(c => c !== cat));
                      }}
                    />
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div className="space-y-4 mb-8">
              <h4 className="font-medium text-slate-900">Condition</h4>
              <div className="space-y-3">
                {availableConditions.map((cond) => (
                  <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedConditions.includes(cond) ? 'bg-orange-500 border-orange-500' : 'border-slate-300 group-hover:border-orange-400'}`}>
                      {selectedConditions.includes(cond) && <Check size={14} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedConditions.includes(cond)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedConditions([...selectedConditions, cond]);
                        else setSelectedConditions(selectedConditions.filter(c => c !== cond));
                      }}
                    />
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{cond}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-4 mb-8">
              <h4 className="font-medium text-slate-900">Brand</h4>
              <div className="space-y-3">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-orange-500 border-orange-500' : 'border-slate-300 group-hover:border-orange-400'}`}>
                      {selectedBrands.includes(brand) && <Check size={14} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedBrands([...selectedBrands, brand]);
                        else setSelectedBrands(selectedBrands.filter(b => b !== brand));
                      }}
                    />
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Price Range</h4>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-orange-500"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setPriceRange([Math.min(val, priceRange[1]), priceRange[1]]);
                    }}
                    className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Min"
                  />
                </div>
                <span className="text-slate-400">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    value={priceRange[1]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || maxPrice;
                      setPriceRange([priceRange[0], Math.max(val, priceRange[0])]);
                    }}
                    className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-500">Try adjusting your filters or search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="block bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 group relative h-full flex flex-col"
                  >
                    {/* Discount Badge */}
                    {product.originalPrice && (
                      <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}

                    <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-slate-50 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Quick Add Overlay */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          className="bg-white/90 backdrop-blur-sm text-slate-900 px-6 py-2 rounded-full font-medium shadow-lg hover:bg-orange-500 hover:text-white transition-colors translate-y-4 group-hover:translate-y-0 duration-300"
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">{product.category}</div>
                      <h3 className="font-medium text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors flex-1">
                        {product.name}
                      </h3>

                      {product.condition && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                            {product.condition}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-50">
                        <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
