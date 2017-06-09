import { Map } from 'immutable';

import * as t from '../actions/actionTypes';

import createReducer from './utils/create-reducer';

const initialState = {
  loaded: false,
  loading: false,
  success: true,
  regionsNamesMapping: Map(), // Map(<region_code1>: <region_name>, ...)
  countriesMapping: Map() // Map(<region_code1>: Set(<country_code1>, <country_code2>, ...), ...)
};

export default createReducer(initialState, {
  [t.REGIONS_FETCH_START](state, action) {
    return {...state, loading: true};
  },
  [t.REGIONS_FETCH_SUCCESS](state, action) {
    const { regionsNamesMapping: regionsNames, countriesMapping: countries } = action;
    const regionsNamesMapping = Map(regionsNames);
    const countriesMapping = Map(countries);
    return {...state, loaded: true, success: true, regionsNamesMapping, countriesMapping};
  },
  [t.REGIONS_FETCH_FAIL](state, action) {
    return {...state, success: false};
  },
  [t.REGIONS_FETCH_END](state, action) {
    return {...state, loading: false};
  }
})