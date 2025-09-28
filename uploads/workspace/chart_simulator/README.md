# Chart Simulator for Gram-Vikas Dashboard

This directory contains Python scripts that simulate real-time data updates for all dashboard charts in the Gram-Vikas platform. These scripts are designed for demonstration purposes to show how charts update dynamically.

## Features

- **Buyer Dashboard Simulator**: Simulates purchases, order status changes, and spending patterns
- **Farmer Dashboard Simulator**: Simulates listings, sales, earnings, and crop distribution
- **Admin Dashboard Simulator**: Simulates platform-wide metrics, user growth, and system alerts
- **Hub Operator Simulator**: Simulates order processing, deliveries, and hub operations
- **SHG Leader Simulator**: Simulates group activities, savings, loans, and member management

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Run All Simulators
```bash
python main_simulator.py --duration 10
```

### Run Specific Simulator
```bash
# Buyer only
python main_simulator.py --type buyer --duration 10

# Farmer only
python main_simulator.py --type farmer --duration 10

# Admin only
python main_simulator.py --type admin --duration 10

# Hub operator only
python main_simulator.py --type hub --duration 10

# SHG leader only
python main_simulator.py --type shg --duration 10
```

### Run Individual Scripts
```bash
# Buyer simulator
python buyer_simulator.py --duration 10

# Farmer simulator
python farmer_simulator.py --duration 10

# Admin simulator
python admin_simulator.py --duration 10

# Hub operator simulator
python hub_simulator.py --duration 10

# SHG leader simulator
python shg_simulator.py --duration 10
```

## Configuration

### API Base URL
Default: `http://localhost:3000/api/v1`

To change the API URL:
```bash
python main_simulator.py --url http://your-api-url/api/v1
```

### User IDs
Each simulator uses different user IDs:
- Buyer: `buyer_001`
- Farmer: `farmer_001`
- Admin: `admin_001`
- Hub Operator: `hub_001`
- SHG Leader: `shg_001`

To change user IDs, modify the scripts or use the individual scripts with custom parameters.

## What Each Simulator Does

### Buyer Simulator
- Simulates new purchases with varying amounts
- Updates monthly spending charts
- Changes order statuses (confirmed → picked_up → delivered)
- Updates category-wise spending
- Generates realistic purchase patterns

### Farmer Simulator
- Creates new product listings
- Simulates listing sales and earnings
- Updates monthly earnings trends
- Changes crop distribution based on sales
- Simulates bid activity on listings

### Admin Simulator
- Simulates new user registrations
- Updates platform transaction volume
- Generates system alerts (errors, warnings, info)
- Updates user growth charts
- Simulates revenue by category

### Hub Operator Simulator
- Simulates order arrivals at hub
- Updates order processing status
- Tracks delivery completions
- Updates daily order volumes
- Simulates farmer distribution patterns

### SHG Leader Simulator
- Simulates new member joining
- Updates collective earnings
- Tracks savings contributions
- Simulates loan disbursements and repayments
- Updates member activity levels

## API Endpoints

The simulators send data to these endpoints:
- `/analytics/users/{user_id}` - User-specific analytics
- `/analytics/dashboard` - Admin dashboard analytics
- `/analytics/hubs/{hub_id}` - Hub-specific analytics
- `/analytics/shg/{shg_id}` - SHG-specific analytics

## Stopping Simulations

Press `Ctrl+C` to stop all running simulations gracefully.

## Testing the Setup

### 1. Test Analytics Endpoints
Before running the simulators, test if the analytics endpoints are working:

```bash
python test_analytics.py
```

This will test the POST and GET endpoints for analytics data.

### 2. Start Backend Server
Make sure the backend server is running:

```bash
cd uploads/workspace/backend
npm install
npm start
```

The server should start on port 3000.

### 3. Start Frontend Server
In a new terminal, start the frontend:

```bash
cd uploads/workspace/frontend
npm install
npm run dev
```

The frontend should start on port 3001.

### 4. Run Chart Simulators
In another terminal, run the simulators:

```bash
cd uploads/workspace/chart_simulator
pip install -r requirements.txt
python main_simulator.py --duration 10
```

### 5. View Live Updates
Open your browser and navigate to:
- Buyer Dashboard: `http://localhost:3001/dashboard` (login as buyer)
- Farmer Dashboard: `http://localhost:3001/dashboard` (login as farmer)
- Admin Dashboard: `http://localhost:3001/dashboard` (login as admin)

The charts should update every 5 seconds with new data from the simulators.

## Quick Start (All-in-One)

For a quick demo, you can use the startup script:

```bash
python startup.py
```

This will start the backend, frontend, and simulators automatically.

## Troubleshooting

### Backend Not Starting
- Check if port 3000 is available
- Make sure all dependencies are installed: `npm install`
- Check the backend logs for errors

### Frontend Not Loading
- Check if port 3001 is available
- Make sure all dependencies are installed: `npm install`
- Check the frontend logs for errors

### Charts Not Updating
- Verify the backend server is running
- Check browser console for API errors
- Test analytics endpoints with `python test_analytics.py`
- Make sure simulators are running and sending data

### Simulators Not Working
- Check if Python dependencies are installed: `pip install -r requirements.txt`
- Verify the backend server is running on port 3000
- Check simulator logs for connection errors
