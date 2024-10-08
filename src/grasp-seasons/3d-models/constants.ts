import * as data from "../utils/solar-system-data";

// This constants define values used by 3D object, they don't have any physical meaning.

export const SF = 1 / data.SCALE_FACTOR;

export const EARTH_RADIUS = 7000000 * SF;
export const SIMPLE_EARTH_RADIUS = 13000000 * SF;
export const SUN_RADIUS = 4000000 * SF;
export const SIMPLE_SUN_RADIUS = 25000000 * SF;
export const LATLNG_MARKER_RADIUS = 300000 * SF;

export const LAT_LINE_THICKNESS = 0.01;

export const SUN_COLOR = 0xdcdca3;
export const HIGHLIGHT_COLOR = 0xff0000;
export const HIGHLIGHT_EMISSIVE = 0xbb3333;
