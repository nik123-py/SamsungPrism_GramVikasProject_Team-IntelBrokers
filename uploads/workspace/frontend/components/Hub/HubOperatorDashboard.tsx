import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import { hubsAPI, ordersAPI, analyticsAPI } from '../../lib/api';
import StatsChart from '../Charts/StatsChart';
import {
  ClipboardDocumentListIcon,
  TruckIcon,
  ScaleIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface HubStats {
  pendingQualityChecks: number;
  completedQualityChecks: number;
  totalInventory: number;
  scheduledPickups: number;
  dailyThroughput: Array<{ name: string; value: number }>;
  qualityGrades: Array<{ name: string; value: number }>;
}

interface QualityCheckOrder {
  order_id: string;
  product_name: string;
  quantity: number;
  farmer_name: string;
  buyer_name: string;
  status: string;
  pickup_date: string;
  priority: 'high' | 'medium' | 'low';
}

function HubOperatorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<HubStats | null>(null);
  const [pendingOrders, setPendingOrders] = useState<QualityCheckOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load hub statistics
      const statsResponse = await analyticsAPI.getUserStats(user?.user_id || '', {
        role: 'hub_operator'
      });
      
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      // Load pending quality check orders
      const ordersResponse = await ordersAPI.getOrders({
        status: 'picked_up',
        limit: 10
      });
      
      if (ordersResponse.data.success) {
        setPendingOrders(ordersResponse.data.data.orders);
      }

    } catch (error) {
      console.error('Failed to load hub dashboard data:', error);
      // Mock data for development
      setStats({
        pendingQualityChecks: 12,
        completedQualityChecks: 156,
        totalInventory: 2500,
        scheduledPickups: 8,
        dailyThroughput: [
          { name: 'Mon', value: 450 },
          { name: 'Tue', value: 520 },
          { name: 'Wed', value: 380 },
          { name: 'Thu', value: 610 },
          { name: 'Fri', value: 490 },
          { name: 'Sat', value: 340 },
          { name: 'Sun', value: 280 },
        ],
        qualityGrades: [
          { name: 'Grade A', value: 65 },
          { name: 'Grade B', value: 25 },
          { name: 'Grade C', value: 10 },
        ]
      });
      
      setPendingOrders([
        {
          order_id: '1',
          product_name: 'Basmati Rice',
          quantity: 100,
          farmer_name: 'Rajesh Kumar',
          buyer_name: 'Fresh Foods Ltd',
          status: 'picked_up',
          pickup_date: '2024-01-15T09:00:00Z',
          priority: 'high'
        },
        {
          order_id: '2',
          product_name: 'Fresh Tomatoes',
          quantity: 50,
          farmer_name: 'Sunita Devi',
          buyer_name: 'Local Market',
          status: 'picked_up',
          pickup_date: '2024-01-15T10:30:00Z',
          priority: 'medium'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (priority) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      default:
        return <ClipboardDocumentListIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleQualityCheck = (orderId: string) => {
    router.push(`/hub/quality-check/${orderId}`);
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
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Hub Operations Center</h2>
        <p className="text-purple-100">
          Manage quality checks, coordinate pickups, and maintain inventory efficiently.
        </p>
        <div className="mt-4 flex space-x-3">
          <Link
            href="/hub/quality-check"
            className="inline-flex items-center px-4 py-2 bg-white text-purple-600 rounded-md hover:bg-purple-50 font-medium"
          >
            <ScaleIcon className="h-5 w-5 mr-2" />
            Quality Check
          </Link>
          <Link
            href="/hub/schedule"
            className="inline-flex items-center px-4 py-2 bg-purple-400 text-white rounded-md hover:bg-purple-500 font-medium"
          >
            <TruckIcon className="h-5 w-5 mr-2" />
            Schedule Pickup
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Quality Checks
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.pendingQualityChecks}
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
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Checks
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.completedQualityChecks}
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
                <ScaleIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Inventory (kg)
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.totalInventory?.toLocaleString() || '0'}
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
                    Scheduled Pickups
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.scheduledPickups}
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
          data={stats?.dailyThroughput || []}
          type="bar"
          title="Daily Throughput (kg)"
          height={300}
        />
        <StatsChart
          data={stats?.qualityGrades || []}
          type="pie"
          title="Quality Grade Distribution"
          height={300}
        />
      </div>

      {/* Pending Quality Checks */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Pending Quality Checks
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Orders waiting for quality inspection and grading
            </p>
          </div>
          <Link
            href="/hub/quality-check"
            className="btn-primary text-sm"
          >
            View All
          </Link>
        </div>
        <ul className="divide-y divide-gray-200">
          {pendingOrders.map((order) => (
            <li key={order.order_id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getPriorityIcon(order.priority)}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {order.product_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.quantity} kg • From {order.farmer_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Buyer: {order.buyer_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={getPriorityBadge(order.priority)}>
                        {order.priority} priority
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Picked up: {new Date(order.pickup_date).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleQualityCheck(order.order_id)}
                      className="btn-primary text-sm"
                    >
                      Start QC
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Today's Schedule
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <TruckIcon className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Pickup Route A</p>
                  <p className="text-sm text-gray-500">8:00 AM - 12:00 PM</p>
                </div>
              </div>
              <span className="text-sm text-yellow-600 font-medium">5 stops</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <ScaleIcon className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Quality Check Session</p>
                  <p className="text-sm text-gray-500">2:00 PM - 5:00 PM</p>
                </div>
              </div>
              <span className="text-sm text-blue-600 font-medium">12 orders</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Dispatch Preparation</p>
                  <p className="text-sm text-gray-500">5:30 PM - 7:00 PM</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">8 orders</span>
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
              href="/hub/quality-check"
              className="btn-primary text-center"
            >
              Quality Check
            </Link>
            <Link
              href="/hub/inventory"
              className="btn-secondary text-center"
            >
              Manage Inventory
            </Link>
            <Link
              href="/hub/schedule"
              className="btn-secondary text-center"
            >
              Pickup Schedule
            </Link>
            <Link
              href="/hub/reports"
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

export default HubOperatorDashboard;