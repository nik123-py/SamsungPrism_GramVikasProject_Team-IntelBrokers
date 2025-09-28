import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import DashboardLayout from '../components/Layout/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import FarmerDashboard from '../components/Farmer/FarmerDashboard';
import BuyerDashboard from '../components/Buyer/BuyerDashboard';
import HubOperatorDashboard from '../components/Hub/HubOperatorDashboard';
import SHGLeaderDashboard from '../components/SHG/SHGLeaderDashboard';
import AdminDashboard from '../components/Admin/AdminDashboard';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const getDashboardTitle = () => {
    switch (user?.role) {
      case 'farmer':
        return 'Farmer Dashboard';
      case 'buyer':
      case 'aggregator':
        return 'Buyer Dashboard';
      case 'hub_operator':
        return 'Hub Operator Dashboard';
      case 'shg_leader':
        return 'SHG Leader Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'farmer':
        return <FarmerDashboard />;
      case 'buyer':
      case 'aggregator':
        return <BuyerDashboard />;
      case 'hub_operator':
        return <HubOperatorDashboard />;
      case 'shg_leader':
        return <SHGLeaderDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Welcome to Gram-Vikas</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your dashboard is being prepared. Please contact support if this persists.
            </p>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title={getDashboardTitle()}>
        {renderDashboard()}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;