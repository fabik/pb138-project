import { Map } from 'immutable';

import * as t from '../actions/actionTypes';

import createReducer from './utils/create-reducer';

const initialState = {
  loaded: false,
  loading: false,
  success: true,
  countriesNamesMapping: Map()
};

export default createReducer(initialState, {
  [t.COUNTRIES_FETCH_START](state, action) {
    return {...state, loading: true};
  },
  [t.COUNTRIES_FETCH_SUCCESS](state, action) {
    return {...state, loaded: true, success: true, countriesNamesMapping: Map(action.countriesNamesMapping)};
  },
  [t.COUNTRIES_FETCH_FAIL](state, action) {
    return {...state, success: false};
  },
  [t.COUNTRIES_FETCH_END](state, action) {
    return {...state, loading: false};
  }
})