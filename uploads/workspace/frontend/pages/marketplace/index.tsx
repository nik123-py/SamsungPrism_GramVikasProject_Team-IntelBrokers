import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { marketplaceAPI } from '../../lib/api';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface Listing {
  listing_id: string;
  product_name: string;
  product_category: string;
  product_unit: string;
  quantity: number;
  quality_grade: string;
  asking_price: number;
  farmer_name: string;
  village_name: string;
  district: string;
  state: string;
  hub_name?: string;
  total_bids: number;
  highest_bid?: number;
  created_at: string;
  photos: string[];
}

const MarketplacePage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'cereals',
    'vegetables',
    'fruits',
    'pulses',
    'spices',
    'oilseeds'
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    loadListings();
  }, [isAuthenticated, router, currentPage, selectedCategory, selectedLocation]);

  const loadListings = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: currentPage,
        limit: 20,
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedLocation) params.location = selectedLocation;
      if (priceRange.min) params.min_price = parseFloat(priceRange.min);
      if (priceRange.max) params.max_price = parseFloat(priceRange.max);

      const response = await marketplaceAPI.searchListings(params);
      
      if (response.data.success) {
        setListings(response.data.data.listings);
        setTotalPages(Math.ceil(response.data.data.total / 20));
      }
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadListings();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
    loadListings();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getQualityBadgeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout title="Marketplace">
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div>
              <label className="form-label">Search Products</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Search products..."
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="form-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="form-input"
                placeholder="District or State"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="form-label">Price Range (₹)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="form-input"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="form-input"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex space-x-3">
            <button onClick={handleSearch} className="btn-primary">
              Search
            </button>
            <button onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Quick Actions for Farmers */}
        {user?.role === 'farmer' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">
                  Ready to sell your produce?
                </h3>
                <p className="text-sm text-blue-700">
                  Create a listing and connect with buyers directly
                </p>
              </div>
              <Link href="/listings/create" className="btn-primary">
                Create Listing
              </Link>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="spinner w-8 h-8" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div key={listing.listing_id} className="bg-white shadow rounded-lg overflow-hidden">
                {/* Product Image */}
                <div className="h-48 bg-gray-200 relative">
                  {listing.photos && listing.photos.length > 0 ? (
                    <img
                      src={listing.photos[0]}
                      alt={listing.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  
                  {/* Quality Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityBadgeColor(listing.quality_grade)}`}>
                      Grade {listing.quality_grade}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {listing.product_name}
                    </h3>
                    <span className="text-sm text-gray-500 capitalize">
                      {listing.product_category}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {listing.village_name}, {listing.district}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-lg font-bold text-blue-600">
                      <CurrencyRupeeIcon className="h-5 w-5 mr-1" />
                      {listing.asking_price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        /{listing.product_unit}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {listing.quantity} {listing.product_unit}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>By {listing.farmer_name}</span>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {formatTimeAgo(listing.created_at)}
                    </div>
                  </div>

                  {/* Bidding Info */}
                  {listing.total_bids > 0 && (
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-600">
                        {listing.total_bids} bid{listing.total_bids > 1 ? 's' : ''}
                      </span>
                      {listing.highest_bid && (
                        <span className="text-green-600 font-medium">
                          Highest: ₹{listing.highest_bid.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/marketplace/${listing.listing_id}`}
                      className="flex-1 btn-secondary text-center text-sm"
                    >
                      View Details
                    </Link>
                    {(user?.role === 'buyer' || user?.role === 'aggregator') && (
                      <Link
                        href={`/marketplace/${listing.listing_id}/bid`}
                        className="flex-1 btn-primary text-center text-sm"
                      >
                        Place Bid
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <MagnifyingGlassIcon />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or check back later.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          page === currentPage
                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarketplacePage;