#!/usr/bin/env python3
"""
SHG Leader Dashboard Chart Simulator
Sends fake data to update SHG leader dashboard charts in real-time for demonstration
"""

import requests
import json
import time
import random
from datetime import datetime, timedelta
import threading
from typing import Dict, List, Any

class SHGLeaderChartSimulator:
    def __init__(self, base_url: str = "http://localhost:3000/api/v1", user_id: str = "shg_001"):
        self.base_url = base_url
        self.user_id = user_id
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Authorization': f'Bearer fake_token_{user_id}'
        })
        
        # Initial data state
        self.total_members = 25
        self.active_members = 22
        self.collective_earnings = 185000
        self.group_savings = 45000
        self.loans_disbursed = 8
        self.loans_repaid = 5
        
        # Chart data
        self.monthly_earnings = [
            {"name": "Jan", "value": 12000},
            {"name": "Feb", "value": 15000},
            {"name": "Mar", "value": 18000},
            {"name": "Apr", "value": 22000},
            {"name": "May", "value": 25000},
            {"name": "Jun", "value": 28000},
        ]
        
        self.member_contribution = [
            {"name": "Regular Members", "value": 18},
            {"name": "Active Contributors", "value": 15},
            {"name": "New Members", "value": 7},
            {"name": "Inactive Members", "value": 3},
        ]
        
        self.income_sources = [
            {"name": "Agricultural Sales", "value": 45},
            {"name": "Handicrafts", "value": 25},
            {"name": "Livestock", "value": 20},
            {"name": "Other Activities", "value": 10},
        ]
        
        self.savings_distribution = [
            {"name": "Emergency Fund", "value": 15000},
            {"name": "Investment Fund", "value": 12000},
            {"name": "Loan Fund", "value": 10000},
            {"name": "Development Fund", "value": 8000},
        ]
        
        self.loan_status = [
            {"name": "Active Loans", "value": 3},
            {"name": "Repaid Loans", "value": 5},
            {"name": "Pending Applications", "value": 2},
        ]
        
        self.running = False

    def generate_new_member(self) -> Dict[str, Any]:
        """Generate a new member simulation"""
        activities = ["agriculture", "handicrafts", "livestock", "trading"]
        villages = ["Khetri", "Rampur", "Bharatpur", "Alwar", "Jaipur"]
        
        return {
            "member_id": f"MEM_{int(time.time())}",
            "name": f"Member_{random.randint(1, 100)}",
            "activity": random.choice(activities),
            "village": random.choice(villages),
            "joining_date": datetime.now().isoformat(),
            "monthly_contribution": random.randint(500, 2000)
        }

    def generate_loan_application(self) -> Dict[str, Any]:
        """Generate a loan application simulation"""
        purposes = ["agricultural_equipment", "livestock_purchase", "business_expansion", "emergency"]
        
        return {
            "loan_id": f"LOAN_{int(time.time())}",
            "member_id": f"MEM_{random.randint(1, 25)}",
            "amount": random.randint(5000, 50000),
            "purpose": random.choice(purposes),
            "status": "pending",
            "application_date": datetime.now().isoformat()
        }

    def update_monthly_earnings(self):
        """Update monthly earnings data"""
        for month_data in self.monthly_earnings:
            # Seasonal variation (-8% to +15%)
            variation = random.uniform(-0.08, 0.15)
            month_data["value"] = int(month_data["value"] * (1 + variation))
        
        # Add new month if we're at the end
        if len(self.monthly_earnings) >= 12:
            self.monthly_earnings.pop(0)
        
        new_month = datetime.now().strftime("%b")
        if not any(m["name"] == new_month for m in self.monthly_earnings):
            self.monthly_earnings.append({
                "name": new_month,
                "value": random.randint(15000, 35000)
            })

    def update_member_contribution(self):
        """Update member contribution data"""
        # Slight variations in member contribution
        for member_data in self.member_contribution:
            variation = random.uniform(-0.02, 0.03)
            new_value = member_data["value"] * (1 + variation)
            member_data["value"] = max(0, int(new_value))

    def update_income_sources(self):
        """Update income sources distribution"""
        # Seasonal variations in income sources
        for income_data in self.income_sources:
            variation = random.uniform(-0.03, 0.05)
            new_value = income_data["value"] * (1 + variation)
            income_data["value"] = max(5, min(60, int(new_value)))

    def update_savings_distribution(self):
        """Update savings distribution"""
        for savings_data in self.savings_distribution:
            # Small variations in savings
            variation = random.uniform(-0.01, 0.02)
            new_value = savings_data["value"] * (1 + variation)
            savings_data["value"] = max(1000, int(new_value))

    def simulate_new_member_joining(self):
        """Simulate a new member joining the SHG"""
        new_member = self.generate_new_member()
        self.total_members += 1
        self.active_members += 1
        
        # Update member contribution
        for member_data in self.member_contribution:
            if member_data["name"] == "New Members":
                member_data["value"] += 1
                break
        
        print(f"👥 New member joined: {new_member['name']} - {new_member['activity']}")

    def simulate_collective_earning(self):
        """Simulate collective earning from group activities"""
        earning_amount = random.randint(2000, 8000)
        self.collective_earnings += earning_amount
        
        # Update income sources
        sources = ["Agricultural Sales", "Handicrafts", "Livestock", "Other Activities"]
        source = random.choice(sources)
        
        for income_data in self.income_sources:
            if income_data["name"] == source:
                income_data["value"] = min(60, income_data["value"] + 1)
                break
        
        print(f"💰 Collective earning: ₹{earning_amount:,} from {source}")

    def simulate_savings_contribution(self):
        """Simulate member savings contribution"""
        contribution_amount = random.randint(500, 3000)
        self.group_savings += contribution_amount
        
        # Update savings distribution
        funds = ["Emergency Fund", "Investment Fund", "Loan Fund", "Development Fund"]
        fund = random.choice(funds)
        
        for savings_data in self.savings_distribution:
            if savings_data["name"] == fund:
                savings_data["value"] += contribution_amount
                break
        
        print(f"💳 Savings contribution: ₹{contribution_amount:,} to {fund}")

    def simulate_loan_disbursement(self):
        """Simulate loan disbursement"""
        loan_app = self.generate_loan_application()
        loan_amount = loan_app["amount"]
        
        self.loans_disbursed += 1
        
        # Update loan status
        for loan_data in self.loan_status:
            if loan_data["name"] == "Active Loans":
                loan_data["value"] += 1
                break
        
        # Reduce loan fund
        for savings_data in self.savings_distribution:
            if savings_data["name"] == "Loan Fund":
                savings_data["value"] = max(0, savings_data["value"] - loan_amount)
                break
        
        print(f"🏦 Loan disbursed: ₹{loan_amount:,} for {loan_app['purpose']}")

    def simulate_loan_repayment(self):
        """Simulate loan repayment"""
        if self.loans_disbursed > self.loans_repaid:
            repayment_amount = random.randint(5000, 25000)
            self.loans_repaid += 1
            
            # Update loan status
            for loan_data in self.loan_status:
                if loan_data["name"] == "Repaid Loans":
                    loan_data["value"] += 1
                    break
                elif loan_data["name"] == "Active Loans":
                    loan_data["value"] = max(0, loan_data["value"] - 1)
                    break
            
            # Add to loan fund
            for savings_data in self.savings_distribution:
                if savings_data["name"] == "Loan Fund":
                    savings_data["value"] += repayment_amount
                    break
            
            print(f"✅ Loan repaid: ₹{repayment_amount:,}")

    def simulate_member_activity(self):
        """Simulate member activity changes"""
        if random.random() < 0.2:  # 20% chance
            # Member becomes active contributor
            for member_data in self.member_contribution:
                if member_data["name"] == "Active Contributors":
                    member_data["value"] = min(25, member_data["value"] + 1)
                    break
                elif member_data["name"] == "Regular Members":
                    member_data["value"] = max(0, member_data["value"] - 1)
                    break
            
            print(f"📈 Member became active contributor")

    def send_analytics_update(self):
        """Send updated analytics data to the API"""
        try:
            # Update chart data
            self.update_monthly_earnings()
            self.update_member_contribution()
            self.update_income_sources()
            self.update_savings_distribution()
            
            payload = {
                "success": True,
                "data": {
                    "totalMembers": self.total_members,
                    "activeMembers": self.active_members,
                    "collectiveEarnings": self.collective_earnings,
                    "groupSavings": self.group_savings,
                    "loansDisbursed": self.loans_disbursed,
                    "loansRepaid": self.loans_repaid,
                    "monthlyEarnings": self.monthly_earnings,
                    "memberContribution": self.member_contribution,
                    "incomeSources": self.income_sources,
                    "savingsDistribution": self.savings_distribution,
                    "loanStatus": self.loan_status
                },
                "timestamp": datetime.now().isoformat()
            }
            
            # Send to analytics endpoint
            response = self.session.post(
                f"{self.base_url}/analytics/shg/{self.user_id}",
                json=payload,
                timeout=5
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Analytics updated for SHG leader {self.user_id}")
            else:
                print(f"⚠️ Analytics update failed: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")

    def run_simulation(self, duration_minutes: int = 10):
        """Run the simulation for specified duration"""
        print(f"🚀 Starting SHG leader dashboard simulation for {duration_minutes} minutes...")
        print(f"👤 User ID: {self.user_id}")
        print(f"🌐 API Base URL: {self.base_url}")
        
        self.running = True
        start_time = time.time()
        end_time = start_time + (duration_minutes * 60)
        
        while self.running and time.time() < end_time:
            try:
                # Randomly trigger different events
                event_probability = random.random()
                
                if event_probability < 0.2:  # 20% chance - new member
                    self.simulate_new_member_joining()
                elif event_probability < 0.4:  # 20% chance - collective earning
                    self.simulate_collective_earning()
                elif event_probability < 0.6:  # 20% chance - savings contribution
                    self.simulate_savings_contribution()
                elif event_probability < 0.75:  # 15% chance - loan disbursement
                    self.simulate_loan_disbursement()
                elif event_probability < 0.85:  # 10% chance - loan repayment
                    self.simulate_loan_repayment()
                elif event_probability < 0.95:  # 10% chance - member activity
                    self.simulate_member_activity()
                else:  # 5% chance - analytics update
                    self.send_analytics_update()
                
                # Wait 4-7 seconds before next event
                time.sleep(random.uniform(4, 7))
                
            except KeyboardInterrupt:
                print("\n🛑 Simulation stopped by user")
                break
            except Exception as e:
                print(f"❌ Error in simulation: {e}")
                time.sleep(1)
        
        print(f"✅ SHG leader simulation completed after {duration_minutes} minutes")

    def stop(self):
        """Stop the simulation"""
        self.running = False

def main():
    """Main function to run SHG leader simulation"""
    import argparse
    
    parser = argparse.ArgumentParser(description='SHG Leader Dashboard Chart Simulator')
    parser.add_argument('--url', default='http://localhost:3000/api/v1', 
                       help='API base URL')
    parser.add_argument('--user-id', default='shg_001', 
                       help='SHG leader user ID')
    parser.add_argument('--duration', type=int, default=10, 
                       help='Simulation duration in minutes')
    
    args = parser.parse_args()
    
    simulator = SHGLeaderChartSimulator(args.url, args.user_id)
    
    try:
        simulator.run_simulation(args.duration)
    except KeyboardInterrupt:
        print("\n🛑 Simulation interrupted")
        simulator.stop()

if __name__ == "__main__":
    main()
