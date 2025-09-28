#!/usr/bin/env python3
"""
Test script to verify analytics endpoints are working
"""

import requests
import json
import time

def test_analytics_endpoints():
    base_url = "http://localhost:3000/api/v1"
    
    print("🧪 Testing Analytics Endpoints")
    print("=" * 40)
    
    # Test data
    test_data = {
        "success": True,
        "data": {
            "totalSpent": 300000,
            "activeOrders": 6,
            "completedPurchases": 45,
            "savedListings": 15,
            "monthlySpending": [
                {"name": "Jan", "value": 50000},
                {"name": "Feb", "value": 55000},
                {"name": "Mar", "value": 40000},
                {"name": "Apr", "value": 65000},
                {"name": "May", "value": 50000},
                {"name": "Jun", "value": 45000},
            ],
            "categorySpending": [
                {"name": "Cereals", "value": 130000},
                {"name": "Vegetables", "value": 90000},
                {"name": "Fruits", "value": 50000},
                {"name": "Pulses", "value": 30000},
            ]
        },
        "timestamp": "2024-01-15T10:30:00Z"
    }
    
    try:
        # Test storing buyer analytics
        print("📤 Testing POST /analytics/users/buyer_001")
        response = requests.post(
            f"{base_url}/analytics/users/buyer_001",
            json=test_data,
            timeout=5
        )
        
        if response.status_code == 200:
            print("✅ POST request successful")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ POST request failed: {response.status_code}")
            print(f"Response: {response.text}")
        
        time.sleep(1)
        
        # Test getting buyer analytics
        print("\n📥 Testing GET /analytics/users/buyer_001")
        response = requests.get(
            f"{base_url}/analytics/users/buyer_001?role=buyer",
            timeout=5
        )
        
        if response.status_code == 200:
            print("✅ GET request successful")
            data = response.json()
            print(f"Data source: {data.get('source', 'unknown')}")
            print(f"Total spent: ₹{data['data']['totalSpent']:,}")
            print(f"Active orders: {data['data']['activeOrders']}")
        else:
            print(f"❌ GET request failed: {response.status_code}")
            print(f"Response: {response.text}")
        
        time.sleep(1)
        
        # Test dashboard analytics
        print("\n📊 Testing dashboard analytics")
        dashboard_data = {
            "success": True,
            "data": {
                "totalUsers": 16000,
                "totalTransactions": 9500,
                "platformRevenue": 3000000,
                "activeListings": 1300,
                "userGrowth": [
                    {"name": "Jan", "value": 1300},
                    {"name": "Feb", "value": 1550},
                    {"name": "Mar", "value": 1780},
                    {"name": "Apr", "value": 2020},
                    {"name": "May", "value": 2250},
                    {"name": "Jun", "value": 2480},
                ]
            },
            "timestamp": "2024-01-15T10:30:00Z"
        }
        
        # Store dashboard data
        response = requests.post(
            f"{base_url}/analytics/dashboard",
            json=dashboard_data,
            timeout=5
        )
        
        if response.status_code == 200:
            print("✅ Dashboard data stored successfully")
        else:
            print(f"❌ Dashboard storage failed: {response.status_code}")
        
        # Get dashboard data
        response = requests.get(
            f"{base_url}/analytics/dashboard?role=admin",
            timeout=5
        )
        
        if response.status_code == 200:
            print("✅ Dashboard data retrieved successfully")
            data = response.json()
            print(f"Total users: {data['data']['totalUsers']:,}")
            print(f"Platform revenue: ₹{data['data']['platformRevenue']:,}")
        else:
            print(f"❌ Dashboard retrieval failed: {response.status_code}")
        
        print("\n🎉 Analytics endpoints test completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Make sure the backend server is running on port 3000")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    test_analytics_endpoints()
