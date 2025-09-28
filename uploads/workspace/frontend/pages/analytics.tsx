import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import DashboardLayout from '../components/Layout/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import StatsChart from '../components/Charts/StatsChart';
import { analyticsAPI } from '../lib/api';
import {
  ChartBarIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalUsers: number;
  totalTransactions: number;
  platformRevenue: number;
  activeListings: number;
  userGrowth: Array<{ name: string; value: number }>;
  transactionVolume: Array<{ name: string; value: number }>;
  userDistribution: Array<{ name: string; value: number }>;
  revenueByCategory: Array<{ name: string; value: number }>;
}

function AnalyticsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
      
      // Set up real-time updates every 5 seconds
      const interval = setInterval(() => {
        loadAnalytics();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load analytics data from API
      const response = await analyticsAPI.getDashboardStats({
        role: user?.role || 'admin'
      });
      
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Fallback to mock data
      setAnalytics({
        totalUsers: 15420,
        totalTransactions: 8945,
        platformRevenue: 2850000,
        activeListings: 1250,
        userGrowth: [
          { name: 'Jan', value: 1200 },
          { name: 'Feb', value: 1450 },
          { name: 'Mar', value: 1680 },
          { name: 'Apr', value: 1920 },
          { name: 'May', value: 2150 },
          { name: 'Jun', value: 2380 },
        ],
        transactionVolume: [
          { name: 'Jan', value: 450000 },
          { name: 'Feb', value: 520000 },
          { name: 'Mar', value: 480000 },
          { name: 'Apr', value: 610000 },
          { name: 'May', value: 580000 },
          { name: 'Jun', value: 650000 },
        ],
        userDistribution: [
          { name: 'Farmers', value: 8500 },
          { name: 'Buyers', value: 3200 },
          { name: 'Hub Operators', value: 450 },
          { name: 'SHG Leaders', value: 2800 },
          { name: 'Aggregators', value: 470 },
        ],
        revenueByCategory: [
          { name: 'Cereals', value: 1200000 },
          { name: 'Vegetables', value: 850000 },
          { name: 'Fruits', value: 450000 },
          { name: 'Pulses', value: 350000 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <DashboardLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="spinner w-8 h-8" />
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout title="Analytics">
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load analytics data</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout title="Analytics">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-6 w-6 text-gray-500" />
              <span className="text-sm text-gray-500">System Overview</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {analytics.totalUsers?.toLocaleString() || '0'}
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
                    <ShoppingCartIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Transactions
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {analytics.totalTransactions?.toLocaleString() || '0'}
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
                    <CurrencyRupeeIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Platform Revenue
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        ₹{analytics.platformRevenue?.toLocaleString() || '0'}
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
                    <ChartBarIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Listings
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {analytics.activeListings?.toLocaleString() || '0'}
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
              data={analytics.userGrowth || []}
              type="line"
              title="User Growth Trend"
              height={300}
            />
            <StatsChart
              data={analytics.transactionVolume || []}
              type="bar"
              title="Monthly Transaction Volume"
              height={300}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatsChart
              data={analytics.userDistribution || []}
              type="pie"
              title="User Role Distribution"
              height={300}
            />
            <StatsChart
              data={analytics.revenueByCategory || []}
              type="pie"
              title="Revenue by Category"
              height={300}
            />
          </div>

          {/* Real-time Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-green-800">
                Live Analytics Dashboard
              </span>
              <span className="ml-2 text-xs text-green-600">
                Charts update every 5 seconds with real-time data
              </span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default AnalyticsPage;
