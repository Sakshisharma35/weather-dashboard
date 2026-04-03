import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, LineChart, Line, BarChart, Bar, Legend 
} from 'recharts';
import { Thermometer, Droplets, CloudRain, Eye, Wind, Activity } from 'lucide-react';

const WeatherCharts = ({ data }) => {
  // Extract and format 24-hour data
  const chartData = data.weather.hourly.time.map((t, i) => ({
    time: new Date(t).getHours() + ":00",
    temp: data.weather.hourly.temperature_2m[i],
    hum: data.weather.hourly.relative_humidity_2m[i],
    prec: data.weather.hourly.precipitation[i],
    vis: data.weather.hourly.visibility[i] / 1000, // Convert meters to KM
    wind: data.weather.hourly.wind_speed_10m[i],
    pm10: data.aqi.hourly.pm10[i],
    pm25: data.aqi.hourly.pm2_5[i],
  })).slice(0, 24);

  const ChartContainer = ({ title, icon: Icon, color, children }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md hover:border-white/20 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-white/5">
          <Icon size={16} style={{ color }} />
        </div>
        <h3 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">{title}</h3>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );

  const customTooltip = {
    contentStyle: { backgroundColor: '#000', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
    itemStyle: { padding: '2px 0' }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* 1. Temperature Chart */}
      <ChartContainer title="Hourly Temperature" icon={Thermometer} color="#fbbf24">
        <AreaChart data={chartData}>
          <XAxis dataKey="time" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip {...customTooltip} />
          <Area type="monotone" dataKey="temp" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.1} strokeWidth={3} />
        </AreaChart>
      </ChartContainer>

      {/* 2. Relative Humidity */}
      <ChartContainer title="Relative Humidity (%)" icon={Droplets} color="#38bdf8">
        <AreaChart data={chartData}>
          <XAxis dataKey="time" hide />
          <YAxis hide domain={[0, 100]} />
          <Tooltip {...customTooltip} />
          <Area type="monotone" dataKey="hum" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.1} strokeWidth={3} />
        </AreaChart>
      </ChartContainer>

      {/* 3. Precipitation */}
      <ChartContainer title="Precipitation (mm)" icon={CloudRain} color="#60a5fa">
        <BarChart data={chartData}>
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip {...customTooltip} />
          <Bar dataKey="prec" fill="#60a5fa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>

      {/* 4. Visibility */}
      <ChartContainer title="Visibility (km)" icon={Eye} color="#a78bfa">
        <AreaChart data={chartData}>
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip {...customTooltip} />
          <Area type="monotone" dataKey="vis" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.1} strokeWidth={3} />
        </AreaChart>
      </ChartContainer>

      {/* 5. Wind Speed */}
      <ChartContainer title="Wind Speed (10m)" icon={Wind} color="#34d399">
        <LineChart data={chartData}>
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip {...customTooltip} />
          <Line type="stepAfter" dataKey="wind" stroke="#34d399" strokeWidth={3} dot={false} />
        </LineChart>
      </ChartContainer>

      {/* 6. PM10 & PM2.5 Combined */}
      <ChartContainer title="Air Quality: PM10 vs PM2.5" icon={Activity} color="#f472b6">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip {...customTooltip} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.6 }} />
          <Line type="monotone" dataKey="pm10" stroke="#f472b6" strokeWidth={2} dot={false} name="PM10" />
          <Line type="monotone" dataKey="pm25" stroke="#fb7185" strokeWidth={2} dot={false} name="PM2.5" />
        </LineChart>
      </ChartContainer>

    </div>
  );
};

export default WeatherCharts;