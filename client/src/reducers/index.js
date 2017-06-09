import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';

import indicators from './indicators';
import regions from './regions';
import countries from './countries';
import data from './data';
import filters from './filters';

export default reduceReducers(
  combineReducers({
    indicators,
    regions,
    countries,
    data,
    filters
  })
);
