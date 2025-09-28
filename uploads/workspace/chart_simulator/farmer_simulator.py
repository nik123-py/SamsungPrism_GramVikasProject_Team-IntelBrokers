#!/usr/bin/env python3
"""
Farmer Dashboard Chart Simulator
Sends fake data to update farmer dashboard charts in real-time for demonstration
"""

import requests
import json
import time
import random
from datetime import datetime, timedelta
import threading
from typing import Dict, List, Any

class FarmerChartSimulator:
    def __init__(self, base_url: str = "http://localhost:3000/api/v1", user_id: str = "farmer_001"):
        self.base_url = base_url
        self.user_id = user_id
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Authorization': f'Bearer fake_token_{user_id}'
        })
        
        # Initial data state
        self.total_earnings = 125000
        self.active_listings = 8
        self.completed_orders = 24
        self.pending_orders = 3
        
        # Chart data
        self.monthly_earnings = [
            {"name": "Jan", "value": 15000},
            {"name": "Feb", "value": 18000},
            {"name": "Mar", "value": 22000},
            {"name": "Apr", "value": 25000},
            {"name": "May", "value": 28000},
            {"name": "Jun", "value": 17000},
        ]
        
        self.crop_distribution = [
            {"name": "Rice", "value": 40},
            {"name": "Wheat", "value": 30},
            {"name": "Vegetables", "value": 20},
            {"name": "Others", "value": 10},
        ]
        
        self.running = False

    def generate_new_listing(self) -> Dict[str, Any]:
        """Generate a new listing simulation"""
        products = ["Basmati Rice", "Fresh Tomatoes", "Wheat", "Onions", "Potatoes", "Carrots", "Cauliflower"]
        crops = ["Rice", "Wheat", "Vegetables", "Others"]
        
        product = random.choice(products)
        crop_type = self.get_crop_type(product)
        
        return {
            "listing_id": f"LST_{int(time.time())}",
            "product_name": product,
            "quantity": random.randint(20, 500),
            "asking_price": random.randint(15, 3000),
            "status": "active",
            "total_bids": 0,
            "highest_bid": None,
            "created_at": datetime.now().isoformat(),
            "crop_type": crop_type
        }

    def get_crop_type(self, product_name: str) -> str:
        """Map product to crop type"""
        if any(word in product_name.lower() for word in ["rice", "basmati"]):
            return "Rice"
        elif any(word in product_name.lower() for word in ["wheat"]):
            return "Wheat"
        elif any(word in product_name.lower() for word in ["tomato", "onion", "potato", "carrot", "cauliflower"]):
            return "Vegetables"
        else:
            return "Others"

    def update_monthly_earnings(self):
        """Update monthly earnings data with seasonal variations"""
        for month_data in self.monthly_earnings:
            # Seasonal variation (-10% to +15%)
            variation = random.uniform(-0.10, 0.15)
            month_data["value"] = int(month_data["value"] * (1 + variation))
        
        # Add new month if we're at the end
        if len(self.monthly_earnings) >= 12:
            self.monthly_earnings.pop(0)
        
        new_month = datetime.now().strftime("%b")
        if not any(m["name"] == new_month for m in self.monthly_earnings):
            self.monthly_earnings.append({
                "name": new_month,
                "value": random.randint(12000, 32000)
            })

    def update_crop_distribution(self):
        """Update crop distribution based on new listings"""
        # Slight variations in crop distribution
        for crop_data in self.crop_distribution:
            variation = random.uniform(-0.02, 0.03)
            new_value = crop_data["value"] * (1 + variation)
            crop_data["value"] = max(5, min(50, int(new_value)))  # Keep within 5-50%

    def simulate_new_listing(self):
        """Simulate creating a new listing"""
        listing = self.generate_new_listing()
        self.active_listings += 1
        
        # Update crop distribution
        crop_type = listing["crop_type"]
        for crop in self.crop_distribution:
            if crop["name"] == crop_type:
                crop["value"] = min(50, crop["value"] + 1)
                break
        
        print(f"🌱 New listing: {listing['product_name']} - {listing['quantity']} units @ ₹{listing['asking_price']}")

    def simulate_listing_sale(self):
        """Simulate a listing being sold"""
        if self.active_listings > 0:
            # Randomly sell a listing
            if random.random() < 0.25:  # 25% chance
                self.active_listings -= 1
                self.completed_orders += 1
                
                # Generate earnings
                earnings = random.randint(5000, 25000)
                self.total_earnings += earnings
                
                print(f"💰 Listing sold! Earnings: ₹{earnings:,}, Active: {self.active_listings}")

    def simulate_new_bid(self):
        """Simulate receiving a new bid on a listing"""
        if self.active_listings > 0 and random.random() < 0.3:  # 30% chance
            bid_amount = random.randint(1000, 5000)
            print(f"📈 New bid received: ₹{bid_amount:,}")

    def simulate_order_completion(self):
        """Simulate completing a pending order"""
        if self.pending_orders > 0:
            if random.random() < 0.2:  # 20% chance
                self.pending_orders -= 1
                self.completed_orders += 1
                
                # Generate earnings
                earnings = random.randint(3000, 15000)
                self.total_earnings += earnings
                
                print(f"✅ Order completed! Earnings: ₹{earnings:,}, Pending: {self.pending_orders}")

    def send_analytics_update(self):
        """Send updated analytics data to the API"""
        try:
            # Update chart data
            self.update_monthly_earnings()
            self.update_crop_distribution()
            
            payload = {
                "success": True,
                "data": {
                    "totalEarnings": self.total_earnings,
                    "activeListings": self.active_listings,
                    "completedOrders": self.completed_orders,
                    "pendingOrders": self.pending_orders,
                    "monthlyEarnings": self.monthly_earnings,
                    "cropDistribution": self.crop_distribution
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
                print(f"✅ Analytics updated for farmer {self.user_id}")
            else:
                print(f"⚠️ Analytics update failed: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")

    def run_simulation(self, duration_minutes: int = 10):
        """Run the simulation for specified duration"""
        print(f"🚀 Starting farmer dashboard simulation for {duration_minutes} minutes...")
        print(f"👤 User ID: {self.user_id}")
        print(f"🌐 API Base URL: {self.base_url}")
        
        self.running = True
        start_time = time.time()
        end_time = start_time + (duration_minutes * 60)
        
        while self.running and time.time() < end_time:
            try:
                # Randomly trigger different events
                event_probability = random.random()
                
                if event_probability < 0.3:  # 30% chance - new listing
                    self.simulate_new_listing()
                elif event_probability < 0.5:  # 20% chance - listing sale
                    self.simulate_listing_sale()
                elif event_probability < 0.7:  # 20% chance - new bid
                    self.simulate_new_bid()
                elif event_probability < 0.8:  # 10% chance - order completion
                    self.simulate_order_completion()
                else:  # 20% chance - analytics update
                    self.send_analytics_update()
                
                # Wait 3-6 seconds before next event
                time.sleep(random.uniform(3, 6))
                
            except KeyboardInterrupt:
                print("\n🛑 Simulation stopped by user")
                break
            except Exception as e:
                print(f"❌ Error in simulation: {e}")
                time.sleep(1)
        
        print(f"✅ Farmer simulation completed after {duration_minutes} minutes")

    def stop(self):
        """Stop the simulation"""
        self.running = False

def main():
    """Main function to run farmer simulation"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Farmer Dashboard Chart Simulator')
    parser.add_argument('--url', default='http://localhost:3000/api/v1', 
                       help='API base URL')
    parser.add_argument('--user-id', default='farmer_001', 
                       help='Farmer user ID')
    parser.add_argument('--duration', type=int, default=10, 
                       help='Simulation duration in minutes')
    
    args = parser.parse_args()
    
    simulator = FarmerChartSimulator(args.url, args.user_id)
    
    try:
        simulator.run_simulation(args.duration)
    except KeyboardInterrupt:
        print("\n🛑 Simulation interrupted")
        simulator.stop()

if __name__ == "__main__":
    main()
