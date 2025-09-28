const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Mock data storage
let users = [];
let listings = [];
let bids = [];
let orders = [];
let villages = [];
let hubs = [];

// Initialize mock data
const initializeMockData = () => {
  // Mock users
  users = [
    {
      user_id: '1',
      mobile_number: '9876543210',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      role: 'farmer',
      village_id: '1',
      village_name: 'Village A',
      district: 'Test District',
      state: 'Test State',
      kyc_status: 'verified',
      language_preference: 'hi',
      shg_id: '1'
    },
    {
      user_id: '2',
      mobile_number: '9876543211',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      role: 'buyer',
      village_id: '2',
      village_name: 'Village B',
      district: 'Test District',
      state: 'Test State',
      kyc_status: 'verified',
      language_preference: 'en'
    },
    {
      user_id: 'admin-1',
      mobile_number: '9999999999',
      name: 'Admin User',
      email: 'admin@gramvikas.com',
      role: 'admin',
      village_id: null,
      village_name: null,
      district: 'Admin District',
      state: 'Admin State',
      kyc_status: 'verified',
      language_preference: 'en'
    },
    {
      user_id: 'hub-1',
      mobile_number: '8888888888',
      name: 'Hub Operator',
      email: 'hub@gramvikas.com',
      role: 'hub_operator',
      village_id: '1',
      village_name: 'Village A',
      district: 'Test District',
      state: 'Test State',
      kyc_status: 'verified',
      language_preference: 'en'
    },
    {
      user_id: 'shg-1',
      mobile_number: '7777777777',
      name: 'SHG Leader',
      email: 'shg@gramvikas.com',
      role: 'shg_leader',
      village_id: '1',
      village_name: 'Village A',
      district: 'Test District',
      state: 'Test State',
      kyc_status: 'verified',
      language_preference: 'en',
      shg_id: '1'
    },
    {
      user_id: 'agg-1',
      mobile_number: '6666666666',
      name: 'Aggregator',
      email: 'aggregator@gramvikas.com',
      role: 'aggregator',
      village_id: '2',
      village_name: 'Village B',
      district: 'Test District',
      state: 'Test State',
      kyc_status: 'verified',
      language_preference: 'en'
    }
  ];

  // Mock listings
  listings = [
    {
      listing_id: '1',
      product_name: 'Organic Rice',
      product_category: 'cereals',
      product_unit: 'kg',
      quantity: 100,
      quality_grade: 'A',
      asking_price: 45,
      farmer_name: 'Rajesh Kumar',
      village_name: 'Village A',
      district: 'Test District',
      state: 'Test State',
      hub_name: 'Hub A',
      total_bids: 3,
      highest_bid: 50,
      created_at: new Date().toISOString(),
      photos: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop']
    },
    {
      listing_id: '2',
      product_name: 'Fresh Tomatoes',
      product_category: 'vegetables',
      product_unit: 'kg',
      quantity: 50,
      quality_grade: 'B',
      asking_price: 25,
      farmer_name: 'Sunita Devi',
      village_name: 'Village C',
      district: 'Test District',
      state: 'Test State',
      total_bids: 1,
      highest_bid: 28,
      created_at: new Date().toISOString(),
      photos: ['https://images.unsplash.com/photo-1546470427-5c4b2b0b0b0b?w=400&h=300&fit=crop']
    }
  ];

  // Mock bids
  bids = [
    {
      bid_id: '1',
      listing_id: '1',
      bidder_name: 'Fresh Foods Ltd',
      bid_price: 50,
      bid_quantity: 50,
      created_at: new Date().toISOString(),
      status: 'active'
    }
  ];

  // Mock villages
  villages = [
    {
      village_id: '1',
      name: 'Village A',
      district: 'Test District',
      state: 'Test State',
      population: 1000,
      farmers_count: 50
    }
  ];

  // Mock hubs
  hubs = [
    {
      hub_id: '1',
      name: 'Hub A',
      village_id: '1',
      village_name: 'Village A',
      capacity: 1000,
      status: 'active'
    }
  ];
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'development'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Gram-Vikas API v1.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/v1/auth',
      marketplace: '/api/v1/marketplace',
      users: '/api/v1/users',
      villages: '/api/v1/villages',
      hubs: '/api/v1/hubs',
      orders: '/api/v1/orders',
      payments: '/api/v1/payments',
      analytics: '/api/v1/analytics',
      ussd: '/api/v1/ussd',
      shg: '/api/v1/shg'
    }
  });
});

// ==================== AUTH ENDPOINTS ====================

app.post('/api/v1/auth/login', (req, res) => {
  const { mobile_number, password } = req.body;
  
  if (!mobile_number) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number is required'
    });
  }

  // Mock OTP response
  res.json({
    success: true,
    otpSent: true,
    message: 'OTP sent successfully'
  });
});

app.post('/api/v1/auth/login-otp', (req, res) => {
  const { mobile_number, otp } = req.body;
  
  if (!mobile_number || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number and OTP are required'
    });
  }

  // Find user (don't create new ones, use predefined test users)
  let user = users.find(u => u.mobile_number === mobile_number);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please use a valid test mobile number.'
    });
  }

  res.json({
    success: true,
    data: {
      user: user,
      token: 'mock-jwt-token-' + Date.now()
    }
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  const { mobile_number, name, role, email, language_preference } = req.body;
  
  if (!mobile_number || !name || !role) {
    return res.status(400).json({
      success: false,
      message: 'Required fields are missing'
    });
  }

  res.json({
    success: true,
    message: 'Registration successful'
  });
});

app.post('/api/v1/auth/verify-otp', (req, res) => {
  const { mobile_number, otp } = req.body;
  
  // Find or create user
  let user = users.find(u => u.mobile_number === mobile_number);
  if (!user) {
    user = {
      user_id: Date.now().toString(),
      mobile_number: mobile_number,
      name: 'Test User',
      role: 'farmer',
      village_id: '1',
      village_name: 'Test Village',
      kyc_status: 'verified',
      language_preference: 'en'
    };
    users.push(user);
  }

  res.json({
    success: true,
    data: {
      user: user,
      token: 'mock-jwt-token-' + Date.now()
    }
  });
});

app.post('/api/v1/auth/resend-otp', (req, res) => {
  res.json({
    success: true,
    message: 'OTP resent successfully'
  });
});

app.get('/api/v1/auth/profile', (req, res) => {
  res.json({
    success: true,
    data: users[0] || {
      user_id: '1',
      mobile_number: '9876543210',
      name: 'Test User',
      role: 'farmer',
      village_id: '1',
      village_name: 'Test Village',
      kyc_status: 'verified',
      language_preference: 'en'
    }
  });
});

app.post('/api/v1/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// ==================== MARKETPLACE ENDPOINTS ====================

app.get('/api/v1/marketplace/listings/search', (req, res) => {
  const { page = 1, limit = 20, search, category, location, min_price, max_price } = req.query;
  
  let filteredListings = [...listings];
  
  // Apply filters
  if (search) {
    filteredListings = filteredListings.filter(l => 
      l.product_name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    filteredListings = filteredListings.filter(l => l.product_category === category);
  }
  
  if (location) {
    filteredListings = filteredListings.filter(l => 
      l.village_name.toLowerCase().includes(location.toLowerCase()) ||
      l.district.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  if (min_price) {
    filteredListings = filteredListings.filter(l => l.asking_price >= parseFloat(min_price));
  }
  
  if (max_price) {
    filteredListings = filteredListings.filter(l => l.asking_price <= parseFloat(max_price));
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedListings = filteredListings.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      listings: paginatedListings,
      total: filteredListings.length,
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
});

// Create new listing
app.post('/api/v1/marketplace/listings', (req, res) => {
  const listingData = req.body;
  
  const newListing = {
    listing_id: Date.now().toString(),
    ...listingData,
    created_at: new Date().toISOString(),
    total_bids: 0,
    highest_bid: null,
    status: 'active'
  };
  
  listings.push(newListing);
  
  res.json({
    success: true,
    data: {
      listing: newListing
    },
    message: 'Listing created successfully'
  });
});

// Get my listings
app.get('/api/v1/marketplace/listings/my-listings', (req, res) => {
  const { farmer_id } = req.query;
  
  // If farmer_id is provided, filter by it, otherwise return all listings
  let myListings = listings;
  if (farmer_id) {
    myListings = listings.filter(l => l.farmer_id === farmer_id);
  }
  
  res.json({
    success: true,
    data: {
      listings: myListings,
      total: myListings.length
    }
  });
});

app.get('/api/v1/marketplace/listings/:id', (req, res) => {
  const { id } = req.params;
  const listing = listings.find(l => l.listing_id === id);
  
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found'
    });
  }
  
  res.json({
    success: true,
    data: listing
  });
});

app.post('/api/v1/marketplace/listings', (req, res) => {
  const newListing = {
    listing_id: Date.now().toString(),
    ...req.body,
    created_at: new Date().toISOString(),
    total_bids: 0,
    photos: []
  };
  
  listings.push(newListing);
  
  res.json({
    success: true,
    data: newListing
  });
});


app.get('/api/v1/marketplace/listings/nearby', (req, res) => {
  res.json({
    success: true,
    data: {
      listings: listings.slice(0, 3),
      total: listings.length
    }
  });
});

app.get('/api/v1/marketplace/listings/trending', (req, res) => {
  res.json({
    success: true,
    data: {
      listings: listings.slice(0, 4),
      total: listings.length
    }
  });
});

app.post('/api/v1/marketplace/listings/:listingId/bids', (req, res) => {
  const { listingId } = req.params;
  const { bid_price, bid_quantity, message } = req.body;
  
  const newBid = {
    bid_id: Date.now().toString(),
    listing_id: listingId,
    bidder_name: 'Test Bidder',
    bid_price: bid_price,
    bid_quantity: bid_quantity,
    message: message,
    created_at: new Date().toISOString(),
    status: 'active'
  };
  
  bids.push(newBid);
  
  // Update listing bid count
  const listing = listings.find(l => l.listing_id === listingId);
  if (listing) {
    listing.total_bids = (listing.total_bids || 0) + 1;
    listing.highest_bid = Math.max(listing.highest_bid || 0, bid_price);
  }
  
  res.json({
    success: true,
    data: newBid
  });
});

app.get('/api/v1/marketplace/listings/:listingId/bids', (req, res) => {
  const { listingId } = req.params;
  const listingBids = bids.filter(b => b.listing_id === listingId);
  
  res.json({
    success: true,
    data: {
      bids: listingBids,
      total: listingBids.length
    }
  });
});

app.post('/api/v1/marketplace/listings/:listingId/bids/:bidId/accept', (req, res) => {
  res.json({
    success: true,
    message: 'Bid accepted successfully'
  });
});

app.get('/api/v1/marketplace/prices', (req, res) => {
  res.json({
    success: true,
    data: {
      prices: [
        { product: 'Rice', price: 45, unit: 'kg', location: 'Village A' },
        { product: 'Tomatoes', price: 25, unit: 'kg', location: 'Village B' }
      ]
    }
  });
});

app.get('/api/v1/marketplace/price-trends', (req, res) => {
  res.json({
    success: true,
    data: {
      trends: [
        { date: '2024-01-01', price: 40 },
        { date: '2024-01-02', price: 42 },
        { date: '2024-01-03', price: 45 }
      ]
    }
  });
});

// ==================== SHG ENDPOINTS ====================

app.get('/api/v1/shg/:shgId/members', (req, res) => {
  const { shgId } = req.params;
  
  res.json({
    success: true,
    data: {
      members: [
        {
          id: '1',
          name: 'Priya Sharma',
          phone: '+91 98765 43210',
          village: 'Village A',
          totalListings: 5,
          totalSales: 15000,
          lastActive: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Sunita Devi',
          phone: '+91 98765 43211',
          village: 'Village B',
          totalListings: 3,
          totalSales: 8500,
          lastActive: '2024-01-14T15:20:00Z'
        }
      ]
    }
  });
});

app.get('/api/v1/shg/:shgId/stats', (req, res) => {
  const { shgId } = req.params;
  
  res.json({
    success: true,
    data: {
      totalMembers: 3,
      activeListings: 15,
      totalSales: 45500,
      pendingOrders: 2,
      monthlyRevenue: 12500
    }
  });
});

// ==================== ANALYTICS ENDPOINTS ====================

// In-memory storage for analytics data
let analyticsData = {
  users: {},
  dashboard: {},
  hubs: {},
  shg: {}
};

// Store user analytics data (POST)
app.post('/api/v1/analytics/users/:userId', (req, res) => {
  const { userId } = req.params;
  const data = req.body;
  
  analyticsData.users[userId] = {
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  console.log(`📊 Analytics updated for user ${userId}:`, {
    timestamp: data.timestamp,
    dataKeys: Object.keys(data.data || {})
  });
  
  res.json({
    success: true,
    message: 'Analytics data stored successfully',
    timestamp: new Date().toISOString()
  });
});

// Get user analytics data (GET)
app.get('/api/v1/analytics/users/:userId', (req, res) => {
  const { userId } = req.params;
  const { role } = req.query;
  
  const storedData = analyticsData.users[userId];
  
  if (!storedData) {
    // Return mock data if no stored data
    const mockData = getMockUserData(role);
    return res.json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString(),
      source: 'mock'
    });
  }
  
  res.json({
    success: true,
    data: storedData.data,
    timestamp: storedData.lastUpdated,
    source: 'live'
  });
});

// Store dashboard analytics data (POST)
app.post('/api/v1/analytics/dashboard', (req, res) => {
  const data = req.body;
  
  analyticsData.dashboard = {
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  console.log(`📊 Dashboard analytics updated:`, {
    timestamp: data.timestamp,
    dataKeys: Object.keys(data.data || {})
  });
  
  res.json({
    success: true,
    message: 'Dashboard analytics data stored successfully',
    timestamp: new Date().toISOString()
  });
});

// Get dashboard analytics data (GET)
app.get('/api/v1/analytics/dashboard', (req, res) => {
  const { role } = req.query;
  
  const storedData = analyticsData.dashboard;
  
  if (!storedData || Object.keys(storedData).length === 0) {
    // Return mock data if no stored data
    const mockData = getMockDashboardData(role);
    return res.json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString(),
      source: 'mock'
    });
  }
  
  res.json({
    success: true,
    data: storedData.data,
    timestamp: storedData.lastUpdated,
    source: 'live'
  });
});

// Store hub analytics data (POST)
app.post('/api/v1/analytics/hubs/:hubId', (req, res) => {
  const { hubId } = req.params;
  const data = req.body;
  
  analyticsData.hubs[hubId] = {
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  console.log(`📊 Hub analytics updated for hub ${hubId}:`, {
    timestamp: data.timestamp,
    dataKeys: Object.keys(data.data || {})
  });
  
  res.json({
    success: true,
    message: 'Hub analytics data stored successfully',
    timestamp: new Date().toISOString()
  });
});

// Get hub analytics data (GET)
app.get('/api/v1/analytics/hubs/:hubId', (req, res) => {
  const { hubId } = req.params;
  
  const storedData = analyticsData.hubs[hubId];
  
  if (!storedData) {
    // Return mock data if no stored data
    const mockData = getMockHubData();
    return res.json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString(),
      source: 'mock'
    });
  }
  
  res.json({
    success: true,
    data: storedData.data,
    timestamp: storedData.lastUpdated,
    source: 'live'
  });
});

// Store SHG analytics data (POST)
app.post('/api/v1/analytics/shg/:shgId', (req, res) => {
  const { shgId } = req.params;
  const data = req.body;
  
  analyticsData.shg[shgId] = {
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  console.log(`📊 SHG analytics updated for SHG ${shgId}:`, {
    timestamp: data.timestamp,
    dataKeys: Object.keys(data.data || {})
  });
  
  res.json({
    success: true,
    message: 'SHG analytics data stored successfully',
    timestamp: new Date().toISOString()
  });
});

// Get SHG analytics data (GET)
app.get('/api/v1/analytics/shg/:shgId', (req, res) => {
  const { shgId } = req.params;
  
  const storedData = analyticsData.shg[shgId];
  
  if (!storedData) {
    // Return mock data if no stored data
    const mockData = getMockSHGData();
    return res.json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString(),
      source: 'mock'
    });
  }
  
  res.json({
    success: true,
    data: storedData.data,
    timestamp: storedData.lastUpdated,
    source: 'live'
  });
});

// Mock data generators
function getMockUserData(role) {
  switch (role) {
    case 'buyer':
      return {
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
      };
    
    case 'farmer':
      return {
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
      };
    
    default:
      return {
        totalListings: 5,
        totalBids: 3,
        totalSales: 15000,
        totalEarnings: 15000,
        totalSpent: 12000,
        successRate: 85
      };
  }
}

function getMockDashboardData(role) {
  return {
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
  };
}

function getMockHubData() {
  return {
    totalOrdersProcessed: 1250,
    activeOrders: 45,
    completedOrders: 1205,
    pendingPickups: 12,
    hubRevenue: 125000,
    dailyOrders: [
      { name: 'Mon', value: 45 },
      { name: 'Tue', value: 52 },
      { name: 'Wed', value: 38 },
      { name: 'Thu', value: 61 },
      { name: 'Fri', value: 48 },
      { name: 'Sat', value: 41 },
      { name: 'Sun', value: 35 },
    ],
    orderStatusDistribution: [
      { name: 'Pending Pickup', value: 12 },
      { name: 'In Transit', value: 18 },
      { name: 'Quality Check', value: 8 },
      { name: 'Delivered', value: 7 },
    ],
    revenueByDay: [
      { name: 'Mon', value: 8500 },
      { name: 'Tue', value: 9200 },
      { name: 'Wed', value: 6800 },
      { name: 'Thu', value: 10500 },
      { name: 'Fri', value: 8800 },
      { name: 'Sat', value: 7200 },
      { name: 'Sun', value: 6100 },
    ],
    farmerDistribution: [
      { name: 'Local Farmers', value: 65 },
      { name: 'Nearby Villages', value: 25 },
      { name: 'Distant Areas', value: 10 },
    ]
  };
}

function getMockSHGData() {
  return {
    totalMembers: 25,
    activeMembers: 22,
    collectiveEarnings: 185000,
    groupSavings: 45000,
    loansDisbursed: 8,
    loansRepaid: 5,
    monthlyEarnings: [
      { name: 'Jan', value: 12000 },
      { name: 'Feb', value: 15000 },
      { name: 'Mar', value: 18000 },
      { name: 'Apr', value: 22000 },
      { name: 'May', value: 25000 },
      { name: 'Jun', value: 28000 },
    ],
    memberContribution: [
      { name: 'Regular Members', value: 18 },
      { name: 'Active Contributors', value: 15 },
      { name: 'New Members', value: 7 },
      { name: 'Inactive Members', value: 3 },
    ],
    incomeSources: [
      { name: 'Agricultural Sales', value: 45 },
      { name: 'Handicrafts', value: 25 },
      { name: 'Livestock', value: 20 },
      { name: 'Other Activities', value: 10 },
    ],
    savingsDistribution: [
      { name: 'Emergency Fund', value: 15000 },
      { name: 'Investment Fund', value: 12000 },
      { name: 'Loan Fund', value: 10000 },
      { name: 'Development Fund', value: 8000 },
    ],
    loanStatus: [
      { name: 'Active Loans', value: 3 },
      { name: 'Repaid Loans', value: 5 },
      { name: 'Pending Applications', value: 2 },
    ]
  };
}

app.get('/api/v1/analytics/villages/:villageId', (req, res) => {
  res.json({
    success: true,
    data: {
      villageId: req.params.villageId,
      totalFarmers: 25,
      totalListings: 15,
      totalRevenue: 50000
    }
  });
});

// ==================== VILLAGES ENDPOINTS ====================

app.get('/api/v1/villages', (req, res) => {
  res.json({
    success: true,
    data: villages
  });
});

app.get('/api/v1/villages/:id', (req, res) => {
  const village = villages.find(v => v.village_id === req.params.id);
  if (!village) {
    return res.status(404).json({
      success: false,
      message: 'Village not found'
    });
  }
  
  res.json({
    success: true,
    data: village
  });
});

// ==================== HUBS ENDPOINTS ====================

app.get('/api/v1/hubs', (req, res) => {
  res.json({
    success: true,
    data: hubs
  });
});

app.get('/api/v1/hubs/:id', (req, res) => {
  const hub = hubs.find(h => h.hub_id === req.params.id);
  if (!hub) {
    return res.status(404).json({
      success: false,
      message: 'Hub not found'
    });
  }
  
  res.json({
    success: true,
    data: hub
  });
});

app.get('/api/v1/hubs/:id/orders', (req, res) => {
  res.json({
    success: true,
    data: {
      orders: [],
      total: 0
    }
  });
});

// ==================== ORDERS ENDPOINTS ====================

app.get('/api/v1/orders', (req, res) => {
  res.json({
    success: true,
    data: {
      orders: [],
      total: 0
    }
  });
});

app.get('/api/v1/orders/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      order_id: req.params.id,
      status: 'pending',
      total_amount: 1000
    }
  });
});

// ==================== LISTINGS ENDPOINTS ====================


// Create new listing
app.post('/api/v1/marketplace/listings', (req, res) => {
  const newListing = {
    listing_id: `list${mockListings.length + 1}`,
    ...req.body,
    status: 'active',
    total_bids: 0,
    created_at: new Date().toISOString(),
    photos: []
  };
  mockListings.push(newListing);
  
  res.status(201).json({ 
    success: true, 
    data: { listing: newListing },
    message: 'Listing created successfully!' 
  });
});

// Get specific listing
app.get('/api/v1/marketplace/listings/:id', (req, res) => {
  const listing = mockListings.find(l => l.listing_id === req.params.id);
  if (!listing) {
    return res.status(404).json({ 
      success: false, 
      message: 'Listing not found' 
    });
  }
  
  res.status(200).json({ 
    success: true, 
    data: { listing } 
  });
});

// Update listing
app.put('/api/v1/marketplace/listings/:id', (req, res) => {
  const listingIndex = mockListings.findIndex(l => l.listing_id === req.params.id);
  if (listingIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Listing not found' 
    });
  }
  
  mockListings[listingIndex] = { ...mockListings[listingIndex], ...req.body };
  
  res.status(200).json({ 
    success: true, 
    data: { listing: mockListings[listingIndex] },
    message: 'Listing updated successfully!' 
  });
});

// Delete listing
app.delete('/api/v1/marketplace/listings/:id', (req, res) => {
  const listingIndex = mockListings.findIndex(l => l.listing_id === req.params.id);
  if (listingIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Listing not found' 
    });
  }
  
  mockListings.splice(listingIndex, 1);
  
  res.status(200).json({ 
    success: true, 
    message: 'Listing deleted successfully!' 
  });
});

// ==================== USERS ENDPOINTS ====================

app.get('/api/v1/users', (req, res) => {
  res.json({
    success: true,
    data: users
  });
});

app.get('/api/v1/users/:id', (req, res) => {
  const user = users.find(u => u.user_id === req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// Catch-all route
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Initialize mock data and start server
initializeMockData();

app.listen(PORT, () => {
  console.log(`🚀 Gram-Vikas Mock API Server running on port ${PORT}`);
  console.log(`📱 Environment: development`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`\n📋 Available Endpoints:`);
  console.log(`   Auth: POST /api/v1/auth/login, /api/v1/auth/register, etc.`);
  console.log(`   Marketplace: GET /api/v1/marketplace/listings/search`);
  console.log(`   SHG: GET /api/v1/shg/:id/members, /api/v1/shg/:id/stats`);
  console.log(`   Analytics: GET /api/v1/analytics/dashboard`);
  console.log(`   Users: GET /api/v1/users`);
  console.log(`   Villages: GET /api/v1/villages`);
  console.log(`   Hubs: GET /api/v1/hubs`);
});

module.exports = app;