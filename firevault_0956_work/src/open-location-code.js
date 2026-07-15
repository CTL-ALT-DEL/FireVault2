/*
 * FireVault Open Location Code helper.
 * Implements full offline Plus Code encoding using integer arithmetic from
 * the public Open Location Code specification and reference implementation
 * (Apache-2.0): https://github.com/google/open-location-code
 */
const ALPHABET = "23456789CFGHJMPQRVWX";
const SEPARATOR = "+";
const SEPARATOR_POSITION = 8;
const ENCODING_BASE = 20;
const LATITUDE_MAX = 90;
const LONGITUDE_MAX = 180;
const PAIR_CODE_LENGTH = 10;
const MAX_CODE_LENGTH = 15;
const GRID_ROWS = 5;
const GRID_COLUMNS = 4;
const GRID_CODE_LENGTH = MAX_CODE_LENGTH - PAIR_CODE_LENGTH;
const FINAL_LAT_PRECISION = Math.pow(ENCODING_BASE, 3) * Math.pow(GRID_ROWS, GRID_CODE_LENGTH);
const FINAL_LNG_PRECISION = Math.pow(ENCODING_BASE, 3) * Math.pow(GRID_COLUMNS, GRID_CODE_LENGTH);

function clipLatitude(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(LATITUDE_MAX, Math.max(-LATITUDE_MAX, number)) : NaN;
}

function normalizeLongitude(value) {
  let longitude = Number(value);
  if (!Number.isFinite(longitude)) return NaN;
  while (longitude < -LONGITUDE_MAX) longitude += LONGITUDE_MAX * 2;
  while (longitude >= LONGITUDE_MAX) longitude -= LONGITUDE_MAX * 2;
  return longitude;
}

function latitudePrecision(codeLength) {
  if (codeLength <= PAIR_CODE_LENGTH) {
    return Math.pow(ENCODING_BASE, Math.floor(codeLength / -2 + 2));
  }
  return Math.pow(ENCODING_BASE, -3) / Math.pow(GRID_ROWS, codeLength - PAIR_CODE_LENGTH);
}

function locationToIntegers(latitude, longitude) {
  const latValue = Math.floor(latitude * FINAL_LAT_PRECISION) + LATITUDE_MAX * FINAL_LAT_PRECISION;
  const lngValue = Math.floor(longitude * FINAL_LNG_PRECISION) + LONGITUDE_MAX * FINAL_LNG_PRECISION;
  return [latValue, lngValue];
}

function encodeIntegers(latitudeValue, longitudeValue, codeLength) {
  let latitude = latitudeValue;
  let longitude = longitudeValue;
  let code = "";

  if (codeLength > PAIR_CODE_LENGTH) {
    for (let index = 0; index < GRID_CODE_LENGTH; index += 1) {
      const row = latitude % GRID_ROWS;
      const column = longitude % GRID_COLUMNS;
      code = ALPHABET.charAt(row * GRID_COLUMNS + column) + code;
      latitude = Math.floor(latitude / GRID_ROWS);
      longitude = Math.floor(longitude / GRID_COLUMNS);
    }
  } else {
    latitude = Math.floor(latitude / Math.pow(GRID_ROWS, GRID_CODE_LENGTH));
    longitude = Math.floor(longitude / Math.pow(GRID_COLUMNS, GRID_CODE_LENGTH));
  }

  for (let index = 0; index < PAIR_CODE_LENGTH / 2; index += 1) {
    code = ALPHABET.charAt(longitude % ENCODING_BASE) + code;
    code = ALPHABET.charAt(latitude % ENCODING_BASE) + code;
    latitude = Math.floor(latitude / ENCODING_BASE);
    longitude = Math.floor(longitude / ENCODING_BASE);
  }

  const separated = `${code.slice(0, SEPARATOR_POSITION)}${SEPARATOR}${code.slice(SEPARATOR_POSITION)}`;
  return separated.slice(0, codeLength + 1);
}

export function normalizePlusCode(value = "") {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
}

export function isValidFullPlusCode(value = "") {
  const code = normalizePlusCode(value);
  if (code.indexOf(SEPARATOR) !== SEPARATOR_POSITION) return false;
  const clean = code.replace(SEPARATOR, "");
  if (clean.length < 8 || clean.length > MAX_CODE_LENGTH) return false;
  if (![...clean].every((character) => ALPHABET.includes(character))) return false;
  const firstLatitude = ALPHABET.indexOf(clean[0]);
  const firstLongitude = ALPHABET.indexOf(clean[1]);
  return firstLatitude >= 0 && firstLatitude < 9 && firstLongitude >= 0 && firstLongitude < 18;
}

export function encodePlusCode(latitude, longitude, codeLength = PAIR_CODE_LENGTH) {
  let length = Math.trunc(Number(codeLength) || PAIR_CODE_LENGTH);
  length = Math.max(PAIR_CODE_LENGTH, Math.min(MAX_CODE_LENGTH, length));

  let clippedLatitude = clipLatitude(latitude);
  const normalizedLongitude = normalizeLongitude(longitude);
  if (!Number.isFinite(clippedLatitude) || !Number.isFinite(normalizedLongitude)) return "";
  if (clippedLatitude === LATITUDE_MAX) clippedLatitude -= latitudePrecision(length);

  const [latitudeValue, longitudeValue] = locationToIntegers(clippedLatitude, normalizedLongitude);
  return encodeIntegers(latitudeValue, longitudeValue, length);
}

export function plusCodePrecisionLabel(codeLength = PAIR_CODE_LENGTH) {
  const length = Math.max(PAIR_CODE_LENGTH, Math.min(MAX_CODE_LENGTH, Math.trunc(Number(codeLength) || PAIR_CODE_LENGTH)));
  if (length === 10) return "about 14 m";
  if (length === 11) return "about 3 m";
  return "sub-meter area";
}
