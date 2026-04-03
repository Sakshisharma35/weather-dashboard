import React from 'react';
import { Sun, Sunrise, Sunset, Droplets, Wind, Activity, Gauge, CloudRain } from 'lucide-react';

const Stat = ({ icon: Icon, label, value, unit = "" }) => (
  <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
    <div className="flex items-center gap-2 mb-2 opacity-40"><Icon size={14} /><span className="text-[10px] font-black uppercase tracking-widest">{label}</span></div>
    <p className="text-2xl font-bold">{value}{unit}</p>
  </div>
);

export default function WeatherCard({ data, isToday }) {
  const h = isToday ? new Date().getHours() : 12;
  const { weather: w, aqi: a } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Gauge} label={isToday ? "Current Temp" : "Midday Temp"} value={w.hourly.temperature_2m[h]} unit="°" />
        <Stat icon={Sun} label="Daily High/Low" value={`${w.daily.temperature_2m_max[0]}° / ${w.daily.temperature_2m_min[0]}°`} />
        <Stat icon={CloudRain} label="Precipitation" value={w.hourly.precipitation[h]} unit="mm" />
        <Stat icon={Droplets} label="Humidity" value={w.hourly.relative_humidity_2m[h]} unit="%" />
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Sunrise} label="Sunrise" value={w.daily.sunrise[0].split('T')[1]} />
        <Stat icon={Sunset} label="Sunset" value={w.daily.sunset[0].split('T')[1]} />
        <Stat icon={Wind} label="Max Wind" value={w.daily.wind_speed_10m_max[0]} unit="km/h" />
        <Stat icon={CloudRain} label="Precip Prob" value={w.daily.precipitation_probability_max[0]} unit="%" />
      </div>

      <div className="bg-blue-600/10 p-8 rounded-[2.5rem] border border-blue-500/20">
        <h3 className="text-[10px] font-black opacity-40 mb-6 tracking-[0.3em] uppercase">Air Quality Index & Pollutants</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Stat icon={Activity} label="AQI" value={a.hourly.us_aqi[h]} />
          <Stat icon={Activity} label="PM10" value={a.hourly.pm10[h]} />
          <Stat icon={Activity} label="PM2.5" value={a.hourly.pm2_5[h]} />
          <Stat icon={Activity} label="CO" value={a.hourly.carbon_monoxide[h]} />
          <Stat icon={Activity} label="CO2" value="415" unit="ppm" />
          <Stat icon={Activity} label="NO2" value={a.hourly.nitrogen_dioxide[h]} />
          <Stat icon={Activity} label="SO2" value={a.hourly.sulphur_dioxide[h]} />
        </div>
      </div>
    </div>
  );
}