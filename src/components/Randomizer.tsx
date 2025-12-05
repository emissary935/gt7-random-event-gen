import React, { useState, useCallback, useEffect } from 'react';
import {
  RefreshCw,
  MapPin,
  ExternalLink,
  Clock,
  Cloud,
  Sun,
  CloudRain,
  Moon,
  Wind,
} from 'lucide-react';
import { TRACKS, CARS, GT7_LINKS } from '../constants';
import { Track, Car } from '../types';

export const Randomizer: React.FC = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  // Independent States for each variable to prevent unwanted re-rolls
  const [trackVariation, setTrackVariation] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<string | null>(null);
  const [weather, setWeather] = useState<string | null>(null);

  const [animating, setAnimating] = useState({
    car: false,
    track: false,
    time: false,
    weather: false,
  });

  const [isFullAnimating, setIsFullAnimating] = useState(false);

  const getRandomItem = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

  // Animation Logic
  const animateSelection = (
    type: 'car' | 'track' | 'time' | 'weather',
    setter: (val: any) => void,
    dataSource: any[]
  ) => {
    setAnimating((prev) => ({ ...prev, [type]: true }));
    let count = 0;
    const interval = setInterval(() => {
      setter(getRandomItem(dataSource));
      count++;
      if (count > 12) {
        clearInterval(interval);
        setAnimating((prev) => ({ ...prev, [type]: false }));
      }
    }, 40);
  };

  const rollCar = () => animateSelection('car', setSelectedCar, CARS);

  const rollTrack = () => {
    setAnimating((prev) => ({ ...prev, track: true }));
    let count = 0;
    const interval = setInterval(() => {
      const trk = getRandomItem(TRACKS);
      setCurrentTrack(trk);

      // Select variation explicitly and store it
      if (trk.variations && trk.variations.length > 0) {
        setTrackVariation(getRandomItem(trk.variations));
      } else {
        setTrackVariation(null);
      }

      // Set initial conditions for the new track
      setTimeOfDay(getRandomItem(trk.availableTimes));
      setWeather(getRandomItem(trk.availableWeather));

      count++;
      if (count > 12) {
        clearInterval(interval);
        setAnimating((prev) => ({ ...prev, track: false }));
      }
    }, 40);
  };

  const rollCondition = (type: 'time' | 'weather') => {
    if (!currentTrack) return;
    setAnimating((prev) => ({ ...prev, [type]: true }));
    let count = 0;
    const interval = setInterval(() => {
      if (type === 'time') {
        setTimeOfDay(getRandomItem(currentTrack.availableTimes));
      } else {
        setWeather(getRandomItem(currentTrack.availableWeather));
      }

      count++;
      if (count > 12) {
        clearInterval(interval);
        setAnimating((prev) => ({ ...prev, [type]: false }));
      }
    }, 40);
  };

  const randomizeAll = useCallback(() => {
    setIsFullAnimating(true);
    let count = 0;
    const interval = setInterval(() => {
      setSelectedCar(getRandomItem(CARS));
      const trk = getRandomItem(TRACKS);
      setCurrentTrack(trk);

      // Variation
      if (trk.variations && trk.variations.length > 0) {
        setTrackVariation(getRandomItem(trk.variations));
      } else {
        setTrackVariation(null);
      }

      // Conditions
      setTimeOfDay(getRandomItem(trk.availableTimes));
      setWeather(getRandomItem(trk.availableWeather));

      count++;
      if (count > 15) {
        clearInterval(interval);
        setIsFullAnimating(false);
      }
    }, 40);
  }, []);

  useEffect(() => {
    randomizeAll();
  }, []);

  // UI Helpers
  const getWeatherIcon = (weatherStr: string | null) => {
    if (!weatherStr) return <Sun size={20} className="text-gray-600" />;
    const w = weatherStr.toLowerCase();
    if (w.includes('rain') || w.includes('drizzle') || w.includes('wet'))
      return <CloudRain size={20} className="text-white" />;
    if (w.includes('cloud') || w.includes('overcast'))
      return <Cloud size={20} className="text-gray-400" />;
    if (w.includes('mist') || w.includes('fog'))
      return <Wind size={20} className="text-gray-500" />;
    return <Sun size={20} className="text-white" />;
  };

  const parseWeather = (w: string) => {
    const parts = w.split('|');
    return {
      code: parts.length > 1 ? parts[0].trim() : 'VAR',
      desc: parts.length > 1 ? parts[1].trim() : w,
    };
  };

  // Sub-components for styling
  const CardContainer: React.FC<{
    children: React.ReactNode;
    title: string;
    link?: string;
  }> = ({ children, title, link }) => (
    <div className="bg-[#141414] border-t-4 border-[#E60012] p-6 md:p-8 flex flex-col h-full hover:bg-[#1a1a1a] transition-colors group relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#E60012]"></span>
          {title}
        </h3>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
      {children}
    </div>
  );

  const UpdateButton: React.FC<{
    onClick: () => void;
    loading: boolean;
    label: string;
  }> = ({ onClick, loading, label }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-auto pt-6 border-t border-[#222] w-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#E60012] transition-colors"
    >
      <RefreshCw
        size={12}
        className={loading ? 'animate-spin text-[#E60012]' : ''}
      />
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-1 w-full animate-fade-in">
      {/* --- CAR & TRACK ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 min-h-[350px]">
        {/* CAR */}
        <CardContainer title="Vehicle Selection" link={GT7_LINKS.cars}>
          <div className="flex-grow flex flex-col justify-center">
            {selectedCar ? (
              <div
                className={`transition-opacity duration-200 ${
                  animating.car ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div className="h-4 mb-2"></div>
                <h2 className="text-3xl md:text-5xl font-bold text-white uppercase leading-[0.9] tracking-tighter mb-3">
                  {selectedCar.name}
                </h2>
              </div>
            ) : (
              <div className="text-gray-700 font-bold uppercase">
                Loading...
              </div>
            )}
          </div>
          <UpdateButton
            onClick={rollCar}
            loading={animating.car}
            label="Change Vehicle"
          />
        </CardContainer>

        {/* TRACK */}
        <CardContainer title="Circuit Selection" link={GT7_LINKS.tracks}>
          <div className="flex-grow flex flex-col justify-center">
            {currentTrack ? (
              <div
                className={`transition-opacity duration-200 ${
                  animating.track ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-[#E60012] font-bold uppercase text-xs tracking-wider">
                  <MapPin size={12} /> {currentTrack.location}
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white uppercase leading-tight tracking-tight mb-3">
                  {currentTrack.name}
                </h2>
                {trackVariation && (
                  <span className="bg-white text-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                    {trackVariation}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-gray-700 font-bold uppercase">
                Loading...
              </div>
            )}
          </div>
          <UpdateButton
            onClick={rollTrack}
            loading={animating.track}
            label="Change Circuit"
          />
        </CardContainer>
      </div>

      {/* --- CONDITIONS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {/* TIME */}
        <div className="bg-[#141414] p-6 hover:bg-[#1a1a1a] transition-colors border-l-4 border-transparent hover:border-[#E60012] group">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Time of Day
            </h3>
            <Clock size={16} className="text-gray-600 group-hover:text-white" />
          </div>
          <div
            className={`text-xl font-bold text-white uppercase tracking-wide ${
              animating.time ? 'opacity-50' : ''
            }`}
          >
            {timeOfDay || '---'}
          </div>
          <button
            onClick={() => rollCondition('time')}
            disabled={animating.time}
            className="mt-4 text-[10px] font-bold uppercase text-gray-600 hover:text-[#E60012] flex items-center gap-1"
          >
            <RefreshCw
              size={10}
              className={animating.time ? 'animate-spin' : ''}
            />{' '}
            Update
          </button>
        </div>

        {/* WEATHER */}
        <div className="bg-[#141414] p-6 hover:bg-[#1a1a1a] transition-colors border-l-4 border-transparent hover:border-[#E60012] group">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Weather
            </h3>
            {getWeatherIcon(weather)}
          </div>
          <div
            className={`flex flex-row items-baseline gap-2 ${animating.weather ? 'opacity-50' : ''}`}
          >
            <span className="text-xs font-mono text-[#E60012]">
              {weather ? parseWeather(weather).code : '---'}
            </span>
            <span className="text-lg font-bold text-white uppercase leading-none tracking-tight">
              {weather ? parseWeather(weather).desc : '---'}
            </span>
          </div>
          <button
            onClick={() => rollCondition('weather')}
            disabled={animating.weather}
            className="mt-4 text-[10px] font-bold uppercase text-gray-600 hover:text-[#E60012] flex items-center gap-1"
          >
            <RefreshCw
              size={10}
              className={animating.weather ? 'animate-spin' : ''}
            />{' '}
            Update
          </button>
        </div>

        {/* GENERATE BUTTON */}
        <button
          onClick={randomizeAll}
          disabled={isFullAnimating}
          className="bg-[#E60012] hover:bg-[#ff0015] p-6 flex flex-col items-center justify-center gap-2 text-white transition-all active:scale-[0.98]"
        >
          <RefreshCw
            size={24}
            className={isFullAnimating ? 'animate-spin' : ''}
          />
          <span className="font-bold uppercase tracking-widest text-sm">
            Generate Event
          </span>
        </button>
      </div>
    </div>
  );
};
