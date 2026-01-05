# SentinelAI - Full-Stack Threat Intelligence Dashboard

A professional SOC (Security Operations Center) dashboard built with FastAPI (Python) backend and React (TypeScript) frontend featuring real-time threat monitoring, AI-powered analysis, and interactive visualizations.

## Features

- **Real-time Threat Feed**: Live scrolling threat intelligence from multiple sources
- **Interactive Visualizations**: Threat volume and distribution charts using Recharts
- **SOC Co-Pilot**: AI-powered chat interface for IP/URL threat analysis
- **Live Status Monitoring**: Real-time API connectivity indicator
- **Dashboard Statistics**: Total alerts, active ransomware, system health metrics
- **Dark Glassmorphic UI**: Professional SOC-style interface with Tailwind CSS

## Tech Stack

**Backend:**
- FastAPI (Python)
- Pydantic for data validation
- Uvicorn ASGI server

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API calls
- Lucide React for icons

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

- `GET /api/stats` - Returns dashboard statistics
- `GET /api/threat-feed` - Returns real-time threat data
- `POST /api/analyze` - Analyzes IP addresses or URLs for threats

## Usage

1. Start the backend server first
2. Start the frontend development server
3. Navigate to the dashboard in your browser
4. Watch the "API Online" indicator turn green in the header
5. Explore different views using the sidebar navigation
6. Use the SOC Co-Pilot to analyze IPs or URLs

## Color Palette

- Background: `#020617`
- Primary Blue: `#3b82f6`
- Emergency Red: `#ef4444`

## Development

To build for production:
```bash
npm run build
```

## License

MIT
