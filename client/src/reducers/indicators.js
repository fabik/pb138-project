import { Map } from 'immutable';

import * as t from '../actions/actionTypes';

import createReducer from './utils/create-reducer';

const initialState = {
  loaded: false,
  loading: false,
  success: true,
  indicatorsNamesMapping: Map(),
  selectedIndicator: null
};

export default createReducer(initialState, {
  [t.INDICATORS_FETCH_START](state, action) {
    return {...state, loading: true};
  },
  [t.INDICATORS_FETCH_SUCCESS](state, action) {
    return {...state, loaded: true, success: true, indicatorsNamesMapping: action.indicatorsNamesMapping};
  },
  [t.INDICATORS_FETCH_FAIL](state, action) {
    return {...state, success: false};
  },
  [t.INDICATORS_FETCH_END](state, action) {
    return {...state, loading: false};
  },
  [t.SELECT_INDICATOR](state, action) {
    return {...state, selectedIndicator: action.indicator};
  }
});
