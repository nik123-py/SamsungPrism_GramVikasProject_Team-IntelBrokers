import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import { marketplaceAPI, ordersAPI, analyticsAPI } from '../../lib/api';
import StatsChart from '../Charts/StatsChart';
import {
  CurrencyRupeeIcon,
  ShoppingCartIcon,
  TruckIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface BuyerStats {
  totalSpent: number;
  activeOrders: number;
  completedPurchases: number;
  savedListings: number;
  monthlySpending: Array<{ name: string; value: number }>;
  categorySpending: Array<{ name: string; value: number }>;
}

interface Order {
  order_id: string;
  product_name: string;
  quantity: number;
  agreed_price: number;
  status: string;
  farmer_name: string;
  village_name: string;
  created_at: string;
  pickup_date?: string;
}

function BuyerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<BuyerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
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
      
      // Load buyer statistics
      const statsResponse = await analyticsAPI.getUserStats(user?.user_id || '', {
        role: 'buyer'
      });
      
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      // Load recent orders
      const ordersResponse = await ordersAPI.getOrders({
        limit: 5,
        page: 1
      });
      
      if (ordersResponse.data.success) {
        setRecentOrders(ordersResponse.data.data.orders);
      }

    } catch (error) {
      console.error('Failed to load buyer dashboard data:', error);
      // Mock data for development
      setStats({
        totalSpent: 285000,
        activeOrders: 5,
        completedPurchases: 42,
        savedListings: 12,
        monthlySpending: [
          { name: 'Jan', value: 45000 },
          { name: 'Feb', value: 52000 },
          { name: 'Mar', value: 38000 },
          { name: 'Apr', value: 61000 },
          { name: 'May', value: 48000 },
          { name: 'Jun', value: 41000 },
        ],
        categorySpending: [
          { name: 'Cereals', value: 120000 },
          { name: 'Vegetables', value: 85000 },
          { name: 'Fruits', value: 45000 },
          { name: 'Pulses', value: 35000 },
        ]
      });
      
      setRecentOrders([
        {
          order_id: '1',
          product_name: 'Basmati Rice',
          quantity: 100,
          agreed_price: 2400,
          status: 'confirmed',
          farmer_name: 'Rajesh Kumar',
          village_name: 'Khetri',
          created_at: '2024-01-15T10:30:00Z',
          pickup_date: '2024-01-18T09:00:00Z'
        },
        {
          order_id: '2',
          product_name: 'Fresh Onions',
          quantity: 200,
          agreed_price: 35,
          status: 'quality_checked',
          farmer_name: 'Sunita Devi',
          village_name: 'Rampur',
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
      case 'confirmed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'picked_up':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'quality_checked':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'delivered':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <ClockIcon className="h-4 w-4" />;
      case 'delivered':
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ShoppingCartIcon className="h-4 w-4" />;
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
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-blue-100">
          Discover fresh produce, manage your orders, and build supplier relationships.
        </p>
        <div className="mt-4">
          <Link
            href="/marketplace"
            className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 font-medium"
          >
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            Browse Marketplace
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyRupeeIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Spent
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    ₹{stats?.totalSpent?.toLocaleString() || '0'}
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
                <ShoppingCartIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Orders
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.activeOrders}
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
                <TruckIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Purchases
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.completedPurchases}
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
                <EyeIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Saved Listings
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.savedListings}
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
          data={stats?.monthlySpending || []}
          type="bar"
          title="Monthly Spending"
          height={300}
        />
        <StatsChart
          data={stats?.categorySpending || []}
          type="pie"
          title="Category-wise Spending"
          height={300}
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Orders
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Track your recent purchases and their status
            </p>
          </div>
          <Link
            href="/orders"
            className="btn-secondary text-sm"
          >
            View All Orders
          </Link>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentOrders.map((order) => (
            <li key={order.order_id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getStatusIcon(order.status)}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {order.product_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.quantity} units • ₹{order.agreed_price.toLocaleString()} per unit
                      </p>
                      <p className="text-sm text-gray-500">
                        From {order.farmer_name}, {order.village_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={getStatusBadge(order.status)}>
                        {order.status.replace('_', ' ')}
                      </span>
                      {order.pickup_date && (
                        <p className="text-sm text-gray-500 mt-1">
                          Pickup: {new Date(order.pickup_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{(order.agreed_price * order.quantity).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/orders/${order.order_id}`)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Market Insights */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Market Insights
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900">Price Alert</h4>
              <p className="text-sm text-green-700 mt-1">
                Basmati Rice prices dropped 5% this week
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900">New Suppliers</h4>
              <p className="text-sm text-blue-700 mt-1">
                3 new farmers joined in your area
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900">Seasonal Alert</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Fresh vegetables harvest season starting
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/marketplace"
              className="btn-primary text-center"
            >
              Browse Products
            </Link>
            <Link
              href="/marketplace/search?category=vegetables"
              className="btn-secondary text-center"
            >
              Fresh Vegetables
            </Link>
            <Link
              href="/orders"
              className="btn-secondary text-center"
            >
              Track Orders
            </Link>
            <Link
              href="/suppliers"
              className="btn-secondary text-center"
            >
              Find Suppliers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;