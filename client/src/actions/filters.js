import * as t from './actionTypes';
import gen from 'color-generator';

export function addSelection(indicator, params) {
  const randomColor = gen(.7).alpha(.7).rgbaString();

  let actionCreatorObject = {
    type: t.FILTER_SELECTION_ADD,
    indicator,
    scopeType: params.type,
    color: params.color ? params.color : randomColor
  };

  if(params.type === 'world') {
     // do nothing
  } else if(params.type === 'country') {
    actionCreatorObject.country = params.country;
  } else if(params.type === 'region') {
    actionCreatorObject.region = params.region;
  } else {
    throw Error('Invalid type. World, country or region wanted, got ' + params.type);
  }

  return actionCreatorObject;
}

export function removeSelection(indicator, params) {
  let actionCreatorObject = {
    type: t.FILTER_SELECTION_REMOVE,
    indicator,
    scopeType: params.type
  };

  if(params.type === 'world') {
    // do nothing
  } else if(params.type === 'country') {
    actionCreatorObject.country = params.country;
  } else if(params.type === 'region') {
    actionCreatorObject.region = params.region;
  } else {
    throw Error('Invalid type. World, country or region wanted, got ' + params.type);
  }

  return actionCreatorObject;
}

export function removeAllSelections() {
  return {
    type: t.FILTER_SELECTION_CLEAR_ALL
  }
}

export function selectYears(years) {
  return {
    type: t.FILTER_SELECT_YEARS,
    years
  }
}