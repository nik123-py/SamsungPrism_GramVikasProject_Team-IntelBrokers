const { validationResult } = require('express-validator');

class AnalyticsController {
    constructor() {
        // In-memory storage for demo data (in production, this would be Redis or database)
        this.demoData = {
            users: new Map(),
            dashboard: {},
            hubs: new Map(),
            shg: new Map()
        };
    }

    // Store user analytics data (called by Python scripts)
    storeUserAnalytics = async (req, res) => {
        try {
            const { user_id } = req.params;
            const analyticsData = req.body;

            // Store the analytics data
            this.demoData.users.set(user_id, {
                ...analyticsData,
                lastUpdated: new Date().toISOString()
            });

            // Log the update
            console.log(`📊 Analytics updated for user ${user_id}:`, {
                timestamp: analyticsData.timestamp,
                dataKeys: Object.keys(analyticsData.data || {})
            });

            res.status(200).json({
                success: true,
                message: 'Analytics data stored successfully',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Store user analytics error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while storing analytics'
            });
        }
    };

    // Get user analytics data (called by frontend)
    getUserAnalytics = async (req, res) => {
        try {
            const { user_id } = req.params;
            const { role } = req.query;

            // Get stored analytics data
            const storedData = this.demoData.users.get(user_id);
            
            if (!storedData) {
                // Return mock data if no stored data
                const mockData = this.getMockUserData(role);
                return res.status(200).json({
                    success: true,
                    data: mockData,
                    timestamp: new Date().toISOString(),
                    source: 'mock'
                });
            }

            res.status(200).json({
                success: true,
                data: storedData.data,
                timestamp: storedData.lastUpdated,
                source: 'live'
            });

        } catch (error) {
            console.error('Get user analytics error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching analytics'
            });
        }
    };

    // Store dashboard analytics data (called by Python scripts)
    storeDashboardAnalytics = async (req, res) => {
        try {
            const analyticsData = req.body;

            // Store the dashboard analytics data
            this.demoData.dashboard = {
                ...analyticsData,
                lastUpdated: new Date().toISOString()
            };

            // Log the update
            console.log(`📊 Dashboard analytics updated:`, {
                timestamp: analyticsData.timestamp,
                dataKeys: Object.keys(analyticsData.data || {})
            });

            res.status(200).json({
                success: true,
                message: 'Dashboard analytics data stored successfully',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Store dashboard analytics error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while storing dashboard analytics'
            });
        }
    };

    // Get dashboard analytics data (called by frontend)
    getDashboardAnalytics = async (req, res) => {
        try {
            const { role } = req.query;

            // Get stored dashboard analytics data
            const storedData = this.demoData.dashboard;
            
            if (!storedData || Object.keys(storedData).length === 0) {
                // Return mock data if no stored data
                const mockData = this.getMockDashboardData(role);
                return res.status(200).json({
                    success: true,
                    data: mockData,
                    timestamp: new Date().toISOString(),
                    source: 'mock'
                });
            }

            res.status(200).json({
                success: true,
                data: storedData.data,
                timestamp: storedData.lastUpdated,
                source: 'live'
            });

        } catch (error) {
            console.error('Get dashboard analytics error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching dashboard analytics'
            });
        }
    };

    // Store hub analytics data (called by Python scripts)
    storeHubAnalytics = async (req, res) => {
        try {
            const { hub_id } = req.params;
            const analyticsData = req.body;

            // Store the hub analytics data
            this.demoData.hubs.set(hub_id, {
                ...analyticsData,
                lastUpdated: new Date().toISOString()
            });

            // Log the update
            console.log(`📊 Hub analytics updated for hub ${hub_id}:`, {
                timestamp: analyticsData.timestamp,
                dataKeys: Object.keys(analyticsData.data || {})
            });

            res.status(200).json({
                success: true,
                message: 'Hub analytics data stored successfully',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Store hub analytics error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while storing hub analytics'
            });
        }
    };

    // Get hub analytics data (called by frontend)
    getHubAnalytics = async (req, res) => {
        try {
            const { hub_id } = req.params;

            // Get stored hub analytics data
            const storedData = this.demoData.hubs.get(hub_id);
            
            if (!storedData) {
                // Return mock data if no stored data
                const mockData = this.getMockHubData();
                return res.status(200).json({
                    success: true,
                    data: mockData,
                    timestamp: new Date().toISOString(),
                    source: 'mock'
                });
            }

            res.status(200).json({
                success: true,
                data: storedData.data,
                timestamp: storedData.lastUpdated,
                source: 'live'
            });

        } catch (error) {
            console.error('Get hub analytics error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching hub analytics'
            });
        }
    };

    // Store SHG analytics data (called by Python scripts)
    storeSHGAnalytics = async (req, res) => {
        try {
            const { shg_id } = req.params;
            const analyticsData = req.body;

            // Store the SHG analytics data
            this.demoData.shg.set(shg_id, {
                ...analyticsData,
                lastUpdated: new Date().toISOString()
            });

            // Log the update
            console.log(`📊 SHG analytics updated for SHG ${shg_id}:`, {
                timestamp: analyticsData.timestamp,
                dataKeys: Object.keys(analyticsData.data || {})
            });

            res.status(200).json({
                success: true,
                message: 'SHG analytics data stored successfully',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Store SHG analytics error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while storing SHG analytics'
            });
        }
    };

    // Get SHG analytics data (called by frontend)
    getSHGAnalytics = async (req, res) => {
        try {
            const { shg_id } = req.params;

            // Get stored SHG analytics data
            const storedData = this.demoData.shg.get(shg_id);
            
            if (!storedData) {
                // Return mock data if no stored data
                const mockData = this.getMockSHGData();
                return res.status(200).json({
                    success: true,
                    data: mockData,
                    timestamp: new Date().toISOString(),
                    source: 'mock'
                });
            }

            res.status(200).json({
                success: true,
                data: storedData.data,
                timestamp: storedData.lastUpdated,
                source: 'live'
            });

        } catch (error) {
            console.error('Get SHG analytics error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching SHG analytics'
            });
        }
    };

    // Mock data generators for when no live data is available
    getMockUserData(role) {
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
                return {};
        }
    }

    getMockDashboardData(role) {
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

    getMockHubData() {
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

    getMockSHGData() {
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
}

module.exports = new AnalyticsController();
