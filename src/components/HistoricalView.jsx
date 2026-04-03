import React, { useState } from 'react';
import { fetchHistoricalWeather } from '../utils/api';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, CartesianGrid, AreaChart, Area, Legend, 
  ComposedChart, Scatter 
} from 'recharts';
import { Wind, Sun, CloudRain, Activity, Thermometer } from 'lucide-react';

const HistoricalView = ({ lat, lon, minDate, maxDate }) => {
  const [hData, setHData] = useState(null);
  const [range, setRange] = useState({ s: '', e: '' });
  const [loading, setLoading] = useState(false);

  // Convert UTC string to IST (Indian Standard Time)
  const formatToIST = (utcStr) => {
    if (!utcStr) return "N/A";
    return new Date(utcStr).toLocaleTimeString('en-IN', { 
      timeZone: 'Asia/Kolkata', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleAnalyze = async () => {
    if (!range.s || !range.e) return alert("Please select both start and end dates.");
    
    setLoading(true);
    try {
      const result = await fetchHistoricalWeather(lat, lon, range.s, range.e);
      
      const formatted = result.weather.daily.time.map((t, i) => ({
        date: t,
        tempMax: result.weather.daily.temperature_2m_max[i],
        tempMin: result.weather.daily.temperature_2m_min[i],
        tempMean: result.weather.daily.temperature_2m_mean[i],
        precip: result.weather.daily.precipitation_sum[i],
        windSpeed: result.weather.daily.wind_speed_10m_max[i],
        windDir: result.weather.daily.wind_direction_10m_dominant[i],
        sunrise: formatToIST(result.weather.daily.sunrise[i]),
        sunset: formatToIST(result.weather.daily.sunset[i]),
        // Calculate daily AQI average from 24h hourly data
        pm10: result.aqi.hourly.pm10.slice(i * 24, (i + 1) * 24).reduce((a, b) => a + b, 0) / 24,
        pm25: result.aqi.hourly.pm2_5.slice(i * 24, (i + 1) * 24).reduce((a, b) => a + b, 0) / 24,
      }));
      setHData(formatted);
    } catch (err) {
      alert("Error fetching data. Ensure dates are within the 2-year boundary.");
    } finally {
      setLoading(false);
    }
  };

  const ChartWrapper = ({ title, icon: Icon, children }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-6">
        <Icon className="text-blue-400" size={18} />
        <h3 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-50">{title}</h3>
      </div>
      <div className="h-72 w-full">{children}</div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Date Range Controls */}
      <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex flex-wrap gap-6 items-end justify-center">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold opacity-40 ml-2 uppercase">Start Date</label>
          <input type="date" min={minDate} max={maxDate} className="bg-white/10 p-3 rounded-2xl outline-none border border-white/5 focus:ring-2 ring-blue-500" 
            onChange={e => setRange({...range, s: e.target.value})} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold opacity-40 ml-2 uppercase">End Date</label>
          <input type="date" min={minDate} max={maxDate} className="bg-white/10 p-3 rounded-2xl outline-none border border-white/5 focus:ring-2 ring-blue-500" 
            onChange={e => setRange({...range, e: e.target.value})} />
        </div>
        <button onClick={handleAnalyze} disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-10 py-3.5 rounded-2xl font-black text-xs tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95">
          {loading ? "SYNCING..." : "ANALYZE TRENDS"}
        </button>
      </div>

      {hData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Temperature: Range Area Chart */}
          <ChartWrapper title="Temperature: Mean, Max & Min" icon={Thermometer}>
            <ResponsiveContainer>
              <AreaChart data={hData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{backgroundColor:'#111', border:'none', borderRadius:'15px'}} />
                <Area type="monotone" dataKey="tempMax" stroke="#f87171" fill="transparent" strokeWidth={2} />
                <Area type="monotone" dataKey="tempMean" stroke="#fbbf24" fill="url(#tempGradient)" strokeWidth={3} />
                <Area type="monotone" dataKey="tempMin" stroke="#60a5fa" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Precipitation: Bar Chart */}
          <ChartWrapper title="Daily Total Precipitation (mm)" icon={CloudRain}>
            <ResponsiveContainer>
              <BarChart data={hData}>
                <XAxis dataKey="date" hide />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{backgroundColor:'#111', border:'none', borderRadius:'15px'}} />
                <Bar dataKey="precip" fill="#3b82f6" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Air Quality: Comparative Line Chart */}
          <ChartWrapper title="Air Quality Trends (PM10 & PM2.5)" icon={Activity}>
            <ResponsiveContainer>
              <LineChart data={hData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{backgroundColor:'#111', border:'none', borderRadius:'15px'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize:'10px', paddingTop:'10px'}} />
                <Line type="monotone" dataKey="pm10" stroke="#a78bfa" strokeWidth={2} dot={false} name="PM10 Avg" />
                <Line type="monotone" dataKey="pm25" stroke="#ec4899" strokeWidth={2} dot={false} name="PM2.5 Avg" />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Wind & Sun Cycle: Multi-Type Chart */}
          <ChartWrapper title="Wind Max & Sun Cycle (IST)" icon={Wind}>
            <div className="flex h-full gap-4">
              <div className="w-1/2 overflow-y-auto pr-2 custom-scrollbar">
                <table className="w-full text-[9px] font-bold opacity-60">
                  <thead className="sticky top-0 bg-slate-900 shadow-sm">
                    <tr><th className="text-left py-1">DATE</th><th className="text-left">SUNRISE</th><th className="text-left">SUNSET</th></tr>
                  </thead>
                  <tbody>
                    {hData.map((d, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-2">{d.date}</td>
                        <td className="text-yellow-400">{d.sunrise}</td>
                        <td className="text-orange-400">{d.sunset}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-1/2">
                <ResponsiveContainer>
                  <ComposedChart data={hData}>
                    <XAxis dataKey="date" hide />
                    <Tooltip contentStyle={{backgroundColor:'#111', border:'none'}} />
                    <Bar dataKey="windSpeed" fill="#34d399" fillOpacity={0.2} radius={[2, 2, 0, 0]} name="Max Wind" />
                    <Line type="step" dataKey="windDir" stroke="#10b981" strokeWidth={1} dot={false} name="Direction°" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartWrapper>
        </div>
      )}
    </div>
  );
};

export default HistoricalView;