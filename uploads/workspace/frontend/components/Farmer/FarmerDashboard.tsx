import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import { marketplaceAPI, analyticsAPI } from '../../lib/api';
import StatsChart from '../Charts/StatsChart';
import {
  CurrencyRupeeIcon,
  ShoppingCartIcon,
  TruckIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface FarmerStats {
  totalEarnings: number;
  activeListings: number;
  completedOrders: number;
  pendingOrders: number;
  monthlyEarnings: Array<{ name: string; value: number }>;
  cropDistribution: Array<{ name: string; value: number }>;
}

interface Listing {
  listing_id: string;
  product_name: string;
  quantity: number;
  asking_price: number;
  status: string;
  total_bids: number;
  highest_bid?: number;
  created_at: string;
}

function FarmerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<FarmerStats | null>(null);
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time updates every 5 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load farmer statistics
      const statsResponse = await analyticsAPI.getUserStats(user?.user_id || '', {
        role: 'farmer'
      });
      
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      // Load recent listings
      const listingsResponse = await marketplaceAPI.getMyListings({
        limit: 5,
        page: 1
      });
      
      if (listingsResponse.data.success) {
        setRecentListings(listingsResponse.data.data.listings);
      }

    } catch (error) {
      console.error('Failed to load farmer dashboard data:', error);
      // Mock data for development
      setStats({
        totalEarnings: 125000,
        activeListings: 8,
        completedOrders: 24,
        pendingOrders: 3,
        monthlyEarnings: [
          { name: 'Jan', value: 15000 },
          { name: 'Feb', value: 18000 },
          { name: 'Mar', value: 22000 },
          { name: 'Apr', value: 25000 },
          { name: 'May', value: 28000 },
          { name: 'Jun', value: 17000 },
        ],
        cropDistribution: [
          { name: 'Rice', value: 40 },
          { name: 'Wheat', value: 30 },
          { name: 'Vegetables', value: 20 },
          { name: 'Others', value: 10 },
        ]
      });
      
      setRecentListings([
        {
          listing_id: '1',
          product_name: 'Basmati Rice',
          quantity: 50,
          asking_price: 2500,
          status: 'active',
          total_bids: 3,
          highest_bid: 2600,
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          listing_id: '2',
          product_name: 'Fresh Tomatoes',
          quantity: 100,
          asking_price: 45,
          status: 'active',
          total_bids: 1,
          created_at: '2024-01-14T15:20:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'sold':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'expired':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-green-100">
          Manage your listings, track earnings, and grow your agricultural business.
        </p>
        <div className="mt-4">
          <Link
            href="/listings/create"
            className="inline-flex items-center px-4 py-2 bg-white text-green-600 rounded-md hover:bg-green-50 font-medium"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Listing
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyRupeeIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Earnings
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    ₹{stats?.totalEarnings?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCartIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Listings
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.activeListings}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TruckIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Orders
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.completedOrders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCartIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Orders
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.pendingOrders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart
          data={stats?.monthlyEarnings || []}
          type="line"
          title="Monthly Earnings Trend"
          height={300}
        />
        <StatsChart
          data={stats?.cropDistribution || []}
          type="pie"
          title="Crop Distribution"
          height={300}
        />
      </div>

      {/* Recent Listings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Listings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your latest product listings and their performance
            </p>
          </div>
          <Link
            href="/listings"
            className="btn-secondary text-sm"
          >
            View All
          </Link>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentListings.map((listing) => (
            <li key={listing.listing_id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ShoppingCartIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {listing.product_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {listing.quantity} units • ₹{listing.asking_price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={getStatusBadge(listing.status)}>
                        {listing.status}
                      </span>
                      {listing.total_bids > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {listing.total_bids} bid{listing.total_bids > 1 ? 's' : ''}
                          {listing.highest_bid && (
                            <span className="text-green-600 font-medium ml-2">
                              High: ₹{listing.highest_bid.toLocaleString()}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/listings/${listing.listing_id}`)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => router.push(`/listings/${listing.listing_id}/edit`)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/listings/create"
              className="btn-primary text-center"
            >
              Create New Listing
            </Link>
            <Link
              href="/marketplace"
              className="btn-secondary text-center"
            >
              Browse Market Prices
            </Link>
            <Link
              href="/orders"
              className="btn-secondary text-center"
            >
              View My Orders
            </Link>
            <Link
              href="/analytics"
              className="btn-secondary text-center"
            >
              Detailed Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;