#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Report Builder Application...${NC}"

# Function to cleanup processes on exit
cleanup() {
    echo -e "\n${RED}Shutting down services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap signals to cleanup
trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${GREEN}📡 Starting FastAPI Backend...${NC}"
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3.12 -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1

# Start backend in background
python main.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Go back to project root
cd ..

# Start frontend
echo -e "${GREEN}🎨 Starting Next.js Frontend...${NC}"
bun dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

echo -e "${BLUE}✅ Services started successfully!${NC}"
echo -e "${GREEN}🔗 Backend: http://localhost:8000${NC}"
echo -e "${GREEN}🔗 Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID 