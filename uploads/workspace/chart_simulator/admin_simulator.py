#!/usr/bin/env python3
"""
Admin Dashboard Chart Simulator
Sends fake data to update admin dashboard charts in real-time for demonstration
"""

import requests
import json
import time
import random
from datetime import datetime, timedelta
import threading
from typing import Dict, List, Any

class AdminChartSimulator:
    def __init__(self, base_url: str = "http://localhost:3000/api/v1", user_id: str = "admin_001"):
        self.base_url = base_url
        self.user_id = user_id
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Authorization': f'Bearer fake_token_{user_id}'
        })
        
        # Initial data state
        self.total_users = 15420
        self.total_transactions = 8945
        self.platform_revenue = 2850000
        self.active_listings = 1250
        
        # Chart data
        self.user_growth = [
            {"name": "Jan", "value": 1200},
            {"name": "Feb", "value": 1450},
            {"name": "Mar", "value": 1680},
            {"name": "Apr", "value": 1920},
            {"name": "May", "value": 2150},
            {"name": "Jun", "value": 2380},
        ]
        
        self.transaction_volume = [
            {"name": "Jan", "value": 450000},
            {"name": "Feb", "value": 520000},
            {"name": "Mar", "value": 480000},
            {"name": "Apr", "value": 610000},
            {"name": "May", "value": 580000},
            {"name": "Jun", "value": 650000},
        ]
        
        self.user_distribution = [
            {"name": "Farmers", "value": 8500},
            {"name": "Buyers", "value": 3200},
            {"name": "Hub Operators", "value": 450},
            {"name": "SHG Leaders", "value": 2800},
            {"name": "Aggregators", "value": 470},
        ]
        
        self.revenue_by_category = [
            {"name": "Cereals", "value": 1200000},
            {"name": "Vegetables", "value": 850000},
            {"name": "Fruits", "value": 450000},
            {"name": "Pulses", "value": 350000},
        ]
        
        self.system_alerts = [
            {
                "id": "1",
                "type": "error",
                "title": "Payment Gateway Issue",
                "description": "Some transactions are failing due to gateway timeout",
                "timestamp": datetime.now().isoformat(),
                "resolved": False
            },
            {
                "id": "2",
                "type": "warning",
                "title": "High Server Load",
                "description": "API response times are above normal thresholds",
                "timestamp": datetime.now().isoformat(),
                "resolved": False
            }
        ]
        
        self.running = False

    def generate_new_user(self) -> Dict[str, Any]:
        """Generate a new user registration simulation"""
        roles = ["farmer", "buyer", "hub_operator", "shg_leader", "aggregator"]
        villages = ["Khetri", "Rampur", "Bharatpur", "Alwar", "Jaipur", "Udaipur", "Jodhpur"]
        
        return {
            "user_id": f"user_{int(time.time())}",
            "role": random.choice(roles),
            "village": random.choice(villages),
            "registration_date": datetime.now().isoformat()
        }

    def update_user_growth(self):
        """Update user growth data"""
        for month_data in self.user_growth:
            # Growth variation (-2% to +8%)
            variation = random.uniform(-0.02, 0.08)
            month_data["value"] = int(month_data["value"] * (1 + variation))
        
        # Add new month if we're at the end
        if len(self.user_growth) >= 12:
            self.user_growth.pop(0)
        
        new_month = datetime.now().strftime("%b")
        if not any(m["name"] == new_month for m in self.user_growth):
            self.user_growth.append({
                "name": new_month,
                "value": random.randint(2000, 3000)
            })

    def update_transaction_volume(self):
        """Update transaction volume data"""
        for month_data in self.transaction_volume:
            # Volume variation (-5% to +12%)
            variation = random.uniform(-0.05, 0.12)
            month_data["value"] = int(month_data["value"] * (1 + variation))
        
        # Add new month if we're at the end
        if len(self.transaction_volume) >= 12:
            self.transaction_volume.pop(0)
        
        new_month = datetime.now().strftime("%b")
        if not any(m["name"] == new_month for m in self.transaction_volume):
            self.transaction_volume.append({
                "name": new_month,
                "value": random.randint(600000, 800000)
            })

    def update_user_distribution(self):
        """Update user distribution based on new registrations"""
        # Slight variations in user distribution
        for user_data in self.user_distribution:
            variation = random.uniform(-0.01, 0.02)
            new_value = user_data["value"] * (1 + variation)
            user_data["value"] = max(100, int(new_value))

    def update_revenue_by_category(self):
        """Update revenue by category"""
        for revenue_data in self.revenue_by_category:
            # Revenue variation (-3% to +10%)
            variation = random.uniform(-0.03, 0.10)
            revenue_data["value"] = int(revenue_data["value"] * (1 + variation))

    def simulate_new_user_registration(self):
        """Simulate a new user registration"""
        new_user = self.generate_new_user()
        self.total_users += 1
        
        # Update user distribution
        role = new_user["role"]
        role_mapping = {
            "farmer": "Farmers",
            "buyer": "Buyers",
            "hub_operator": "Hub Operators",
            "shg_leader": "SHG Leaders",
            "aggregator": "Aggregators"
        }
        
        role_name = role_mapping.get(role, "Farmers")
        for user_dist in self.user_distribution:
            if user_dist["name"] == role_name:
                user_dist["value"] += 1
                break
        
        print(f"👤 New user registered: {role} from {new_user['village']}")

    def simulate_new_transaction(self):
        """Simulate a new transaction"""
        transaction_amount = random.randint(1000, 50000)
        self.total_transactions += 1
        self.platform_revenue += int(transaction_amount * 0.05)  # 5% platform fee
        
        # Update revenue by category
        categories = ["Cereals", "Vegetables", "Fruits", "Pulses"]
        category = random.choice(categories)
        for rev_data in self.revenue_by_category:
            if rev_data["name"] == category:
                rev_data["value"] += transaction_amount
                break
        
        print(f"💳 New transaction: ₹{transaction_amount:,} in {category}")

    def simulate_new_listing(self):
        """Simulate a new listing being created"""
        self.active_listings += 1
        print(f"📝 New listing created! Total active: {self.active_listings}")

    def simulate_system_alert(self):
        """Simulate a new system alert"""
        alert_types = ["error", "warning", "info"]
        alert_titles = [
            "Database Connection Slow",
            "High Memory Usage",
            "Payment Gateway Timeout",
            "New Hub Registration",
            "SMS Service Degraded",
            "API Rate Limit Exceeded"
        ]
        
        alert_descriptions = [
            "Database queries are taking longer than usual",
            "Server memory usage is above 80%",
            "Payment gateway is experiencing timeouts",
            "New aggregation hub has been registered",
            "SMS delivery service is experiencing delays",
            "API rate limits have been exceeded"
        ]
        
        alert_type = random.choice(alert_types)
        alert_title = random.choice(alert_titles)
        alert_description = random.choice(alert_descriptions)
        
        new_alert = {
            "id": f"alert_{int(time.time())}",
            "type": alert_type,
            "title": alert_title,
            "description": alert_description,
            "timestamp": datetime.now().isoformat(),
            "resolved": False
        }
        
        self.system_alerts.append(new_alert)
        
        # Keep only last 10 alerts
        if len(self.system_alerts) > 10:
            self.system_alerts.pop(0)
        
        print(f"🚨 New {alert_type} alert: {alert_title}")

    def simulate_alert_resolution(self):
        """Simulate resolving an alert"""
        unresolved_alerts = [alert for alert in self.system_alerts if not alert["resolved"]]
        if unresolved_alerts and random.random() < 0.3:  # 30% chance
            alert = random.choice(unresolved_alerts)
            alert["resolved"] = True
            print(f"✅ Alert resolved: {alert['title']}")

    def send_analytics_update(self):
        """Send updated analytics data to the API"""
        try:
            # Update chart data
            self.update_user_growth()
            self.update_transaction_volume()
            self.update_user_distribution()
            self.update_revenue_by_category()
            
            payload = {
                "success": True,
                "data": {
                    "totalUsers": self.total_users,
                    "totalTransactions": self.total_transactions,
                    "platformRevenue": self.platform_revenue,
                    "activeListings": self.active_listings,
                    "userGrowth": self.user_growth,
                    "transactionVolume": self.transaction_volume,
                    "userDistribution": self.user_distribution,
                    "revenueByCategory": self.revenue_by_category,
                    "systemAlerts": self.system_alerts
                },
                "timestamp": datetime.now().isoformat()
            }
            
            # Send to analytics endpoint
            response = self.session.post(
                f"{self.base_url}/analytics/dashboard",
                json=payload,
                timeout=5
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Analytics updated for admin {self.user_id}")
            else:
                print(f"⚠️ Analytics update failed: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")

    def run_simulation(self, duration_minutes: int = 10):
        """Run the simulation for specified duration"""
        print(f"🚀 Starting admin dashboard simulation for {duration_minutes} minutes...")
        print(f"👤 User ID: {self.user_id}")
        print(f"🌐 API Base URL: {self.base_url}")
        
        self.running = True
        start_time = time.time()
        end_time = start_time + (duration_minutes * 60)
        
        while self.running and time.time() < end_time:
            try:
                # Randomly trigger different events
                event_probability = random.random()
                
                if event_probability < 0.25:  # 25% chance - new user
                    self.simulate_new_user_registration()
                elif event_probability < 0.45:  # 20% chance - new transaction
                    self.simulate_new_transaction()
                elif event_probability < 0.55:  # 10% chance - new listing
                    self.simulate_new_listing()
                elif event_probability < 0.70:  # 15% chance - system alert
                    self.simulate_system_alert()
                elif event_probability < 0.80:  # 10% chance - alert resolution
                    self.simulate_alert_resolution()
                else:  # 20% chance - analytics update
                    self.send_analytics_update()
                
                # Wait 2-4 seconds before next event
                time.sleep(random.uniform(2, 4))
                
            except KeyboardInterrupt:
                print("\n🛑 Simulation stopped by user")
                break
            except Exception as e:
                print(f"❌ Error in simulation: {e}")
                time.sleep(1)
        
        print(f"✅ Admin simulation completed after {duration_minutes} minutes")

    def stop(self):
        """Stop the simulation"""
        self.running = False

def main():
    """Main function to run admin simulation"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Admin Dashboard Chart Simulator')
    parser.add_argument('--url', default='http://localhost:3000/api/v1', 
                       help='API base URL')
    parser.add_argument('--user-id', default='admin_001', 
                       help='Admin user ID')
    parser.add_argument('--duration', type=int, default=10, 
                       help='Simulation duration in minutes')
    
    args = parser.parse_args()
    
    simulator = AdminChartSimulator(args.url, args.user_id)
    
    try:
        simulator.run_simulation(args.duration)
    except KeyboardInterrupt:
        print("\n🛑 Simulation interrupted")
        simulator.stop()

if __name__ == "__main__":
    main()
