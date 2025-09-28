const { Pool } = require('pg');
const config = require('../config/config');

class Listing {
    constructor(pool) {
        this.pool = pool || new Pool(config.database);
    }

    // Create new listing
    async create(listingData) {
        const {
            farmer_id,
            product_id,
            farm_id,
            quantity,
            quality_grade = 'A',
            asking_price,
            harvest_date,
            expiry_date,
            photos = [],
            hub_id
        } = listingData;

        const query = `
            INSERT INTO listings (farmer_id, product_id, farm_id, quantity, quality_grade, asking_price, harvest_date, expiry_date, photos, hub_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;

        const values = [farmer_id, product_id, farm_id, quantity, quality_grade, asking_price, harvest_date, expiry_date, JSON.stringify(photos), hub_id];

        try {
            const result = await this.pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Find listing by ID with detailed info
    async findById(listing_id) {
        const query = `
            SELECT 
                l.*,
                p.name as product_name,
                p.category as product_category,
                p.unit as product_unit,
                p.sku_code,
                u.name as farmer_name,
                u.mobile_number as farmer_mobile,
                f.acreage as farm_acreage,
                v.name as village_name,
                v.district,
                v.state,
                h.name as hub_name,
                h.location as hub_location,
                COUNT(b.bid_id) as total_bids,
                MAX(b.bid_price) as highest_bid
            FROM listings l
            JOIN products p ON l.product_id = p.product_id
            JOIN users u ON l.farmer_id = u.user_id
            JOIN farms f ON l.farm_id = f.farm_id
            JOIN villages v ON f.village_id = v.village_id
            LEFT JOIN hubs h ON l.hub_id = h.hub_id
            LEFT JOIN bids b ON l.listing_id = b.listing_id AND b.status = 'pending'
            WHERE l.listing_id = $1
            GROUP BY l.listing_id, p.product_id, u.user_id, f.farm_id, v.village_id, h.hub_id
        `;

        const result = await this.pool.query(query, [listing_id]);
        return result.rows[0] || null;
    }

    // Search listings with filters
    async search(filters = {}, limit = 20, offset = 0) {
        let query = `
            SELECT 
                l.*,
                p.name as product_name,
                p.category as product_category,
                p.unit as product_unit,
                u.name as farmer_name,
                v.name as village_name,
                v.district,
                v.state,
                h.name as hub_name,
                COUNT(b.bid_id) as total_bids,
                MAX(b.bid_price) as highest_bid
            FROM listings l
            JOIN products p ON l.product_id = p.product_id
            JOIN users u ON l.farmer_id = u.user_id
            JOIN farms f ON l.farm_id = f.farm_id
            JOIN villages v ON f.village_id = v.village_id
            LEFT JOIN hubs h ON l.hub_id = h.hub_id
            LEFT JOIN bids b ON l.listing_id = b.listing_id AND b.status = 'pending'
            WHERE l.status = 'active'
        `;

        const values = [];
        let paramCount = 1;

        if (filters.product_id) {
            query += ` AND l.product_id = $${paramCount}`;
            values.push(filters.product_id);
            paramCount++;
        }

        if (filters.category) {
            query += ` AND p.category = $${paramCount}`;
            values.push(filters.category);
            paramCount++;
        }

        if (filters.location) {
            query += ` AND (v.district ILIKE $${paramCount} OR v.state ILIKE $${paramCount})`;
            values.push(`%${filters.location}%`);
            paramCount++;
        }

        if (filters.min_price) {
            query += ` AND l.asking_price >= $${paramCount}`;
            values.push(filters.min_price);
            paramCount++;
        }

        if (filters.max_price) {
            query += ` AND l.asking_price <= $${paramCount}`;
            values.push(filters.max_price);
            paramCount++;
        }

        if (filters.quality_grade) {
            query += ` AND l.quality_grade = $${paramCount}`;
            values.push(filters.quality_grade);
            paramCount++;
        }

        if (filters.hub_id) {
            query += ` AND l.hub_id = $${paramCount}`;
            values.push(filters.hub_id);
            paramCount++;
        }

        query += `
            GROUP BY l.listing_id, p.product_id, u.user_id, f.farm_id, v.village_id, h.hub_id
            ORDER BY l.created_at DESC
            LIMIT $${paramCount} OFFSET $${paramCount + 1}
        `;
        values.push(limit, offset);

        const result = await this.pool.query(query, values);
        return result.rows;
    }

    // Get listings by farmer
    async findByFarmer(farmer_id, status = null, limit = 20, offset = 0) {
        let query = `
            SELECT 
                l.*,
                p.name as product_name,
                p.category as product_category,
                p.unit as product_unit,
                COUNT(b.bid_id) as total_bids,
                MAX(b.bid_price) as highest_bid,
                COUNT(o.order_id) as total_orders
            FROM listings l
            JOIN products p ON l.product_id = p.product_id
            LEFT JOIN bids b ON l.listing_id = b.listing_id AND b.status = 'pending'
            LEFT JOIN orders o ON l.listing_id = o.listing_id
            WHERE l.farmer_id = $1
        `;

        const values = [farmer_id];
        let paramCount = 2;

        if (status) {
            query += ` AND l.status = $${paramCount}`;
            values.push(status);
            paramCount++;
        }

        query += `
            GROUP BY l.listing_id, p.product_id
            ORDER BY l.created_at DESC
            LIMIT $${paramCount} OFFSET $${paramCount + 1}
        `;
        values.push(limit, offset);

        const result = await this.pool.query(query, values);
        return result.rows;
    }

    // Update listing
    async update(listing_id, updateData) {
        const allowedFields = ['quantity', 'quality_grade', 'asking_price', 'harvest_date', 'expiry_date', 'photos', 'status'];
        const updates = [];
        const values = [];
        let paramCount = 1;

        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key) && updateData[key] !== undefined) {
                if (key === 'photos') {
                    updates.push(`${key} = $${paramCount}`);
                    values.push(JSON.stringify(updateData[key]));
                } else {
                    updates.push(`${key} = $${paramCount}`);
                    values.push(updateData[key]);
                }
                paramCount++;
            }
        });

        if (updates.length === 0) {
            throw new Error('No valid fields to update');
        }

        values.push(listing_id);
        const query = `
            UPDATE listings 
            SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE listing_id = $${paramCount}
            RETURNING *
        `;

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    // Get bids for listing
    async getBids(listing_id, status = 'pending') {
        const query = `
            SELECT 
                b.*,
                u.name as buyer_name,
                u.mobile_number as buyer_mobile,
                u.role as buyer_role
            FROM bids b
            JOIN users u ON b.buyer_id = u.user_id
            WHERE b.listing_id = $1 AND b.status = $2
            ORDER BY b.bid_price DESC, b.created_at ASC
        `;

        const result = await this.pool.query(query, [listing_id, status]);
        return result.rows;
    }

    // Accept bid and create order
    async acceptBid(listing_id, bid_id, farmer_id) {
        const client = await this.pool.connect();
        
        try {
            await client.query('BEGIN');

            // Get bid details
            const bidQuery = `
                SELECT * FROM bids 
                WHERE bid_id = $1 AND listing_id = $2 AND status = 'pending'
            `;
            const bidResult = await client.query(bidQuery, [bid_id, listing_id]);
            
            if (bidResult.rows.length === 0) {
                throw new Error('Bid not found or already processed');
            }

            const bid = bidResult.rows[0];

            // Update bid status to accepted
            await client.query(
                'UPDATE bids SET status = $1 WHERE bid_id = $2',
                ['accepted', bid_id]
            );

            // Reject other pending bids
            await client.query(
                'UPDATE bids SET status = $1 WHERE listing_id = $2 AND bid_id != $3 AND status = $4',
                ['rejected', listing_id, bid_id, 'pending']
            );

            // Create order
            const orderQuery = `
                INSERT INTO orders (buyer_id, listing_id, farmer_id, quantity, agreed_price, status)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
            const orderResult = await client.query(orderQuery, [
                bid.buyer_id, listing_id, farmer_id, bid.quantity, bid.bid_price, 'confirmed'
            ]);

            // Update listing status
            await client.query(
                'UPDATE listings SET status = $1 WHERE listing_id = $2',
                ['sold', listing_id]
            );

            await client.query('COMMIT');
            return orderResult.rows[0];

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Get nearby listings
    async findNearby(coordinates, radiusKm = 50, filters = {}, limit = 20) {
        let query = `
            SELECT 
                l.*,
                p.name as product_name,
                p.category as product_category,
                p.unit as product_unit,
                u.name as farmer_name,
                v.name as village_name,
                v.district,
                v.state,
                ST_Distance(
                    v.coordinates::geography,
                    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
                ) / 1000 as distance_km
            FROM listings l
            JOIN products p ON l.product_id = p.product_id
            JOIN users u ON l.farmer_id = u.user_id
            JOIN farms f ON l.farm_id = f.farm_id
            JOIN villages v ON f.village_id = v.village_id
            WHERE l.status = 'active'
            AND v.coordinates IS NOT NULL
            AND ST_DWithin(
                v.coordinates::geography,
                ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
                $3 * 1000
            )
        `;

        const values = [coordinates.longitude, coordinates.latitude, radiusKm];
        let paramCount = 4;

        if (filters.category) {
            query += ` AND p.category = $${paramCount}`;
            values.push(filters.category);
            paramCount++;
        }

        if (filters.product_id) {
            query += ` AND l.product_id = $${paramCount}`;
            values.push(filters.product_id);
            paramCount++;
        }

        query += `
            ORDER BY distance_km, l.created_at DESC
            LIMIT $${paramCount}
        `;
        values.push(limit);

        const result = await this.pool.query(query, values);
        return result.rows;
    }

    // Get listing statistics
    async getListingStats(listing_id) {
        const statsQuery = `
            SELECT 
                l.listing_id,
                l.quantity,
                l.asking_price,
                l.status,
                l.created_at,
                COUNT(b.bid_id) as total_bids,
                MAX(b.bid_price) as highest_bid,
                MIN(b.bid_price) as lowest_bid,
                AVG(b.bid_price) as avg_bid,
                COUNT(CASE WHEN b.status = 'pending' THEN 1 END) as pending_bids,
                COUNT(o.order_id) as total_orders
            FROM listings l
            LEFT JOIN bids b ON l.listing_id = b.listing_id
            LEFT JOIN orders o ON l.listing_id = o.listing_id
            WHERE l.listing_id = $1
            GROUP BY l.listing_id
        `;

        const result = await this.pool.query(statsQuery, [listing_id]);
        return result.rows[0];
    }

    // Expire old listings
    async expireOldListings() {
        const query = `
            UPDATE listings 
            SET status = 'expired', updated_at = CURRENT_TIMESTAMP
            WHERE status = 'active' 
            AND (expiry_date < CURRENT_DATE OR created_at < CURRENT_DATE - INTERVAL '30 days')
            RETURNING listing_id, farmer_id, product_id
        `;

        const result = await this.pool.query(query);
        return result.rows;
    }

    // Get trending products
    async getTrendingProducts(days = 7, limit = 10) {
        const query = `
            SELECT 
                p.product_id,
                p.name as product_name,
                p.category,
                COUNT(l.listing_id) as listing_count,
                AVG(l.asking_price) as avg_price,
                SUM(l.quantity) as total_quantity
            FROM products p
            JOIN listings l ON p.product_id = l.product_id
            WHERE l.status = 'active'
            AND l.created_at >= CURRENT_DATE - INTERVAL '${days} days'
            GROUP BY p.product_id, p.name, p.category
            ORDER BY listing_count DESC, total_quantity DESC
            LIMIT $1
        `;

        const result = await this.pool.query(query, [limit]);
        return result.rows;
    }

    // Delete listing (soft delete by setting status to cancelled)
    async delete(listing_id, farmer_id) {
        const query = `
            UPDATE listings 
            SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
            WHERE listing_id = $1 AND farmer_id = $2 AND status = 'active'
            RETURNING *
        `;

        const result = await this.pool.query(query, [listing_id, farmer_id]);
        return result.rows[0];
    }
}

module.exports = Listing;