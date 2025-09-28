#!/usr/bin/env python3
"""
Hub Operator Dashboard Chart Simulator
Sends fake data to update hub operator dashboard charts in real-time for demonstration
"""

import requests
import json
import time
import random
from datetime import datetime, timedelta
import threading
from typing import Dict, List, Any

class HubOperatorChartSimulator:
    def __init__(self, base_url: str = "http://localhost:3000/api/v1", user_id: str = "hub_001"):
        self.base_url = base_url
        self.user_id = user_id
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Authorization': f'Bearer fake_token_{user_id}'
        })
        
        # Initial data state
        self.total_orders_processed = 1250
        self.active_orders = 45
        self.completed_orders = 1205
        self.pending_pickups = 12
        self.hub_revenue = 125000
        
        # Chart data
        self.daily_orders = [
            {"name": "Mon", "value": 45},
            {"name": "Tue", "value": 52},
            {"name": "Wed", "value": 38},
            {"name": "Thu", "value": 61},
            {"name": "Fri", "value": 48},
            {"name": "Sat", "value": 41},
            {"name": "Sun", "value": 35},
        ]
        
        self.order_status_distribution = [
            {"name": "Pending Pickup", "value": 12},
            {"name": "In Transit", "value": 18},
            {"name": "Quality Check", "value": 8},
            {"name": "Delivered", "value": 7},
        ]
        
        self.revenue_by_day = [
            {"name": "Mon", "value": 8500},
            {"name": "Tue", "value": 9200},
            {"name": "Wed", "value": 6800},
            {"name": "Thu", "value": 10500},
            {"name": "Fri", "value": 8800},
            {"name": "Sat", "value": 7200},
            {"name": "Sun", "value": 6100},
        ]
        
        self.farmer_distribution = [
            {"name": "Local Farmers", "value": 65},
            {"name": "Nearby Villages", "value": 25},
            {"name": "Distant Areas", "value": 10},
        ]
        
        self.running = False

    def generate_new_order(self) -> Dict[str, Any]:
        """Generate a new order simulation"""
        products = ["Basmati Rice", "Fresh Onions", "Wheat", "Tomatoes", "Potatoes", "Carrots"]
        farmers = ["Rajesh Kumar", "Sunita Devi", "Amit Singh", "Priya Sharma", "Vikram Patel"]
        villages = ["Khetri", "Rampur", "Bharatpur", "Alwar", "Jaipur"]
        
        return {
            "order_id": f"HUB_ORD_{int(time.time())}",
            "product_name": random.choice(products),
            "quantity": random.randint(50, 500),
            "farmer_name": random.choice(farmers),
            "village_name": random.choice(villages),
            "status": "pending_pickup",
            "created_at": datetime.now().isoformat(),
            "pickup_date": (datetime.now() + timedelta(hours=random.randint(1, 24))).isoformat()
        }

    def update_daily_orders(self):
        """Update daily orders data"""
        current_day = datetime.now().strftime("%a")
        
        # Find current day and update
        for day_data in self.daily_orders:
            if day_data["name"] == current_day:
                # Add 1-5 new orders
                day_data["value"] += random.randint(1, 5)
                break

    def update_order_status_distribution(self):
        """Update order status distribution"""
        # Randomly move orders between statuses
        statuses = ["Pending Pickup", "In Transit", "Quality Check", "Delivered"]
        
        for status_data in self.order_status_distribution:
            if status_data["name"] in statuses:
                # Small variations
                variation = random.randint(-2, 3)
                status_data["value"] = max(0, status_data["value"] + variation)

    def update_revenue_by_day(self):
        """Update revenue by day"""
        current_day = datetime.now().strftime("%a")
        
        # Find current day and update
        for day_data in self.revenue_by_day:
            if day_data["name"] == current_day:
                # Add revenue from new orders
                revenue_increase = random.randint(500, 2000)
                day_data["value"] += revenue_increase
                break

    def update_farmer_distribution(self):
        """Update farmer distribution"""
        # Slight variations in farmer distribution
        for farmer_data in self.farmer_distribution:
            variation = random.uniform(-0.02, 0.03)
            new_value = farmer_data["value"] * (1 + variation)
            farmer_data["value"] = max(5, min(80, int(new_value)))

    def simulate_new_order_arrival(self):
        """Simulate a new order arriving at the hub"""
        order = self.generate_new_order()
        self.total_orders_processed += 1
        self.active_orders += 1
        self.pending_pickups += 1
        
        # Update farmer distribution based on village
        village = order["village_name"]
        if village in ["Khetri", "Rampur"]:  # Local villages
            for farmer_dist in self.farmer_distribution:
                if farmer_dist["name"] == "Local Farmers":
                    farmer_dist["value"] = min(80, farmer_dist["value"] + 1)
                    break
        elif village in ["Bharatpur", "Alwar"]:  # Nearby villages
            for farmer_dist in self.farmer_distribution:
                if farmer_dist["name"] == "Nearby Villages":
                    farmer_dist["value"] = min(30, farmer_dist["value"] + 1)
                    break
        else:  # Distant areas
            for farmer_dist in self.farmer_distribution:
                if farmer_dist["name"] == "Distant Areas":
                    farmer_dist["value"] = min(15, farmer_dist["value"] + 1)
                    break
        
        print(f"📦 New order arrived: {order['product_name']} from {order['farmer_name']}")

    def simulate_order_pickup(self):
        """Simulate picking up an order"""
        if self.pending_pickups > 0:
            if random.random() < 0.4:  # 40% chance
                self.pending_pickups -= 1
                # Order moves to "In Transit" status
                for status_data in self.order_status_distribution:
                    if status_data["name"] == "In Transit":
                        status_data["value"] += 1
                        break
                
                print(f"🚚 Order picked up! Pending: {self.pending_pickups}")

    def simulate_order_delivery(self):
        """Simulate delivering an order"""
        if self.active_orders > 0:
            if random.random() < 0.3:  # 30% chance
                self.active_orders -= 1
                self.completed_orders += 1
                
                # Generate revenue
                revenue = random.randint(200, 1000)
                self.hub_revenue += revenue
                
                # Update status distribution
                for status_data in self.order_status_distribution:
                    if status_data["name"] == "Delivered":
                        status_data["value"] += 1
                        break
                
                print(f"✅ Order delivered! Revenue: ₹{revenue}, Completed: {self.completed_orders}")

    def simulate_quality_check(self):
        """Simulate quality check process"""
        if self.active_orders > 0 and random.random() < 0.25:  # 25% chance
            # Move order to quality check
            for status_data in self.order_status_distribution:
                if status_data["name"] == "Quality Check":
                    status_data["value"] += 1
                    break
            
            print(f"🔍 Quality check in progress")

    def send_analytics_update(self):
        """Send updated analytics data to the API"""
        try:
            # Update chart data
            self.update_daily_orders()
            self.update_order_status_distribution()
            self.update_revenue_by_day()
            self.update_farmer_distribution()
            
            payload = {
                "success": True,
                "data": {
                    "totalOrdersProcessed": self.total_orders_processed,
                    "activeOrders": self.active_orders,
                    "completedOrders": self.completed_orders,
                    "pendingPickups": self.pending_pickups,
                    "hubRevenue": self.hub_revenue,
                    "dailyOrders": self.daily_orders,
                    "orderStatusDistribution": self.order_status_distribution,
                    "revenueByDay": self.revenue_by_day,
                    "farmerDistribution": self.farmer_distribution
                },
                "timestamp": datetime.now().isoformat()
            }
            
            # Send to analytics endpoint
            response = self.session.post(
                f"{self.base_url}/analytics/hubs/{self.user_id}",
                json=payload,
                timeout=5
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Analytics updated for hub operator {self.user_id}")
            else:
                print(f"⚠️ Analytics update failed: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")

    def run_simulation(self, duration_minutes: int = 10):
        """Run the simulation for specified duration"""
        print(f"🚀 Starting hub operator dashboard simulation for {duration_minutes} minutes...")
        print(f"👤 User ID: {self.user_id}")
        print(f"🌐 API Base URL: {self.base_url}")
        
        self.running = True
        start_time = time.time()
        end_time = start_time + (duration_minutes * 60)
        
        while self.running and time.time() < end_time:
            try:
                # Randomly trigger different events
                event_probability = random.random()
                
                if event_probability < 0.3:  # 30% chance - new order arrival
                    self.simulate_new_order_arrival()
                elif event_probability < 0.5:  # 20% chance - order pickup
                    self.simulate_order_pickup()
                elif event_probability < 0.7:  # 20% chance - order delivery
                    self.simulate_order_delivery()
                elif event_probability < 0.8:  # 10% chance - quality check
                    self.simulate_quality_check()
                else:  # 20% chance - analytics update
                    self.send_analytics_update()
                
                # Wait 3-5 seconds before next event
                time.sleep(random.uniform(3, 5))
                
            except KeyboardInterrupt:
                print("\n🛑 Simulation stopped by user")
                break
            except Exception as e:
                print(f"❌ Error in simulation: {e}")
                time.sleep(1)
        
        print(f"✅ Hub operator simulation completed after {duration_minutes} minutes")

    def stop(self):
        """Stop the simulation"""
        self.running = False

def main():
    """Main function to run hub operator simulation"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Hub Operator Dashboard Chart Simulator')
    parser.add_argument('--url', default='http://localhost:3000/api/v1', 
                       help='API base URL')
    parser.add_argument('--user-id', default='hub_001', 
                       help='Hub operator user ID')
    parser.add_argument('--duration', type=int, default=10, 
                       help='Simulation duration in minutes')
    
    args = parser.parse_args()
    
    simulator = HubOperatorChartSimulator(args.url, args.user_id)
    
    try:
        simulator.run_simulation(args.duration)
    except KeyboardInterrupt:
        print("\n🛑 Simulation interrupted")
        simulator.stop()

if __name__ == "__main__":
    main()
