import 'whatwg-fetch';
import xmlParser from 'xml2js';
import _ from 'lodash';
import { Map } from 'immutable';

import * as t from './actionTypes';
import { INDICATORS_URL } from '../apiConfig';

function indicatorsFetchInProgress(inProgress) {
  if(inProgress) {
    return {
      type: t.INDICATORS_FETCH_START
    }
  } else {
    return {
      type: t.INDICATORS_FETCH_END
    }
  }
}

function indicatorsFetchSuccess(success, indicatorsNamesMapping = null) {
  if(success) {
    return {
      type: t.INDICATORS_FETCH_SUCCESS,
      indicatorsNamesMapping
    }
  } else {
    return {
      type: t.INDICATORS_FETCH_FAIL
    }
  }
}

export function indicatorsFetch() {
  return dispatch => {
    dispatch(indicatorsFetchInProgress(true));

    fetch(INDICATORS_URL)
    .then(response => {
        dispatch(indicatorsFetchInProgress(false));
        if(!response.ok) {
          throw Error(response.statusText);
        }

        return response.text();
      })
      .then(xmlString => xmlParser.parseString(xmlString, (err, result) => {
        if(err) {
          throw Error(err);
        }

        const indicatorArray = result.indicators.indicator;
        if(!indicatorArray) {
          throw Error("Invalid XML format. Indicators > indicator element not found.");
        }

        let codeNameMapping = {};
        _.forEach(indicatorArray, element => {
          const { code, name } = element.$;
          codeNameMapping[code] = name;
        });

        dispatch(indicatorsFetchSuccess(true, Map(codeNameMapping)));
      }))
      .catch((e) => {
        console.error(e);
        dispatch(indicatorsFetchSuccess(false))
      });
  }
}

export function selectIndicator(indicator) {
  return {
    type: t.SELECT_INDICATOR,
    indicator
  }
}