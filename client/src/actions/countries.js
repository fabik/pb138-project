import 'whatwg-fetch';
import xmlParser from 'xml2js';
import _ from 'lodash';

import * as t from './actionTypes';
import { COUNTRIES_URL } from '../apiConfig';

function countriesFetchInProgress(inProgress) {
  if(inProgress) {
    return {
      type: t.COUNTRIES_FETCH_START
    }
  } else {
    return {
      type: t.COUNTRIES_FETCH_END
    }
  }
}

function countriesFetchSuccess(success, countriesNamesMapping = null) {
  if(success) {
    return {
      type: t.COUNTRIES_FETCH_SUCCESS,
      countriesNamesMapping
    }
  } else {
    return {
      type: t.COUNTRIES_FETCH_FAIL
    }
  }
}

export function countriesFetch() {
  return dispatch => {
    dispatch(countriesFetchInProgress(true));

    fetch(COUNTRIES_URL)
      .then(response => {
        dispatch(countriesFetchInProgress(false));
        if(!response.ok) {
          throw Error(response.statusText);
        }

        return response.text();
      })
      .then(xmlString => xmlParser.parseString(xmlString, (err, result) => {
        if(err) {
          throw Error(err);
        }

        const countriesArray = result.countries.country;
        if(!countriesArray) {
          throw Error("Invalid XML format. Countries > country element not found.");
        }

        let codeNameMapping = {};
        _.forEach(countriesArray, element => {
          const { code, name } = element.$;
          codeNameMapping[code] = name;
        });

        dispatch(countriesFetchSuccess(true, codeNameMapping));
      }))
      .catch((e) => {
        console.error(e);
        dispatch(countriesFetchSuccess(false))
      });
  }
}