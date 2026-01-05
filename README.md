# SentinelAI - Full-Stack Threat Intelligence Dashboard

A professional SOC (Security Operations Center) dashboard with real-time threat monitoring, AI-powered analysis, interactive threat map, and persistent data storage using Supabase.

## Features

### Real-time Threat Monitoring
- **Live Threat Feed**: Continuous streaming of threat intelligence from multiple sources
- **Interactive Threat Map**: Geographic visualization of threats with real-time updates
- **Dashboard Statistics**: Total alerts, active ransomware, system health metrics, and more

### AI-Powered Analysis
- **SOC Co-Pilot**: Analyze IPs and URLs for threats with detailed findings and recommendations
- **Risk Scoring**: Automated risk assessment with threat level classification
- **Analysis Caching**: Store analysis history in Supabase database for quick reference

### Interactive Visualizations
- **Threat Volume Chart**: 24-hour threat activity timeline
- **Threat Distribution**: Pie chart showing threat type breakdown
- **Global Threat Map**: Real-time geolocation of threats worldwide

### Database Integration
- **Persistent Storage**: All threats, analyses, and statistics stored in Supabase
- **Real-time Updates**: Database-backed live feed with automatic updates
- **Historical Data**: Query past threats and analysis results

## Tech Stack

**Backend:**
- FastAPI (Python 3.x)
- Supabase Python Client
- Pydantic for data validation
- Uvicorn ASGI server

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API calls
- Lucide React for icons

**Database:**
- Supabase (PostgreSQL)
- Row Level Security (RLS) enabled
- Real-time data synchronization

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

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

### Core Endpoints
- `GET /` - Health check and API status
- `GET /api/stats` - Returns dashboard statistics from database
- `GET /api/threat-feed` - Returns real-time threat data from database
- `GET /api/threat-map` - Returns geolocation data for threat visualization
- `POST /api/analyze` - Analyzes IP addresses or URLs for threats
- `GET /api/analysis-history` - Returns historical analysis data

### Database Schema

**Tables:**
- `threats` - Stores threat intelligence with geolocation
- `analyzed_targets` - Stores IP/URL analysis results
- `statistics` - Stores dashboard metrics

## Usage

### Starting the Application

1. **Start Backend**: Run `python backend/main.py`
2. **Start Frontend**: Run `npm run dev`
3. **Wait for Connection**: Watch the "API Online" indicator turn green in the header
4. Navigate through different views using the sidebar

### Features Guide

#### Overview Dashboard
- View real-time statistics
- Monitor threat volume trends
- See threat distribution by type
- Access live threat feed and Co-Pilot

#### Live Feed
- Scrollable list of latest threats
- Color-coded severity levels
- Automatic updates every 5 seconds
- Shows threat source, type, and description

#### Threat Map
- Interactive global threat visualization
- Click threats for detailed information
- Real-time pulsing indicators
- Statistics breakdown by severity and country

#### SOC Co-Pilot
- Enter any IP address (e.g., `192.168.1.1`)
- Enter any URL (e.g., `example.com`)
- View detailed threat analysis
- Get actionable recommendations
- Analysis results cached for 1 hour

## Database Features

### Threat Intelligence Storage
- Automatic insertion of new threats
- Geolocation data with latitude/longitude
- Severity classification (critical, high, medium, low)
- Threat type categorization

### Analysis Caching
- Store analysis results for quick retrieval
- 1-hour cache duration
- Separate storage for IP and URL analyses
- Historical analysis tracking

### Statistics Tracking
- Real-time dashboard metrics
- Automatic updates on each request
- Persistent statistics across restarts

## Color Palette

- Background: `#020617` (Dark Navy)
- Primary Blue: `#3b82f6` (Professional Blue)
- Critical Red: `#ef4444` (Alert Red)
- Warning Orange: `#f97316` (Warning Orange)
- Caution Yellow: `#eab308` (Caution Yellow)
- Success Green: `#22c55e` (Success Green)

## Development

### Building for Production
```bash
npm run build
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

## Security Features

- Row Level Security (RLS) enabled on all tables
- Public read access for SOC dashboard visibility
- Secure API communication
- Input validation on all endpoints
- SQL injection protection

## Performance

- Efficient database queries with indexing
- Automatic data pagination
- Caching for frequently accessed data
- Optimized real-time updates

## Future Enhancements

- Integration with external threat intelligence APIs
- Advanced filtering and search capabilities
- Export functionality for reports
- User authentication and role-based access
- Email/Slack notifications for critical threats
- Custom alert rules and automation

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
