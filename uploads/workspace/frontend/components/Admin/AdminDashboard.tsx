import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import { analyticsAPI } from '../../lib/api';
import StatsChart from '../Charts/StatsChart';
import {
  UserGroupIcon,
  CurrencyRupeeIcon,
  ShoppingCartIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  platformRevenue: number;
  activeListings: number;
  userGrowth: Array<{ name: string; value: number }>;
  transactionVolume: Array<{ name: string; value: number }>;
  userDistribution: Array<{ name: string; value: number }>;
  revenueByCategory: Array<{ name: string; value: number }>;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
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
      
      // Load admin statistics
      const statsResponse = await analyticsAPI.getDashboardStats({
        role: 'admin'
      });
      
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

    } catch (error) {
      console.error('Failed to load admin dashboard data:', error);
      // Mock data for development
      setStats({
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
      
      setAlerts([
        {
          id: '1',
          type: 'error',
          title: 'Payment Gateway Issue',
          description: 'Some transactions are failing due to gateway timeout',
          timestamp: '2024-01-15T10:30:00Z',
          resolved: false
        },
        {
          id: '2',
          type: 'warning',
          title: 'High Server Load',
          description: 'API response times are above normal thresholds',
          timestamp: '2024-01-15T09:15:00Z',
          resolved: false
        },
        {
          id: '3',
          type: 'info',
          title: 'New Hub Registration',
          description: '5 new aggregation hubs registered this week',
          timestamp: '2024-01-14T16:45:00Z',
          resolved: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertBadge = (type: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (type) {
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'info':
        return `${baseClasses} bg-blue-100 text-blue-800`;
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
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Platform Administration</h2>
        <p className="text-indigo-100">
          Monitor platform performance, manage users, and ensure system reliability.
        </p>
        <div className="mt-4 flex space-x-3">
          <Link
            href="/admin/users"
            className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 font-medium"
          >
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Manage Users
          </Link>
          <Link
            href="/admin/analytics"
            className="inline-flex items-center px-4 py-2 bg-indigo-400 text-white rounded-md hover:bg-indigo-500 font-medium"
          >
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
            View Analytics
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
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
                    {stats?.totalUsers?.toLocaleString() || '0'}
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
                    {stats?.totalTransactions?.toLocaleString() || '0'}
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
                    ₹{stats?.platformRevenue?.toLocaleString() || '0'}
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
                <MapPinIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Listings
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.activeListings?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              System Alerts
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Monitor system health and resolve issues
            </p>
          </div>
          <Link
            href="/admin/alerts"
            className="btn-secondary text-sm"
          >
            View All Alerts
          </Link>
        </div>
        <ul className="divide-y divide-gray-200">
          {alerts.map((alert) => (
            <li key={alert.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {alert.description}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={getAlertBadge(alert.type)}>
                      {alert.type}
                    </span>
                    {!alert.resolved && (
                      <button className="btn-primary text-sm">
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart
          data={stats?.userGrowth || []}
          type="line"
          title="User Growth Trend"
          height={300}
        />
        <StatsChart
          data={stats?.transactionVolume || []}
          type="bar"
          title="Monthly Transaction Volume"
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart
          data={stats?.userDistribution || []}
          type="pie"
          title="User Role Distribution"
          height={300}
        />
        <StatsChart
          data={stats?.revenueByCategory || []}
          type="pie"
          title="Revenue by Category"
          height={300}
        />
      </div>

      {/* Platform Health */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Platform Health
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-900">API Status</p>
                  <p className="text-sm text-green-700">Operational</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-900">Database</p>
                  <p className="text-sm text-green-700">Healthy</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-6 w-6 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">SMS Service</p>
                  <p className="text-sm text-yellow-700">Degraded</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-900">Payment Gateway</p>
                  <p className="text-sm text-green-700">Operational</p>
                </div>
              </div>
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
              href="/admin/users"
              className="btn-primary text-center"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/villages"
              className="btn-secondary text-center"
            >
              Manage Villages
            </Link>
            <Link
              href="/admin/hubs"
              className="btn-secondary text-center"
            >
              Manage Hubs
            </Link>
            <Link
              href="/admin/reports"
              className="btn-secondary text-center"
            >
              Generate Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;