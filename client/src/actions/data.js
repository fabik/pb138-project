import 'whatwg-fetch';
import xmlParser from 'xml2js';
import queryString from 'query-string';
import { Set } from 'immutable';
import _ from 'lodash';

import * as t from './actionTypes';
import { DATA_URL } from '../apiConfig';
import store from '../store';

function incrementCallsCount() {
  return {
    type: t.DATA_CALLS_INC
  }
}

function getNextCallId() {
  store.dispatch(incrementCallsCount());
  return store.getState().data.callsCount;
}

function worldIndicatorLoaded(indicator, data) {
  return {
    type: t.WORLD_INDICATOR_LOADED,
    indicator,
    data
  }
}

function regionsIndicatorLoaded(indicator, data) {
  return {
    type: t.REGIONS_INDICATOR_LOADED,
    indicator,
    data
  }
}

function countriesIndicatorLoaded(indicator, data) {
  return {
    type: t.COUNTRIES_INDICATOR_LOADED,
    indicator,
    data
  }
}

function dataFetchInProgress(inProgress, id) {
  if(inProgress) {
    return {
      type: t.DATA_FETCH_START,
      id
    }
  } else {
    return {
      type: t.DATA_FETCH_END,
      id
    }
  }
}

function dataFetchSuccess(success, id) {
  if(success) {
    return {
      type: t.DATA_FETCH_SUCCESS,
      id
    }
  } else {
    return {
      type: t.DATA_FETCH_FAIL,
      id
    }
  }
}

/**
 * Generic function which fetch data from backend
 * @param indicator required, any key from backend indicators api
 * @param startYear optional
 * @param endYear optional
 * @param regions optional
 * @param countries optional
 * @param return_world optional
 * @param return_regions optional array of region keys as specified in backend regions api
 * @param return_countries optional array of country keys as specified in backend countries api
 * @param successCallBack called if result is parsed correctly and result will be given to this function
 * @param failCallBack called if error occurred and error will be given as parameter to this function
 * @returns {function(*=)} thunk, which can be dispatched if redux-thunk middleware is applied to store
 */
function dataFetch({indicator,
                          startYear = null,
                          endYear = null,
                          regions = [],
                          countries = [],
                          return_world = false,
                          return_regions = false,
                          return_countries = false},
                          successCallBack = () => void(0),
                          failCallBack = () => void(0)) {
  return dispatch => {
    const callId = getNextCallId(); // unique call id for one session
    dispatch(dataFetchInProgress(true, callId));

    // queryString library omits keys if value is undefined
    const query = queryString.stringify({
      indicator,
      start_year: startYear ? startYear : undefined,
      end_year: endYear ? endYear : undefined,
      regions: regions ? regions.join() : undefined,
      countries: countries ? countries.join() : undefined,
      return_world,
      return_regions,
      return_countries
    });

    fetch(DATA_URL + '?' + query)
      .then(response => {
        dispatch(dataFetchInProgress(false, callId));
        if(!response.ok) {
          throw Error(response.statusText);
        }

        return response.text();
      })
      .then(xmlString => xmlParser.parseString(xmlString, (err, result) => {
        if(err) {
          throw Error(err);
        }

        dispatch(dataFetchSuccess(true, callId));
        successCallBack(result);
      }))
      .catch((e) => {
        dispatch(dataFetchSuccess(false, callId));
        failCallBack(e);
      });
  }
}

function fetchWorldIndicator(indicator, startYear = null, endYear = null) {
  const params = {
    indicator,
    startYear,
    endYear,
    return_world: true
  };

  return dispatch => {
    dispatch(dataFetch(params, result => {
      let data = {};

      const values = result.result.world[0].value;
      _.forEach(values, item => {
        const { _: value, $: attribs } = item;
        const { year } = attribs;
        data[year] = value;
      });
      dispatch(worldIndicatorLoaded(indicator, data));
    }));
  }
}

/**
 * Updates redux store with relevant data, if data is already in store, nothing is fetched
 * if data are partially in store, only missing data are fetched
 * @returns {function(*, *)} redux-thunk which can be dispatched
 */
export function updateWorldIndicator() {
  return (dispatch, getState) => {
    const { selectedIndicator } = getState().indicators;

    if(!selectedIndicator) {
      return;
    }
    // check store state and fetch missing data
    // check if world is in selections
    const { selections, years } = getState().filters;
    if(!selections.find(selection => selection.type === 'world')) {
      return;
    }

    const { indicatorsWorldAvailableYears } = getState().data;
    const availYears = indicatorsWorldAvailableYears.get(selectedIndicator);

    if(!availYears) {
      // fetch all
      dispatch(fetchWorldIndicator(selectedIndicator, _.min(years), _.max(years)));
    } else {
      // calculate diff and fetch
      const missingYears = Set(years).map(y => y.toString()).subtract(availYears);
      dispatch(fetchWorldIndicator(selectedIndicator, missingYears.min(), missingYears.max()));
    }
  }
}

function fetchCountriesIndicator(indicator, startYear = null, endYear = null, countries = []) {
  const params = {
    indicator,
    startYear,
    endYear,
    countries,
    return_countries: true
  };

  return dispatch => {
    if(countries.length === 0) {
      return;
    }

    dispatch(dataFetch(params, result => {
      let data = {};

      const countries = result.result.countries[0].country;
      _.forEach(countries, country => {
        let countryData = {};
        const code = country.$.code;
        const items = country.value;
        _.forEach(items, item => {
          const { _: value, $: attribs } = item;
          const { year } = attribs;
          countryData[year] = value;
        });
        data[code] = countryData;
      });

      dispatch(countriesIndicatorLoaded(indicator, data));
    }))
  }
}

export function updateCountriesIndicator() {
  return (dispatch, getState) => {
    const { selectedIndicator } = getState().indicators;

    if(!selectedIndicator) {
      return;
    }

    const { selections, years } = getState().filters;
    const countriesSelections = selections.filter(selection => selection.type === 'country');
    if(!countriesSelections) {
      return;
    }
    const selectedCountries = countriesSelections.map(selection => selection.country);

    const { indicatorsCountryAvailableYears } = getState().data;
    const availCountriesYears = indicatorsCountryAvailableYears.get(selectedIndicator);

    if(!availCountriesYears) {  // no country has loaded anything for this indicator
      dispatch(fetchCountriesIndicator(selectedIndicator, _.min(years), _.max(years), selectedCountries.toArray()));
    } else {
      // todo: diff algorithm to fetch only missing data
      dispatch(fetchCountriesIndicator(selectedIndicator, _.min(years), _.max(years), selectedCountries.toArray()));
    }
  }
}

function fetchRegionsIndicator(indicator, startYear = null, endYear = null, regions = []) {
  const params = {
    indicator,
    startYear,
    endYear,
    regions,
    return_regions: true
  };

  return dispatch => {
    if(regions.length === 0) {
      return;
    }

    dispatch(dataFetch(params, result => {
      let data = {};

      const regions = result.result.regions[0].region;
      _.forEach(regions, region => {
        let regionData = {};
        const code = region.$.code;
        const items = region.value;
        _.forEach(items, item => {
          const { _: value, $: attribs } = item;
          const { year } = attribs;
          regionData[year] = value;
        });
        data[code] = regionData;
      });

      dispatch(regionsIndicatorLoaded(indicator, data));
    }))
  }
}

export function updateRegionsIndicator() {
  return (dispatch, getState) => {
    const { selectedIndicator } = getState().indicators;

    if(!selectedIndicator) {
      return;
    }

    const { selections, years } = getState().filters;
    const regionsSelections = selections.filter(selection => selection.type === 'region');
    if(!regionsSelections) {
      return;
    }
    const selectedRegions = regionsSelections.map(selection => selection.region);

    const { indicatorsRegionAvailableYears } = getState().data;
    const availRegionsYears = indicatorsRegionAvailableYears.get(selectedIndicator);

    if(!availRegionsYears) {  // no region has loaded anything for this indicator
      dispatch(fetchRegionsIndicator(selectedIndicator, _.min(years), _.max(years), selectedRegions.toArray()));
    } else {
      // todo: diff algorithm to fetch only missing data
      dispatch(fetchRegionsIndicator(selectedIndicator, _.min(years), _.max(years), selectedRegions.toArray()));
    }
  }
}