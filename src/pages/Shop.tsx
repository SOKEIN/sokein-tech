import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import ProductCard from '../components/ProductCard';
import { api, type CategoryInfo } from '../services/api';
import { products as fallbackProducts, type Product } from '../data/products';
import {
  SlidersIcon,
  RotateCcwIcon,
  HomeIcon,
  ChevronDownIcon,
  XIcon,
  CheckIcon,
  GridIcon,
  LaptopIcon,
  SmartphoneIcon,
  CameraIcon,
  HeadphonesIcon,
  WatchIcon,
  GamepadIcon,
} from '../components/Icons';

const filterLocalProducts = (opts: {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  sort?: string;
  sale?: boolean;
}) => {
  let list = [...fallbackProducts];
  if (opts.category) list = list.filter(p => p.category === opts.category);
  if (opts.brand) list = list.filter(p => p.brand.toLowerCase() === opts.brand.toLowerCase());
  if (opts.search) {
    const q = opts.search.toLowerCase().trim();
    list = list.filter(p => p.name.toLowerCase().includes(q) || (p.nameKh && p.nameKh.toLowerCase().includes(q)));
  }
  if (opts.minPrice) list = list.filter(p => p.price >= Number(opts.minPrice));
  if (opts.maxPrice) list = list.filter(p => p.price <= Number(opts.maxPrice));
  if (opts.inStock) list = list.filter(p => p.inStock);
  if (opts.sale) list = list.filter(p => p.discount > 0);

  if (opts.sort === 'price_asc') list.sort((a, b) => a.price - b.price);
  else if (opts.sort === 'price_desc') list.sort((a, b) => b.price - a.price);
  else if (opts.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  else if (opts.sort === 'popular') list.sort((a, b) => b.discount - a.discount);
  else list.sort((a, b) => b.id - a.id);

  return list;
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const brandFilter = searchParams.get('brand') || '';
  const sortFilter = searchParams.get('sort') || '';
  const searchQuery = searchParams.get('q') || '';
  const saleFilter = searchParams.get('sale') === 'true';

  const [productsList, setProductsList] = useState<Product[]>(() =>
    filterLocalProducts({
      category: categoryFilter,
      brand: brandFilter,
      search: searchQuery,
      sort: sortFilter || 'newest',
      sale: saleFilter,
    })
  );
  const [categoriesList, setCategoriesList] = useState<CategoryInfo[]>([]);
  const [brandsList, setBrandsList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [selectedBrand, setSelectedBrand] = useState(brandFilter);
  const [sortBy, setSortBy] = useState(sortFilter || 'newest');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Khmer mapping for categories
  const categoryNameMap: Record<string, string> = {
    laptops: 'កុំព្យូទ័រយួរដៃ',
    desktops: 'កុំព្យូទ័រលើតុ',
    phones: 'ទូរសព្ទដៃ',
    tablets: 'iPad & ថេប្លេត',
    monitors: 'ម៉ូនីទ័រ',
    accessories: 'គ្រឿងបន្លាស់',
    gaming: 'ឧបករណ៍ Gaming',
    cameras: 'កាមេរ៉ា & DJI',
    electronics: 'គ្រឿងអេឡិចត្រូនិក',
    audio: 'កាស & សម្លេង',
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'laptops':
      case 'desktops':
        return <LaptopIcon size={17} className="text-blue-600" />;
      case 'phones':
      case 'tablets':
        return <SmartphoneIcon size={17} className="text-emerald-600" />;
      case 'cameras':
        return <CameraIcon size={17} className="text-rose-600" />;
      case 'audio':
        return <HeadphonesIcon size={17} className="text-purple-600" />;
      case 'gaming':
        return <GamepadIcon size={17} className="text-indigo-600" />;
      default:
        return <WatchIcon size={17} className="text-amber-600" />;
    }
  };

  useEffect(() => {
    setSelectedCategory(categoryFilter);
  }, [categoryFilter]);

  useEffect(() => {
    setSelectedBrand(brandFilter);
  }, [brandFilter]);

  useEffect(() => {
    api.products.categories().then(setCategoriesList).catch(console.error);
    api.products.brands().then(setBrandsList).catch(console.error);
  }, []);

  useEffect(() => {
    let isMounted = true;

    // 1. Instantly update UI using local data cache (0ms lag, zero flash)
    const localFiltered = filterLocalProducts({
      category: selectedCategory,
      brand: selectedBrand,
      search: searchQuery,
      minPrice: priceMin,
      maxPrice: priceMax,
      inStock: inStockOnly,
      sort: sortBy,
      sale: saleFilter,
    });
    setProductsList(localFiltered);

    // Only show full loading block if we truly have 0 cached products
    if (localFiltered.length === 0 && !selectedCategory && !selectedBrand && !searchQuery) {
      setIsLoading(true);
    }

    const sortMap: Record<string, string> = {
      price_asc: 'price-asc',
      price_desc: 'price-desc',
      rating: 'rating',
      newest: 'newest',
      popular: 'discount',
    };

    // 2. Fetch fresh updates from API silently in the background
    api.products
      .list({
        category: selectedCategory || undefined,
        brand: selectedBrand || undefined,
        search: searchQuery || undefined,
        minPrice: priceMin ? Number(priceMin) : undefined,
        maxPrice: priceMax ? Number(priceMax) : undefined,
        inStock: inStockOnly ? true : undefined,
        sort: sortMap[sortBy] || sortBy,
      })
      .then(res => {
        if (isMounted) {
          let list = res.products;
          if (saleFilter) {
            list = list.filter(p => p.discount > 0);
          }
          if (list && list.length > 0) {
            setProductsList(list);
          }
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.warn('Backend sync notice (using cached catalog):', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedBrand, searchQuery, priceMin, priceMax, inStockOnly, sortBy, saleFilter]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceMin('');
    setPriceMax('');
    setInStockOnly(false);
    setSearchParams({});
  };

  const handlePriceTier = (min: string, max: string) => {
    if (priceMin === min && priceMax === max) {
      setPriceMin('');
      setPriceMax('');
    } else {
      setPriceMin(min);
      setPriceMax(max);
    }
  };

  const hasActiveFilters = Boolean(
    selectedCategory || selectedBrand || priceMin || priceMax || inStockOnly || searchQuery || saleFilter
  );

  const activeCategoryTitle = selectedCategory
    ? categoryNameMap[selectedCategory] || selectedCategory
    : saleFilter
    ? 'ទំនិញប្រូម៉ូសិនពិសេស'
    : 'ទំនិញទាំងអស់';

  const renderFilterContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <SlidersIcon size={16} />
          </div>
          <div>
            <h3 className="font-extrabold text-[16px] text-slate-900 leading-tight">ចម្រាញ់ទំនិញ</h3>
            <span className="text-[11px] text-slate-400 font-medium">ស្វែងរកតាមតម្រូវការ</span>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            title="សម្អាតការជ្រើសរើស"
          >
            <RotateCcwIcon size={12} />
            <span>សម្អាត</span>
          </button>
        )}
      </div>

      {/* Filter Group 1: Category */}
      <div>
        <h4 className="text-[14px] font-bold text-slate-900 mb-3 flex items-center justify-between">
          <span>ប្រភេទទំនិញ</span>
          {selectedCategory && (
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              1 ជ្រើសរើស
            </span>
          )}
        </h4>
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {/* All categories button */}
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] transition-all cursor-pointer ${
              selectedCategory === ''
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20'
                : 'text-slate-700 hover:bg-slate-50 font-semibold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🛍️</span>
              <span>ទំនិញទាំងអស់</span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                selectedCategory === '' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {categoriesList.reduce((acc, c) => acc + c.count, 0)}
            </span>
          </button>

          {categoriesList.map(c => {
            const isSelected = selectedCategory === c.category;
            return (
              <button
                key={c.category}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? '' : c.category)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20'
                    : 'text-slate-700 hover:bg-slate-50 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span>{getCategoryIcon(c.category)}</span>
                  <span className="truncate">{c.categoryKh}</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Group 2: Brands Chips */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-[14px] font-bold text-slate-900 mb-3 flex items-center justify-between">
          <span>ម៉ាកយីហោ (Brands)</span>
          {selectedBrand && (
            <button
              onClick={() => setSelectedBrand('')}
              className="text-[11px] font-semibold text-rose-500 hover:underline"
            >
              លុប
            </button>
          )}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {brandsList.map(b => {
            const isSelected = selectedBrand === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBrand(isSelected ? '' : b)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                    : 'bg-slate-50 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Group 3: Price Tiers & Range */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-[14px] font-bold text-slate-900 mb-2.5">កម្រិតតម្លៃ ($)</h4>

        {/* Quick price chips */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {[
            { label: '< $200', min: '0', max: '200' },
            { label: '$200 - $600', min: '200', max: '600' },
            { label: '$600 - $1200', min: '600', max: '1200' },
            { label: '> $1200', min: '1200', max: '5000' },
          ].map(tier => {
            const active = priceMin === tier.min && priceMax === tier.max;
            return (
              <button
                key={tier.label}
                type="button"
                onClick={() => handlePriceTier(tier.min, tier.max)}
                className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer ${
                  active
                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tier.label}
              </button>
            );
          })}
        </div>

        {/* Custom price inputs */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              $
            </span>
            <input
              type="number"
              placeholder="ទាបបំផុត"
              value={priceMin}
              onChange={e => setPriceMin(e.target.value)}
              className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <span className="text-slate-300 font-bold">-</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              $
            </span>
            <input
              type="number"
              placeholder="ខ្ពស់បំផុត"
              value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
        </div>
      </div>

      {/* Filter Group 4: Stock Status Toggle Card */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[13.5px] font-bold text-slate-800">មានក្នុងស្តុកស្រាប់</span>
          </div>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
            className="w-4.5 h-4.5 rounded accent-blue-600 cursor-pointer"
          />
        </label>
      </div>

      {/* Reset All Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full py-2.5 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-[13.5px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcwIcon size={14} />
          <span>លុបការចម្រាញ់ទាំងអស់</span>
        </button>
      )}
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
      {/* 1. BREADCRUMBS WITH MODERN ICONS */}
      <nav className="flex items-center gap-2 text-xs sm:text-[14px] text-slate-500 mb-4 sm:mb-6 flex-wrap">
        <Link to="/" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
          <HomeIcon size={15} />
          <span>ទំព័រដើម</span>
        </Link>
        <span className="text-slate-300">/</span>
        <Link to="/shop" className="hover:text-blue-600 transition-colors">
          ហាងទំនិញ
        </Link>
        {selectedCategory && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-lg">
              {categoryNameMap[selectedCategory] || selectedCategory}
            </span>
          </>
        )}
        {selectedBrand && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">{selectedBrand}</span>
          </>
        )}
        {searchQuery && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-blue-600 font-semibold">
              លទ្ធផលសម្រាប់ &ldquo;{searchQuery}&rdquo;
            </span>
          </>
        )}
      </nav>

      {/* Mobile / Tablet Filter Button Bar */}
      <div className="lg:hidden flex items-center gap-2.5 mb-4">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex-1 py-2.5 px-4 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-800 shadow-xs active:bg-slate-50 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <SlidersIcon size={16} className="text-blue-600" />
            <span>ចម្រាញ់ទំនិញ</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            )}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${hasActiveFilters ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {hasActiveFilters ? 'សកម្ម' : 'ជ្រើសរើស'}
          </span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="p-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center cursor-pointer"
            title="លុបការចម្រាញ់"
          >
            <RotateCcwIcon size={15} />
          </button>
        )}
      </div>

      {/* Mobile Slide-Over Drawer for Filters */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <SlidersIcon size={18} className="text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">ចម្រាញ់ទំនិញ</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {renderFilterContent()}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="py-2.5 px-3.5 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold"
                >
                  សម្អាត
                </button>
              )}
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
              >
                មើលទំនិញ ({productsList.length})
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-7">
        {/* 2. DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5.5 space-y-6 shadow-sm sticky top-28">
            {renderFilterContent()}
          </div>
        </aside>

        {/* 3. PRODUCTS CONTENT AREA */}
        <div className="flex-1 min-w-0">
          {/* Header Bar */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 mb-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {activeCategoryTitle}
                </h1>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  {isLoading ? 'កំពុងស្វែងរក...' : `រកឃើញ ${productsList.length} មុខទំនិញ`}
                </p>
              </div>

              {/* Sort & View Mode */}
              <div className="flex items-center gap-2.5">
                {/* Sort dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl pl-3.5 pr-8 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="newest">ទំនិញថ្មីបំផុត</option>
                    <option value="popular">ពេញនិយមបំផុត</option>
                    <option value="price_asc">តម្លៃ: ទាបទៅខ្ពស់</option>
                    <option value="price_desc">តម្លៃ: ខ្ពស់ទៅទាប</option>
                    <option value="rating">ការវាយតម្លៃខ្ពស់</option>
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDownIcon size={13} />
                  </div>
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Grid View"
                  >
                    <GridIcon size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="List View"
                  >
                    <span className="text-base leading-none">☰</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Tags Row */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium">ការចម្រាញ់៖</span>

                {selectedCategory && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                    <span>{categoryNameMap[selectedCategory] || selectedCategory}</span>
                    <button onClick={() => setSelectedCategory('')} className="hover:text-blue-900">
                      <XIcon size={12} />
                    </button>
                  </span>
                )}

                {selectedBrand && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    <span>{selectedBrand}</span>
                    <button onClick={() => setSelectedBrand('')} className="hover:text-slate-900">
                      <XIcon size={12} />
                    </button>
                  </span>
                )}

                {(priceMin || priceMax) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <span>${priceMin || '0'} - ${priceMax || '∞'}</span>
                    <button
                      onClick={() => {
                        setPriceMin('');
                        setPriceMax('');
                      }}
                      className="hover:text-amber-900"
                    >
                      <XIcon size={12} />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span>មានក្នុងស្តុក</span>
                    <button onClick={() => setInStockOnly(false)} className="hover:text-emerald-900">
                      <XIcon size={12} />
                    </button>
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                    <span>ស្វែងរក: &ldquo;{searchQuery}&rdquo;</span>
                    <Link to="/shop" className="hover:text-indigo-900">
                      <XIcon size={12} />
                    </Link>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-rose-600 hover:underline ml-1"
                >
                  សម្អាតទាំងអស់
                </button>
              </div>
            )}
          </div>

          {/* Products Grid / List Display */}
          {isLoading && productsList.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">កំពុងទាញយកទិន្នន័យទំនិញ...</span>
            </div>
          ) : productsList.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mx-auto mb-4 text-slate-400">
                🔍
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">រកមិនឃើញទំនិញឡើយ</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                មិនមានទំនិញត្រូវនឹងលក្ខខណ្ឌចម្រាញ់របស់អ្នកទេ។ សូមសាកល្បងប្តូរលក្ខខណ្ឌស្វែងរក។
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                សម្អាតការចម្រាញ់ទាំងអស់
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5 animate-fade-in'
                  : 'space-y-3 sm:space-y-4 animate-fade-in'
              }
            >
              {productsList.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
