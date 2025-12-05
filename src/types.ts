export interface Car {
  name: string;
}

export interface Track {
  id: string;
  name: string;
  location: string;
  variations?: string[];
  availableTimes: string[];
  availableWeather: string[];
}

export interface Challenge {
  title: string;
  description: string;
  car: string;
  track: string;
  conditions: {
    timeOfDay: string;
    weather: string;
    tireCompound: string;
    fuelConsumption: string;
    tireWear: string;
  };
  raceSettings: {
    laps: string;
    ppLimit: string;
  };
}