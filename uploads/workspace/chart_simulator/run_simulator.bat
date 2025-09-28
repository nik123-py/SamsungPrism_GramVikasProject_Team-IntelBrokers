@echo off
echo Chart Simulator for Gram-Vikas Dashboard
echo ======================================
echo.
echo Choose an option:
echo 1. Run all simulators (recommended for demo)
echo 2. Run buyer simulator only
echo 3. Run farmer simulator only
echo 4. Run admin simulator only
echo 5. Run hub operator simulator only
echo 6. Run SHG leader simulator only
echo 7. Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" (
    echo Starting all simulators...
    python main_simulator.py --duration 10
) else if "%choice%"=="2" (
    echo Starting buyer simulator...
    python main_simulator.py --type buyer --duration 10
) else if "%choice%"=="3" (
    echo Starting farmer simulator...
    python main_simulator.py --type farmer --duration 10
) else if "%choice%"=="4" (
    echo Starting admin simulator...
    python main_simulator.py --type admin --duration 10
) else if "%choice%"=="5" (
    echo Starting hub operator simulator...
    python main_simulator.py --type hub --duration 10
) else if "%choice%"=="6" (
    echo Starting SHG leader simulator...
    python main_simulator.py --type shg --duration 10
) else if "%choice%"=="7" (
    echo Exiting...
    exit
) else (
    echo Invalid choice. Please run the script again.
)

pause
