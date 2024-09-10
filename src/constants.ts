export const kPluginName = "Day Length";
export const kVersion = "1.1.0";
export const kDataContextName = "DayLengthPluginData";
export const kInitialDimensions = {
  width: 340,
  height: 541
};
export const kSimulationTabDimensions = {
  width: 665,
  height: 541
};

// These are only used in the simplified sunray angle calc
// solstice dates in season calc are based on astronomy-engine Seasons()
export const kBasicSummerSolstice = 172;
export const kEarthTilt = 23.5;

export const kGeonamesService = "https://secure.geonames.org/search";
export const kGeolocService = "https://secure.geonames.org/findNearbyPlaceNameJSON";
export const kGeonamesUser = "codap";
export const kDefaultMaxRows = 4;

export const kParentCollectionName = "Locations";
export const kChildCollectionName = "Daylight Info";

export const kAdjustSpringForwardOutlier = false;

export const kParentCollectionAttributes = [
  {
    name: "latitude",
    type: "numeric"
  },
  {
    name: "longitude",
    type: "numeric"
  },
  {
    name: "location",
    type: "categorical"
  }
];

export const kChildCollectionAttributes = [
  {
    name: "date",
    title: "Date",
    type: "date",
    hasToken: true,
    precision: "day",
    description: "Date"
  },
  {
    name: "dayOfYear",
    title: "Day of year",
    type: "numeric",
    hasToken: false,
    hidden: true,
    description: "Day of year"
  },
  {
    name: "Day length",
    title: "Day length",
    type: "numeric",
    hasToken: true,
    unit: "hours",
    description: "Day length in hours"
  },
  {
    name: "rawSunrise",
    title: "rawSunrise",
    type: "date",
    hasToken: false,
    hidden: true,
    precision: "seconds",
    description: "sunrise as date object"
  },
  {
    name: "rawSunset",
    title: "rawSunset",
    type: "date",
    hasToken: false,
    hidden: true,
    precision: "seconds",
    description: "sunset as date object"
  },
  {
    name: "Sunrise",
    title: "Sunrise",
    type: "numeric",
    hasToken: true,
    unit: "decimal hours",
    formula: "hours(rawSunrise)+minutes(rawSunrise)/60",
    description: "time in decimal hours"
  },
  {
    name: "Sunset",
    title: "Sunset",
    type: "numeric",
    hasToken: true,
    unit: "decimal hours",
    formula: "hours(rawSunset)+minutes(rawSunset)/60",
    description: "time in decimal hours"
  },
  {
    name: "Sunlight angle",
    title: "Sunlight angle",
    type: "numeric",
    hasToken: true,
    unit: "°",
    description: "angle in degrees of sunlight at solar noon"
  },
  {
    name: "Solar intensity",
    title: "Solar intensity",
    type: "numeric",
    hasToken: true,
    unit: "W/㎡",
    description: "intensity of solar energy in watts per square meter at solar noon, disregarding all atmospheric effects"
  },
  {
    name: "Season",
    title: "Season",
    type: "categorical",
    hasToken: true
  },
  {
    name: "calcId",
    title: "calcId",
    type: "categorical",
    hasToken: false,
    hidden: true,
    description: "unique identifier for each location on a day - concatenation of latitude, longitude, and dayOfYear",
    formula: "latitude + ',' + longitude + ',' + dayOfYear"
  }
];

export const kDefaultOnAttributes = [
  "date", "Day length"
];

export const kDateWithTimeFormats = {
  asZuluISO: "YYYY-MM-DDTHH:mm[Z]",              // 1999-01-23T21:45Z
  asLocalISOWithTZOffset: "YYYY-MM-DDTHH:mmZ",   // 1999-01-23T14:45-07:00
  asClockTimeString: "HH:mm",                    // 14:45
  asClockTimeStringAMPM: "h:mm a",               // 2:45 PM
}

export const kDateFormats = {
  asLocalISODate: "YYYY-MM-DD",
}
