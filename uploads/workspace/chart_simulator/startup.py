#!/usr/bin/env python3
"""
Startup script to run backend server and chart simulators
"""

import subprocess
import time
import sys
import os
import signal
import threading

def run_backend():
    """Start the backend server"""
    print("🚀 Starting backend server...")
    os.chdir("uploads/workspace/backend")
    subprocess.run(["npm", "start"], check=True)

def run_frontend():
    """Start the frontend server"""
    print("🌐 Starting frontend server...")
    os.chdir("uploads/workspace/frontend")
    subprocess.run(["npm", "run", "dev"], check=True)

def run_simulators():
    """Start the chart simulators"""
    print("📊 Starting chart simulators...")
    time.sleep(5)  # Wait for backend to start
    os.chdir("uploads/workspace/chart_simulator")
    subprocess.run(["python", "main_simulator.py", "--duration", "30"], check=True)

def main():
    """Main function to orchestrate everything"""
    print("🎯 Gram-Vikas Chart Simulator Startup")
    print("=" * 50)
    
    try:
        # Start backend in a separate thread
        backend_thread = threading.Thread(target=run_backend, daemon=True)
        backend_thread.start()
        
        # Wait a bit for backend to start
        time.sleep(3)
        
        # Start frontend in a separate thread
        frontend_thread = threading.Thread(target=run_frontend, daemon=True)
        frontend_thread.start()
        
        # Wait a bit for frontend to start
        time.sleep(5)
        
        # Start simulators
        run_simulators()
        
    except KeyboardInterrupt:
        print("\n🛑 Shutting down...")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
