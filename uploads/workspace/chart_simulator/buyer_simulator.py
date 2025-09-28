#!/usr/bin/env python3
"""
Buyer Dashboard Chart Simulator
Sends fake data to update buyer dashboard charts in real-time for demonstration
"""

import requests
import json
import time
import random
from datetime import datetime, timedelta
import threading
from typing import Dict, List, Any

class BuyerChartSimulator:
    def __init__(self, base_url: str = "http://localhost:3000/api/v1", user_id: str = "buyer_001"):
        self.base_url = base_url
        self.user_id = user_id
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Authorization': f'Bearer fake_token_{user_id}'
        })
        
        # Initial data state
        self.total_spent = 285000
        self.active_orders = 5
        self.completed_purchases = 42
        self.saved_listings = 12
        
        # Chart data
        self.monthly_spending = [
            {"name": "Jan", "value": 45000},
            {"name": "Feb", "value": 52000},
            {"name": "Mar", "value": 38000},
            {"name": "Apr", "value": 61000},
            {"name": "May", "value": 48000},
            {"name": "Jun", "value": 41000},
        ]
        
        self.category_spending = [
            {"name": "Cereals", "value": 120000},
            {"name": "Vegetables", "value": 85000},
            {"name": "Fruits", "value": 45000},
            {"name": "Pulses", "value": 35000},
        ]
        
        self.running = False

    def generate_new_order(self) -> Dict[str, Any]:
        """Generate a new order simulation"""
        products = ["Basmati Rice", "Fresh Onions", "Wheat", "Tomatoes", "Potatoes", "Carrots"]
        farmers = ["Rajesh Kumar", "Sunita Devi", "Amit Singh", "Priya Sharma", "Vikram Patel"]
        villages = ["Khetri", "Rampur", "Bharatpur", "Alwar", "Jaipur"]
        
        return {
            "order_id": f"ORD_{int(time.time())}",
            "product_name": random.choice(products),
            "quantity": random.randint(10, 200),
            "agreed_price": random.randint(20, 3000),
            "status": random.choice(["confirmed", "picked_up", "quality_checked", "delivered"]),
            "farmer_name": random.choice(farmers),
            "village_name": random.choice(villages),
            "created_at": datetime.now().isoformat(),
            "pickup_date": (datetime.now() + timedelta(days=random.randint(1, 7))).isoformat()
        }

    def update_monthly_spending(self):
        """Update monthly spending data with slight variations"""
        for month_data in self.monthly_spending:
            # Add small random variation (-5% to +10%)
            variation = random.uniform(-0.05, 0.10)
            month_data["value"] = int(month_data["value"] * (1 + variation))
        
        # Add new month if we're at the end
        if len(self.monthly_spending) >= 12:
            self.monthly_spending.pop(0)
        
        new_month = datetime.now().strftime("%b")
        if not any(m["name"] == new_month for m in self.monthly_spending):
            self.monthly_spending.append({
                "name": new_month,
                "value": random.randint(35000, 65000)
            })

    def update_category_spending(self):
        """Update category spending with realistic variations"""
        categories = ["Cereals", "Vegetables", "Fruits", "Pulses"]
        for category_data in self.category_spending:
            if category_data["name"] in categories:
                # Seasonal variations
                variation = random.uniform(-0.03, 0.08)
                category_data["value"] = int(category_data["value"] * (1 + variation))

    def simulate_new_purchase(self):
        """Simulate a new purchase affecting stats"""
        order = self.generate_new_order()
        purchase_amount = order["agreed_price"] * order["quantity"]
        
        # Update stats
        self.total_spent += purchase_amount
        self.completed_purchases += 1
        
        # Update category spending
        product_category = self.get_product_category(order["product_name"])
        for cat in self.category_spending:
            if cat["name"] == product_category:
                cat["value"] += purchase_amount
                break
        
        print(f"🛒 New purchase: {order['product_name']} - ₹{purchase_amount:,}")

    def get_product_category(self, product_name: str) -> str:
        """Map product to category"""
        if any(word in product_name.lower() for word in ["rice", "wheat", "barley"]):
            return "Cereals"
        elif any(word in product_name.lower() for word in ["onion", "tomato", "potato", "carrot"]):
            return "Vegetables"
        elif any(word in product_name.lower() for word in ["apple", "banana", "orange", "mango"]):
            return "Fruits"
        else:
            return "Pulses"

    def send_analytics_update(self):
        """Send updated analytics data to the API"""
        try:
            # Update chart data
            self.update_monthly_spending()
            self.update_category_spending()
            
            payload = {
                "success": True,
                "data": {
                    "totalSpent": self.total_spent,
                    "activeOrders": self.active_orders,
                    "completedPurchases": self.completed_purchases,
                    "savedListings": self.saved_listings,
                    "monthlySpending": self.monthly_spending,
                    "categorySpending": self.category_spending
                },
                "timestamp": datetime.now().isoformat()
            }
            
            # Send to analytics endpoint
            response = self.session.post(
                f"{self.base_url}/analytics/users/{self.user_id}",
                json=payload,
                timeout=5
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Analytics updated for buyer {self.user_id}")
            else:
                print(f"⚠️ Analytics update failed: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")

    def simulate_order_status_change(self):
        """Simulate order status changes"""
        if self.active_orders > 0:
            # Randomly complete an order
            if random.random() < 0.3:  # 30% chance
                self.active_orders -= 1
                self.completed_purchases += 1
                print(f"📦 Order completed! Active: {self.active_orders}, Completed: {self.completed_purchases}")

    def run_simulation(self, duration_minutes: int = 10):
        """Run the simulation for specified duration"""
        print(f"🚀 Starting buyer dashboard simulation for {duration_minutes} minutes...")
        print(f"👤 User ID: {self.user_id}")
        print(f"🌐 API Base URL: {self.base_url}")
        
        self.running = True
        start_time = time.time()
        end_time = start_time + (duration_minutes * 60)
        
        while self.running and time.time() < end_time:
            try:
                # Randomly trigger different events
                event_probability = random.random()
                
                if event_probability < 0.4:  # 40% chance - new purchase
                    self.simulate_new_purchase()
                elif event_probability < 0.6:  # 20% chance - order status change
                    self.simulate_order_status_change()
                elif event_probability < 0.8:  # 20% chance - analytics update
                    self.send_analytics_update()
                else:  # 20% chance - just update charts
                    self.update_monthly_spending()
                    self.update_category_spending()
                
                # Wait 2-5 seconds before next event
                time.sleep(random.uniform(2, 5))
                
            except KeyboardInterrupt:
                print("\n🛑 Simulation stopped by user")
                break
            except Exception as e:
                print(f"❌ Error in simulation: {e}")
                time.sleep(1)
        
        print(f"✅ Buyer simulation completed after {duration_minutes} minutes")

    def stop(self):
        """Stop the simulation"""
        self.running = False

def main():
    """Main function to run buyer simulation"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Buyer Dashboard Chart Simulator')
    parser.add_argument('--url', default='http://localhost:3000/api/v1', 
                       help='API base URL')
    parser.add_argument('--user-id', default='buyer_001', 
                       help='Buyer user ID')
    parser.add_argument('--duration', type=int, default=10, 
                       help='Simulation duration in minutes')
    
    args = parser.parse_args()
    
    simulator = BuyerChartSimulator(args.url, args.user_id)
    
    try:
        simulator.run_simulation(args.duration)
    except KeyboardInterrupt:
        print("\n🛑 Simulation interrupted")
        simulator.stop()

if __name__ == "__main__":
    main()
