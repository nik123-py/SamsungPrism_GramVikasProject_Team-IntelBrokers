import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import { shgAPI } from '../../lib/api';
import {
  UserGroupIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface SHGMember {
  id: string;
  name: string;
  phone: string;
  village: string;
  totalListings: number;
  totalSales: number;
  lastActive: string;
}

interface SHGStats {
  totalMembers: number;
  activeListings: number;
  totalSales: number;
  pendingOrders: number;
  monthlyRevenue: number;
}

function SHGLeaderDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<SHGMember[]>([]);
  const [stats, setStats] = useState<SHGStats>({
    totalMembers: 0,
    activeListings: 0,
    totalSales: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load SHG members
      const membersResponse = await shgAPI.getSHGMembers(user?.shg_id || '');
      if (membersResponse.data.success) {
        setMembers(membersResponse.data.data.members);
      }

      // Load SHG statistics
      const statsResponse = await shgAPI.getSHGStats(user?.shg_id || '');
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Mock data for development
      setMembers([
        {
          id: '1',
          name: 'Priya Sharma',
          phone: '+91 98765 43210',
          village: 'Village A',
          totalListings: 5,
          totalSales: 15000,
          lastActive: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          name: 'Sunita Devi',
          phone: '+91 98765 43211',
          village: 'Village B',
          totalListings: 3,
          totalSales: 8500,
          lastActive: '2024-01-14T15:20:00Z',
        },
        {
          id: '3',
          name: 'Meera Singh',
          phone: '+91 98765 43212',
          village: 'Village C',
          totalListings: 7,
          totalSales: 22000,
          lastActive: '2024-01-15T09:15:00Z',
        },
      ]);

      setStats({
        totalMembers: 3,
        activeListings: 15,
        totalSales: 45500,
        pendingOrders: 2,
        monthlyRevenue: 12500,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">SHG Leader Dashboard</h1>
        <p className="text-purple-100">
          Welcome back! Manage your Self Help Group and track member activities.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CurrencyRupeeIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalSales)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/marketplace')}
            className="btn-primary"
          >
            View Marketplace
          </button>
          <button
            onClick={() => router.push('/marketplace/create')}
            className="btn-secondary"
          >
            Create Listing
          </button>
          <button
            onClick={() => router.push('/orders')}
            className="btn-outline"
          >
            Manage Orders
          </button>
        </div>
      </div>

      {/* SHG Members */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">SHG Members</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {members.map((member) => (
            <div key={member.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.phone}</p>
                    <p className="text-xs text-gray-400">{member.village}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{member.totalListings}</p>
                      <p className="text-xs text-gray-500">Listings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(member.totalSales)}
                      </p>
                      <p className="text-xs text-gray-500">Sales</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(member.lastActive)}
                      </p>
                      <p className="text-xs text-gray-500">Last Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New listing created by Priya Sharma
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <CurrencyRupeeIcon className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Order completed - ₹2,500
                </p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Pending order requires attention
                </p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SHGLeaderDashboard;
