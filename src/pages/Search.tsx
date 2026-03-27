import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Filter, ChevronDown, Check, SlidersHorizontal, X } from 'lucide-react';
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const result = await db.getProducts();
        setProducts(result);
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
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.some(b => p.name.includes(b)));
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [categoryParam, queryParam, selectedBrands, selectedCategories, selectedConditions, priceRange, sortBy, products]);

  const brands = ['ProVision', 'Smart', 'Outdoor', 'Wireless'];
  const availableCategories = useMemo(() => Array.from(new Set(products.map(p => p.category))).filter(Boolean).sort(), [products]);
  const availableConditions = useMemo(() => Array.from(new Set(products.map(p => p.condition || 'New'))).filter(Boolean).sort(), [products]);

  const pageTitle = queryParam
    ? `Search: "${queryParam}"`
    : categoryParam === 'deals'
    ? 'Exclusive Deals'
    : categoryParam
    ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
    : 'All Products';

  const FiltersPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
          <Filter size={15} className="text-orange-500" /> Filters
        </h3>
        <button
          onClick={() => { setSelectedBrands([]); setSelectedCategories([]); setSelectedConditions([]); setPriceRange([0, maxPrice]); }}
          className="text-xs text-orange-500 hover:text-orange-600 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div>
        <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Category</h4>
        <div className="space-y-2">
          {availableCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${selectedCategories.includes(cat) ? 'bg-orange-500 border-orange-500' : 'border-slate-300 group-hover:border-orange-400'}`}>
                {selectedCategories.includes(cat) && <Check size={10} className="text-white" strokeWidth={3} />}
              </div>
              <input type="checkbox" className="hidden" checked={selectedCategories.includes(cat)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedCategories([...selectedCategories, cat]);
                  else setSelectedCategories(selectedCategories.filter(c => c !== cat));
                }}
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Condition</h4>
        <div className="space-y-2">
          {availableConditions.map((cond) => (
            <label key={cond} className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${selectedConditions.includes(cond) ? 'bg-orange-500 border-orange-500' : 'border-slate-300 group-hover:border-orange-400'}`}>
                {selectedConditions.includes(cond) && <Check size={10} className="text-white" strokeWidth={3} />}
              </div>
              <input type="checkbox" className="hidden" checked={selectedConditions.includes(cond)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedConditions([...selectedConditions, cond]);
                  else setSelectedConditions(selectedConditions.filter(c => c !== cond));
                }}
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{cond}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Brand</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${selectedBrands.includes(brand) ? 'bg-orange-500 border-orange-500' : 'border-slate-300 group-hover:border-orange-400'}`}>
                {selectedBrands.includes(brand) && <Check size={10} className="text-white" strokeWidth={3} />}
              </div>
              <input type="checkbox" className="hidden" checked={selectedBrands.includes(brand)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedBrands([...selectedBrands, brand]);
                  else setSelectedBrands(selectedBrands.filter(b => b !== brand));
                }}
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Price Range</h4>
        <input
          type="range" min="0" max={maxPrice} step="10"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full accent-orange-500 mb-3"
        />
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
            <input
              type="number" min="0" max={priceRange[1]} value={priceRange[0]}
              onChange={(e) => { const val = parseInt(e.target.value) || 0; setPriceRange([Math.min(val, priceRange[1]), priceRange[1]]); }}
              className="w-full pl-5 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-orange-500"
              placeholder="Min"
            />
          </div>
          <span className="text-slate-400 text-xs">–</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
            <input
              type="number" min={priceRange[0]} value={priceRange[1]}
              onChange={(e) => { const val = parseInt(e.target.value) || maxPrice; setPriceRange([priceRange[0], Math.max(val, priceRange[0])]); }}
              className="w-full pl-5 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-orange-500"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:border-orange-400 transition-colors"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>

          {/* Sort */}
          <div className="relative group">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:border-orange-400 transition-colors">
              Sort: {sortBy === 'popular' ? 'Popular' : sortBy === 'price-low' ? 'Price ↑' : 'Price ↓'}
              <ChevronDown size={14} />
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
              <div className="p-1.5 flex flex-col gap-0.5">
                {[
                  { val: 'popular', label: 'Popular' },
                  { val: 'price-low', label: 'Price: Low to High' },
                  { val: 'price-high', label: 'Price: High to Low' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setSortBy(opt.val)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === opt.val ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Panel */}
      {showMobileFilters && (
        <div className="lg:hidden bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900">Filters</h3>
            <button onClick={() => setShowMobileFilters(false)} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
          <FiltersPanel />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-24">
            <FiltersPanel />
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter size={24} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="flex flex-col bg-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group overflow-hidden h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-slate-50 overflow-hidden">
                      {product.originalPrice && (
                        <span className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Quick Add */}
                      <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          onClick={(e) => { e.preventDefault(); addToCart(product); }}
                          className="w-full bg-slate-900 text-white text-xs font-semibold py-2 rounded-lg hover:bg-orange-500 transition-colors"
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{product.category}</p>
                      <h3 className="font-medium text-slate-900 text-sm line-clamp-2 group-hover:text-orange-600 transition-colors flex-1 leading-snug">
                        {product.name}
                      </h3>
                      {product.condition && (
                        <span className="inline-block text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded mt-2 w-fit">
                          {product.condition}
                        </span>
                      )}
                      <div className="flex items-baseline gap-2 mt-3 pt-3 border-t border-slate-50">
                        <span className="text-base font-bold text-slate-900">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
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
