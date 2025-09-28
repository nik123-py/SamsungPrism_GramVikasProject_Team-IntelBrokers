import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import { marketplaceAPI } from '../../lib/api';
import {
  CurrencyRupeeIcon,
  ClockIcon,
  UserIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Bid {
  bid_id: string;
  bidder_name: string;
  bid_price: number;
  bid_quantity: number;
  created_at: string;
  status: string;
}

interface BidForm {
  bid_price: number;
  bid_quantity: number;
  message?: string;
}

interface BiddingInterfaceProps {
  listingId: string;
  currentPrice: number;
  availableQuantity: number;
  unit: string;
  timeRemaining?: string;
  onBidPlaced?: () => void;
}

const BiddingInterface = ({
  listingId,
  currentPrice,
  availableQuantity,
  unit,
  timeRemaining,
  onBidPlaced
}: BiddingInterfaceProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBids, setLoadingBids] = useState(true);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<BidForm>();

  const watchedPrice = watch('bid_price');
  const watchedQuantity = watch('bid_quantity');

  useEffect(() => {
    loadBids();
    // Set up real-time updates (WebSocket would be implemented here)
    const interval = setInterval(loadBids, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [listingId]);

  const loadBids = async () => {
    try {
      setLoadingBids(true);
      const response = await marketplaceAPI.getBids(listingId, {
        limit: 10,
        sort: 'created_at',
        order: 'desc'
      });
      
      if (response.data.success) {
        setBids(response.data.data.bids);
      }
    } catch (error) {
      console.error('Failed to load bids:', error);
      // Mock data for development
      setBids([
        {
          bid_id: '1',
          bidder_name: 'Fresh Foods Ltd',
          bid_price: currentPrice + 50,
          bid_quantity: Math.min(availableQuantity, 100),
          created_at: '2024-01-15T10:30:00Z',
          status: 'active'
        },
        {
          bid_id: '2',
          bidder_name: 'Local Market',
          bid_price: currentPrice + 25,
          bid_quantity: Math.min(availableQuantity, 75),
          created_at: '2024-01-15T09:15:00Z',
          status: 'active'
        }
      ]);
    } finally {
      setLoadingBids(false);
    }
  };

  const onSubmit = async (data: BidForm) => {
    if (!user || (user.role !== 'buyer' && user.role !== 'aggregator')) {
      toast.error('Only buyers and aggregators can place bids');
      return;
    }

    try {
      setLoading(true);
      const response = await marketplaceAPI.createBid(listingId, {
        bid_price: data.bid_price,
        bid_quantity: data.bid_quantity,
        message: data.message
      });

      if (response.data.success) {
        toast.success('Bid placed successfully!');
        loadBids(); // Refresh bids
        setValue('bid_price', 0);
        setValue('bid_quantity', 0);
        setValue('message', '');
        onBidPlaced?.();
      } else {
        toast.error(response.data.message || 'Failed to place bid');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  const getHighestBid = () => {
    if (bids.length === 0) return null;
    return bids.reduce((highest, bid) => 
      bid.bid_price > highest.bid_price ? bid : highest
    );
  };

  const getMinimumBid = () => {
    const highestBid = getHighestBid();
    return highestBid ? highestBid.bid_price + 1 : currentPrice;
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

  const highestBid = getHighestBid();
  const minimumBid = getMinimumBid();
  const totalValue = watchedPrice && watchedQuantity ? watchedPrice * watchedQuantity : 0;

  return (
    <div className="space-y-6">
      {/* Bidding Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CurrencyRupeeIcon className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-500">Current Price</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{currentPrice.toLocaleString()}/{unit}
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ArrowTrendingUpIcon className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-500">Highest Bid</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {highestBid ? `₹${highestBid.bid_price.toLocaleString()}` : 'No bids yet'}
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <UserIcon className="h-6 w-6 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-500">Total Bids</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{bids.length}</p>
          </div>
        </div>

        {timeRemaining && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                Time remaining: {timeRemaining}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Place Bid Form */}
      {user && (user.role === 'buyer' || user.role === 'aggregator') && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Bid Price (₹ per {unit}) *
                </label>
                <input
                  {...register('bid_price', {
                    required: 'Bid price is required',
                    min: {
                      value: minimumBid,
                      message: `Minimum bid is ₹${minimumBid}`
                    },
                    valueAsNumber: true
                  })}
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder={`Minimum: ₹${minimumBid}`}
                />
                {errors.bid_price && (
                  <p className="mt-1 text-sm text-red-600">{errors.bid_price.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Quantity ({unit}) *
                </label>
                <input
                  {...register('bid_quantity', {
                    required: 'Quantity is required',
                    min: {
                      value: 1,
                      message: 'Minimum quantity is 1'
                    },
                    max: {
                      value: availableQuantity,
                      message: `Maximum available: ${availableQuantity} ${unit}`
                    },
                    valueAsNumber: true
                  })}
                  type="number"
                  className="form-input"
                  placeholder={`Max: ${availableQuantity}`}
                />
                {errors.bid_quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.bid_quantity.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">Message (Optional)</label>
              <textarea
                {...register('message')}
                rows={3}
                className="form-input"
                placeholder="Add a message to the seller..."
              />
            </div>

            {totalValue > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-900">Total Bid Value:</span>
                  <span className="text-lg font-bold text-blue-900">
                    ₹{totalValue.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <>
                    <div className="spinner mr-2" />
                    Placing Bid...
                  </>
                ) : (
                  'Place Bid'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/marketplace/${listingId}`)}
                className="btn-secondary"
              >
                View Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Current Bids */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Bids</h3>
        </div>
        
        {loadingBids ? (
          <div className="p-6 text-center">
            <div className="spinner w-6 h-6 mx-auto" />
          </div>
        ) : bids.length === 0 ? (
          <div className="p-6 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No bids placed yet. Be the first to bid!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bids.map((bid, index) => (
              <div key={bid.bid_id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {bid.bidder_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {bid.bid_quantity} {unit} • {formatTimeAgo(bid.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{bid.bid_price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total: ₹{(bid.bid_price * bid.bid_quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {index === 0 && bids.length > 1 && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Highest Bid
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BiddingInterface;