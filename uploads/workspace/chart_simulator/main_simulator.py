#!/usr/bin/env python3
"""
Main Chart Simulator Orchestrator
Runs all dashboard chart simulations simultaneously for demonstration
"""

import argparse
import threading
import time
import signal
import sys
from typing import List, Dict, Any

# Import all simulators
from buyer_simulator import BuyerChartSimulator
from farmer_simulator import FarmerChartSimulator
from admin_simulator import AdminChartSimulator
from hub_simulator import HubOperatorChartSimulator
from shg_simulator import SHGLeaderChartSimulator

class ChartSimulatorOrchestrator:
    def __init__(self, base_url: str = "http://localhost:3000/api/v1"):
        self.base_url = base_url
        self.simulators: List[Any] = []
        self.threads: List[threading.Thread] = []
        self.running = False
        
        # Initialize all simulators
        self.simulators = [
            BuyerChartSimulator(base_url, "buyer_001"),
            FarmerChartSimulator(base_url, "farmer_001"),
            AdminChartSimulator(base_url, "admin_001"),
            HubOperatorChartSimulator(base_url, "hub_001"),
            SHGLeaderChartSimulator(base_url, "shg_001")
        ]
        
        # Setup signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)

    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        print(f"\n🛑 Received signal {signum}. Shutting down gracefully...")
        self.stop_all_simulations()

    def start_all_simulations(self, duration_minutes: int = 10):
        """Start all simulations in separate threads"""
        print("🚀 Starting Chart Simulator Orchestrator")
        print(f"🌐 API Base URL: {self.base_url}")
        print(f"⏱️ Duration: {duration_minutes} minutes")
        print("=" * 60)
        
        self.running = True
        
        # Start each simulator in its own thread
        for i, simulator in enumerate(self.simulators):
            thread = threading.Thread(
                target=self.run_simulator,
                args=(simulator, duration_minutes),
                name=f"Simulator-{i+1}",
                daemon=True
            )
            thread.start()
            self.threads.append(thread)
            time.sleep(1)  # Stagger starts
        
        print(f"✅ Started {len(self.simulators)} simulators")
        print("Press Ctrl+C to stop all simulations")
        
        # Wait for all threads to complete or until interrupted
        try:
            for thread in self.threads:
                thread.join()
        except KeyboardInterrupt:
            self.stop_all_simulations()

    def run_simulator(self, simulator: Any, duration_minutes: int):
        """Run a single simulator"""
        try:
            simulator.run_simulation(duration_minutes)
        except Exception as e:
            print(f"❌ Error in {simulator.__class__.__name__}: {e}")

    def stop_all_simulations(self):
        """Stop all running simulations"""
        if not self.running:
            return
            
        print("\n🛑 Stopping all simulations...")
        self.running = False
        
        # Stop each simulator
        for simulator in self.simulators:
            try:
                simulator.stop()
            except Exception as e:
                print(f"❌ Error stopping {simulator.__class__.__name__}: {e}")
        
        # Wait for threads to finish
        for thread in self.threads:
            if thread.is_alive():
                thread.join(timeout=5)
        
        print("✅ All simulations stopped")

    def run_single_simulator(self, simulator_type: str, duration_minutes: int = 10):
        """Run a single simulator type"""
        simulator_map = {
            "buyer": BuyerChartSimulator,
            "farmer": FarmerChartSimulator,
            "admin": AdminChartSimulator,
            "hub": HubOperatorChartSimulator,
            "shg": SHGLeaderChartSimulator
        }
        
        if simulator_type not in simulator_map:
            print(f"❌ Unknown simulator type: {simulator_type}")
            print(f"Available types: {', '.join(simulator_map.keys())}")
            return
        
        simulator_class = simulator_map[simulator_type]
        simulator = simulator_class(self.base_url, f"{simulator_type}_001")
        
        print(f"🚀 Starting {simulator_type} simulator only")
        print(f"🌐 API Base URL: {self.base_url}")
        print(f"⏱️ Duration: {duration_minutes} minutes")
        
        try:
            simulator.run_simulation(duration_minutes)
        except KeyboardInterrupt:
            print("\n🛑 Simulation interrupted")
            simulator.stop()

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Chart Simulator Orchestrator')
    parser.add_argument('--url', default='http://localhost:3000/api/v1', 
                       help='API base URL')
    parser.add_argument('--duration', type=int, default=10, 
                       help='Simulation duration in minutes')
    parser.add_argument('--type', choices=['buyer', 'farmer', 'admin', 'hub', 'shg', 'all'], 
                       default='all', help='Type of simulator to run')
    
    args = parser.parse_args()
    
    orchestrator = ChartSimulatorOrchestrator(args.url)
    
    if args.type == 'all':
        orchestrator.start_all_simulations(args.duration)
    else:
        orchestrator.run_single_simulator(args.type, args.duration)

if __name__ == "__main__":
    main()
