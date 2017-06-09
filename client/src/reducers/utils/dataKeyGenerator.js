export function makeWorldKey(indicator, year) {
  return indicator + '-' + year + '-world';
}

export function makeRegionKey(indicator, year, region) {
  return indicator + '-' + year + '-region-' + region;
}

export function makeCountryKey(indicator, year, country) {
  return indicator + '-' + year + '-country-' + country;
}