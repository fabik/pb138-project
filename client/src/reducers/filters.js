import { Set } from 'immutable';

import * as t from '../actions/actionTypes';

import createReducer from './utils/create-reducer';

const initialState = {
  selections: Set(), // ({type: 'world', color: '#333'},{type: 'country', value: 'CZK', color: '#abc'},...)
  years: [] // must be the same for all selection regions
};

export default createReducer(initialState, {
  [t.FILTER_SELECTION_ADD](state, action) {
    let selectionObject = {
      type: action.scopeType,
      color: action.color
    };

    if(action.scopeType === 'country') {
      selectionObject.country = action.country;
    } else if(action.scopeType === 'region') {
      selectionObject.region = action.region;
    }

    return {...state, selections: state.selections.add(selectionObject)};
  },
  [t.FILTER_SELECTION_REMOVE](state, action) {
    // filter out selection which we want to delete
    const filteredSelections = state.selections.filter(selection => {
      if(selection.indicator !== action.indicator) {
        return false;
      }

      switch(action.scopeType) {
        case 'world': return !(selection.type === 'world');
        case 'country': return !(selection.type === 'country' && selection.country === action.country);
        case 'region': return !(selection.type === 'region' && selection.region === action.region);
        default: return true;
      }
    });

    return {...state, selections: filteredSelections};
  },
  [t.FILTER_SELECTION_CLEAR_ALL](state, action) {
    return {...initialState};
  },
  [t.FILTER_SELECT_YEARS](state, action) {
    return {...state, years: action.years};
  }
});