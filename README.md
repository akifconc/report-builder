# Report Builder Application

A modern report builder application with a FastAPI backend and Next.js frontend.

## Features

- Create, edit, and delete reports
- Real-time preview functionality
- SQLite database for persistent storage
- Modern UI with responsive design

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS (with Bun)
- **Backend**: FastAPI, SQLAlchemy, SQLite (Python)
- **UI Components**: Radix UI, Lucide Icons

## Why Python Backend + Bun Frontend?

- **Frontend**: Bun is excellent for JavaScript/TypeScript and much faster than npm/pnpm
- **Backend**: FastAPI (Python) is mature, has rich ecosystem, and perfect for APIs
- **Best of Both Worlds**: Use the right tool for each part of the stack

## Prerequisites

- Node.js (v18 or higher) or Bun (v1.0 or higher)
- Python (v3.8 or higher)
- Bun (recommended) or npm/pnpm

## Installation & Setup

### 1. Install Frontend Dependencies

```bash
bun install
```

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Running the Application

### Option 1: Start Everything Together (Recommended)

```bash
./start-all.sh
```

This will start both the backend and frontend automatically!

### Option 2: Start Services Separately

#### 2a. Start the FastAPI Backend

**Python 3.12 (Recommended)**
```bash
./start-backend.sh
```

**Python 3.13**
```bash
./start-backend-python313.sh
```

**Manual Setup**
```bash
cd backend
python3.12 -m venv venv  # or python3.13 -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # or requirements-python313.txt
python main.py
```

The backend will run on `http://localhost:8000`

#### 2b. Start the Next.js Frontend

In a new terminal:

```bash
bun dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

The FastAPI backend provides the following endpoints:

- `GET /reports` - Get all reports
- `POST /reports` - Create a new report
- `GET /reports/{id}` - Get a specific report
- `PUT /reports/{id}` - Update a report
- `DELETE /reports/{id}` - Delete a report

## Database

The application uses SQLite for data persistence. The database file (`reports.db`) will be created automatically when you first run the backend.

## Features

### Frontend Logic
- When no reports exist, only the "Create Your First Report" button is shown
- When reports exist, the "New Report" button appears in the top-right corner
- Full CRUD operations for reports
- Drag-and-drop interface for building reports
- Real-time preview functionality

### Backend Features
- RESTful API with FastAPI
- SQLAlchemy ORM for database operations
- Automatic database schema creation
- CORS support for frontend integration
- Input validation with Pydantic models

## Development

### Project Structure

```
reporting-miro/
├── app/                    # Next.js frontend
│   ├── api/               # (Legacy API routes - not used)
│   ├── page.tsx           # Main dashboard
│   └── ...
├── backend/               # FastAPI backend
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
├── components/           # React components
├── lib/                 # Utility functions
├── public/              # Static assets
└── ...
```

### Making Changes

1. **Frontend changes**: Edit files in `app/`, `components/`, or `lib/`
2. **Backend changes**: Edit files in `backend/`
3. **Database changes**: Modify the SQLAlchemy models in `backend/main.py`

The application will automatically reload when you make changes during development.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the FastAPI backend is running on port 8000
2. **Database Issues**: Delete `reports.db` to reset the database
3. **Port Conflicts**: Change the ports in the configuration if needed
4. **Python 3.13 Compatibility**: If you get Rust compilation errors with Python 3.13:
   - Use Python 3.12 instead: `brew install python@3.12`
   - Or install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
   - Or use the Python 3.13 specific requirements: `pip install -r requirements-python313.txt`

### Support

If you encounter any issues, check:
1. Both frontend and backend are running
2. All dependencies are installed
3. Ports 3000 and 8000 are available 