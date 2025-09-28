const express = require('express');
const authMiddleware = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');
const router = express.Router();

// Dashboard analytics routes
router.get('/dashboard', authMiddleware.authenticate, analyticsController.getDashboardAnalytics);
router.post('/dashboard', analyticsController.storeDashboardAnalytics);

// User analytics routes
router.get('/users/:user_id', authMiddleware.authenticate, analyticsController.getUserAnalytics);
router.post('/users/:user_id', analyticsController.storeUserAnalytics);

// Hub analytics routes
router.get('/hubs/:hub_id', authMiddleware.authenticate, analyticsController.getHubAnalytics);
router.post('/hubs/:hub_id', analyticsController.storeHubAnalytics);

// SHG analytics routes
router.get('/shg/:shg_id', authMiddleware.authenticate, analyticsController.getSHGAnalytics);
router.post('/shg/:shg_id', analyticsController.storeSHGAnalytics);

// Village analytics routes (placeholder)
router.get('/villages/:village_id', authMiddleware.authenticate, (req, res) => {
    res.json({ 
        success: true, 
        message: 'Village analytics endpoint - to be implemented',
        data: {
            totalFarmers: 150,
            totalListings: 45,
            totalOrders: 120,
            monthlyRevenue: 85000
        }
    });
});

module.exports = router;