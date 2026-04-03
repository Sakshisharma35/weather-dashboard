import React, { useState, useEffect } from 'react';
import { fetchWeatherData, getCityName } from './utils/api';
import WeatherCard from './components/WeatherCard';
import WeatherCharts from './components/WeatherCharts';
import HistoricalView from './components/HistoricalView';
import { MapPin, Navigation } from 'lucide-react';

export default function App() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Boundary Logic: Calculate 2 years ago from today
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(today.getFullYear() - 2);
  const minDateStr = twoYearsAgo.toISOString().split('T')[0];

  const [data, setData] = useState(null);
  const [date, setDate] = useState(todayStr);
  const [unit, setUnit] = useState('celsius');
  const [view, setView] = useState('live');
  const [pos, setPos] = useState({ lat: 0, lon: 0 });
  const [city, setCity] = useState("Locating...");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        const { latitude, longitude } = p.coords;
        setPos({ lat: latitude, lon: longitude });
        
        // Fetch City Name
        const cityName = await getCityName(latitude, longitude);
        setCity(cityName);
      },
      () => {
        setPos({ lat: 28.6139, lon: 77.2090 });
        setCity("New Delhi"); // Fallback
      }
    );
  }, []);

  useEffect(() => {
    if(pos.lat !== 0) {
      fetchWeatherData(pos.lat, pos.lon, unit, date).then(setData);
    }
  }, [pos, date, unit]);

  if(!data) return <div className="h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-black">INITIALIZING...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white p-4 md:p-10 font-sans">
      <header className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center mb-10 bg-white/5 p-8 rounded-[2.5rem] backdrop-blur-2xl border border-white/10 gap-6">
        
        {/* LOCATION DISPLAY SECTION */}
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/40"><Navigation size={28}/></div>
          <div>
            <h1 className="text-xl font-black text-blue-400 tracking-widest uppercase">{city}</h1>
            <div className="flex flex-col text-[10px] font-bold opacity-60">
              <span className="flex items-center gap-1 uppercase tracking-tighter">
                <MapPin size={12}/> {pos.lat.toFixed(4)}° N, {pos.lon.toFixed(4)}° E
              </span>
              <span className="mt-1">{new Date(date).toDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10">
            <button onClick={() => setView('live')} className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all ${view === 'live' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 opacity-50'}`}>DASHBOARD</button>
            <button onClick={() => setView('hist')} className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all ${view === 'hist' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 opacity-50'}`}>HISTORY</button>
          </div>
          
          {/* BOUNDED DATE PICKER */}
          <input 
            type="date" 
            value={date} 
            min={minDateStr} 
            max={todayStr} 
            onChange={e => setDate(e.target.value)} 
            className="bg-white/10 border-none rounded-2xl px-4 py-2.5 text-sm font-bold outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-blue-500 cursor-pointer" 
          />
          
          <button onClick={() => setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')} className="bg-white text-black px-6 py-2.5 rounded-2xl text-xs font-black transition-transform active:scale-95 shadow-xl shadow-white/10 uppercase">
            °{unit === 'celsius' ? 'C' : 'F'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {view === 'live' ? (
          <>
            <WeatherCard data={data} isToday={date === todayStr} />
            <div className="mt-12">
              <WeatherCharts data={data} />
            </div>
          </>
        ) : (
          <HistoricalView lat={pos.lat} lon={pos.lon} minDate={minDateStr} maxDate={todayStr} />
        )}
      </main>
    </div>
  );
}