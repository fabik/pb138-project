import { Set, Map } from 'immutable';

import * as t from '../actions/actionTypes';

import createReducer from './utils/create-reducer';
import { makeWorldKey, makeCountryKey, makeRegionKey } from './utils/dataKeyGenerator';

const initialState = {
  callsCount: 0,  // total number of calls, next call id
  loading: Set(), // ids of calls in progress
  done: Set(),  // ids of resolved calls successful or failed
  success: Set(), // ids of successful calls
  indicatorsWorldAvailableYears: Map(),  // WorldCountriesMap("<indicator_code": Set(<year>, <year>, <year>, ...), ...)
  indicatorsRegionAvailableYears: Map(), // WorldCountriesMap("<indicator_code": WorldCountriesMap("<region_code>": Set(<year>, <year>, ...)), ...)
  indicatorsCountryAvailableYears: Map(), // WorldCountriesMap("<indicator_code": WorldCountriesMap("<country_code>": Set(<year>, <year>, ...)), ...)
  data: Map() // WorldCountriesMap("<indicator_code>-<year>-<"world"|"region"|"country">-<code_of_region|code_of_country>": <value>)
              // e.g. WorldCountriesMap("NY.GDP.MKTP.CD-2001-world": 6849849,
              //          "NY.GDP.MKTP.CD-1987-country-AFG": 56416,
              //          "IT.NET.USER.ZS-2003-region-ARG": 843123, ...)
};

export default createReducer(initialState, {
  [t.DATA_FETCH_START](state, action) {
    return {...state,
            callsCount: state.callsCount++,
            loading: state.loading.add(action.id)};
  },
  [t.DATA_FETCH_SUCCESS](state, action) {
    return {...state, success: state.success.add(action.id)};
  },
  [t.DATA_FETCH_FAIL](state, action) {
    return {...state};
  },
  [t.DATA_FETCH_END](state, action) {
    return {...state,
            loading: state.loading.delete(action.id),
            done: state.done.add(action.id)};
  },
  [t.DATA_CALLS_INC](state, action) {
    return {...state, callsCount: state.callsCount+1};
  },
  [t.WORLD_INDICATOR_LOADED](state, action) {
    const { indicator, data } = action;

    let mergedData = state.data;
    let years = Object.keys(data);
    for(let year of years) {
      // add new action.data to nextState.data
      const computedKey = makeWorldKey(indicator, year.toString());
      mergedData = mergedData.set(computedKey, data[year] ? data[year] : null);
    }
    const mergeIndices = Map({[indicator]: Set(years)});
    return {...state,
            data: mergedData,
            indicatorsWorldAvailableYears: state.indicatorsWorldAvailableYears.mergeDeep(mergeIndices)
    };
  },
  [t.REGIONS_INDICATOR_LOADED](state, action) {
    const { indicator, data } = action;

    let mergedData = state.data;
    let mergedIndicesBuilder = {};
    _.forOwn(data, (regionData, regionCode) => {
      mergedIndicesBuilder[regionCode] = Set(Object.keys(regionData));
      _.forOwn(regionData, (value, year) => {
        const computedKey = makeRegionKey(indicator, year, regionCode);
        mergedData = mergedData.set(computedKey, value);
      })
    });
    const mergeIndices = Map({[indicator]: mergedIndicesBuilder});
    return {...state,
            data: mergedData,
            indicatorsRegionAvailableYears: state.indicatorsRegionAvailableYears.mergeDeep(mergeIndices)};
  },
  [t.COUNTRIES_INDICATOR_LOADED](state, action) {
    const { indicator, data } = action;

    let mergedData = state.data;
    let mergeIndicesBuilder = {};
    _.forOwn(data, (countryData, countryCode) => {
      mergeIndicesBuilder[countryCode] = Set(Object.keys(countryData));
      _.forOwn(countryData, (value, year) => {
        const computedKey = makeCountryKey(indicator, year, countryCode);
        mergedData = mergedData.set(computedKey, value)
      });
    });
    const mergeIndices = Map({[indicator]: mergeIndicesBuilder});
    return {...state,
            data: mergedData,
            indicatorsCountryAvailableYears: state.indicatorsCountryAvailableYears.mergeDeep(mergeIndices)};
  }
});