#!/bin/bash

echo "Starting FastAPI Backend with Python 3.13..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv313" ]; then
    echo "Creating virtual environment with Python 3.13..."
    python3.13 -m venv venv313
fi

# Activate virtual environment
source venv313/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements-python313.txt

# Start the backend
echo "Starting FastAPI server on http://localhost:8000"
python main.py 