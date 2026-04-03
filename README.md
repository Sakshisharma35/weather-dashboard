# React + Vite

SkyCast Pro: Advanced Weather & Air Quality DashboardSkyCast Pro is a high-performance, real-time weather analytics platform built with React and Vite. It provides users with deep insights into atmospheric conditions, air quality (AQI), and long-term historical trends using high-fidelity data visualization.

🌟 Key Features

1. Real-Time Dashboard (Current & Hourly)Live Location Detection: Automatically detects user coordinates via the Geolocation API and performs reverse-geocoding to display the City Name.Dynamic Labeling: Intelligently switches labels (e.g., "Current Temp" vs. "Midday Temp") based on whether the user is viewing today or a past date.Hourly Visualizations: Six individual, high-contrast charts for:Temperature (Toggle between °C and °F)Relative Humidity (%)Precipitation (mm)Visibility (km)Wind Speed (10m)PM10 & PM2.5 (Combined comparative analysis)

2. Long-Term Historical Analytics 2-Year Data Boundary: Strictly enforced date picking logic that prevents future selections and limits historical lookups to a maximum of 2 years.Sun Cycle in IST: Sunrise and Sunset timings automatically converted to Indian Standard Time (GMT+5:30).Trend Analysis:Temperature: Area charts showing the "envelope" of Max, Min, and Mean temperatures.Precipitation: Bar charts for total daily rainfall.Wind: Max speed and dominant direction tracking.Air Quality: Long-term pollutant concentration trends.

🛠️ Tech Stack

Technology	     Purpose
React 18	     UI Library
Vite	        Next-generation frontend tooling (500ms render target)
Tailwind CSS	Atomic styling for a premium glassmorphism dark UI
Recharts	    Composable, responsive charting library
Axios	        Efficient API communication
Lucide React	Clean, consistent iconography
Open-Meteo API	High-precision weather and AQI data source
Nominatim API	Reverse-geocoding for city name resolution

📁 Project Structure
src/
├── components/
│   ├── WeatherCard.jsx                    # Main stats and AQI breakdown
│   ├── WeatherCharts.jsx                  # Hourly dashboard visualizations
│   └── HistoricalView.jsx                 # Page 2: Long-term trend analysis
├── utils/
│   └── api.js                             # Pure logic for data fetching & geocoding
├── App.jsx                                # Main state controller & Navigation
└── main.jsx                               # Application entry point

 Getting Started

 Prerequisites
Node.js (v16 or higher)

npm or yarn

Installation
Clone the repository:

Bash
git clone https://github.com/your-username/skycast-pro.git
cd skycast-pro
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Build for production:

Bash
npm run build

 Logic & Justification
 
 Technical Accuracy
 
 Historical Data: We utilize the archive-api.open-meteo.com endpoint for dates older than 2 days to ensure accuracy, as forecast models are replaced by observed measurements in the archive.
 
 Unit Conversion: All temperature logic uses a global state. When a user toggles to Fahrenheit, all components (Cards and Charts) update simultaneously to maintain data integrity.
 
 UI Constraints: The <input type="date"> utilizes the min and max attributes calculated on-the-fly to prevent API errors caused by invalid date ranges.
 
 Performance
 
 The application is optimized for a 500ms rendering target. 
 By utilizing ResponsiveContainer from Recharts and minimizing unnecessary re-renders in api.js, the dashboard remains fluid even when rendering multiple complex data sets.
