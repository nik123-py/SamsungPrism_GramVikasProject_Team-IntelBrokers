import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import { marketplaceAPI } from '../../lib/api';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CurrencyRupeeIcon,
  ScaleIcon,
  TagIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Listing {
  listing_id: string;
  product_name: string;
  product_category: string;
  product_unit: string;
  quantity: number;
  quality_grade: string;
  asking_price: number;
  description: string;
  status: 'active' | 'sold' | 'draft' | 'expired';
  total_bids: number;
  highest_bid?: number;
  created_at: string;
  photos: string[];
}

function MyListings() {
  const { user } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'sold' | 'draft'>('all');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const response = await marketplaceAPI.getMyListings();
      
      if (response.data.success) {
        setListings(response.data.data.listings);
      } else {
        // Mock data for development
        setListings([
          {
            listing_id: 'list1',
            product_name: 'Fresh Tomatoes',
            product_category: 'vegetables',
            product_unit: 'kg',
            quantity: 100,
            quality_grade: 'A',
            asking_price: 50,
            description: 'Fresh organic tomatoes from our farm',
            status: 'active',
            total_bids: 5,
            highest_bid: 55,
            created_at: new Date().toISOString(),
            photos: []
          },
          {
            listing_id: 'list2',
            product_name: 'Organic Wheat',
            product_category: 'cereals',
            product_unit: 'quintal',
            quantity: 50,
            quality_grade: 'Organic',
            asking_price: 2000,
            description: 'Premium organic wheat',
            status: 'active',
            total_bids: 2,
            highest_bid: 2100,
            created_at: new Date().toISOString(),
            photos: []
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const response = await marketplaceAPI.deleteListing(listingId);
      if (response.data.success) {
        toast.success('Listing deleted successfully');
        loadListings();
      } else {
        toast.error('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    return listing.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['farmer']}>
        <DashboardLayout title="My Listings">
          <div className="flex items-center justify-center h-64">
            <div className="spinner w-8 h-8" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <DashboardLayout title="My Listings">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your product listings and track their performance.
              </p>
            </div>
            <Link
              href="/listings/create"
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Listing
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Listings', count: listings.length },
                { key: 'active', label: 'Active', count: listings.filter(l => l.status === 'active').length },
                { key: 'sold', label: 'Sold', count: listings.filter(l => l.status === 'sold').length },
                { key: 'draft', label: 'Draft', count: listings.filter(l => l.status === 'draft').length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'Get started by creating your first listing.'
                  : `No ${filter} listings found.`
                }
              </p>
              {filter === 'all' && (
                <div className="mt-6">
                  <Link
                    href="/listings/create"
                    className="btn-primary"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create New Listing
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div key={listing.listing_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Product Image */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {listing.photos && listing.photos.length > 0 ? (
                      <img
                        src={listing.photos[0]}
                        alt={listing.product_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <TagIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {listing.product_name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {listing.product_category}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <ScaleIcon className="h-4 w-4 mr-2" />
                        {listing.quantity} {listing.product_unit}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CurrencyRupeeIcon className="h-4 w-4 mr-2" />
                        ₹{listing.asking_price} per {listing.product_unit}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {formatDate(listing.created_at)}
                      </div>
                    </div>

                    {/* Bids Info */}
                    {listing.total_bids > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                          <strong>{listing.total_bids}</strong> bids received
                          {listing.highest_bid && (
                            <span className="ml-2">
                              Highest: ₹{listing.highest_bid}
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex space-x-2">
                      <Link
                        href={`/listings/${listing.listing_id}`}
                        className="flex-1 btn-outline flex items-center justify-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Link>
                      <Link
                        href={`/listings/${listing.listing_id}/edit`}
                        className="flex-1 btn-outline flex items-center justify-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(listing.listing_id)}
                        className="btn-outline text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default MyListings;
