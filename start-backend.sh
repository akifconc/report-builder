#!/bin/bash

echo "Starting FastAPI Backend..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3.12 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Start the backend
echo "Starting FastAPI server on http://localhost:8000"
python main.py 