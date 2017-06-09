import 'whatwg-fetch';
import xmlParser from 'xml2js';
import _ from 'lodash';

import * as t from './actionTypes';
import { REGIONS_URL } from '../apiConfig';

function regionsFetchInProgress(inProgress) {
  if(inProgress) {
    return {
      type: t.REGIONS_FETCH_START
    }
  } else {
    return {
      type: t.REGIONS_FETCH_END
    }
  }
}

function regionsFetchSuccess(success, regionsNamesMapping = null, countriesMapping = null) {
  if(success) {
    return {
      type: t.REGIONS_FETCH_SUCCESS,
      regionsNamesMapping,
      countriesMapping
    }
  } else {
    return {
      type: t.REGIONS_FETCH_FAIL
    }
  }
}

export function regionsFetch() {
  return dispatch => {
    dispatch(regionsFetchInProgress(true));

    fetch(REGIONS_URL)
      .then(response => {
        dispatch(regionsFetchInProgress(false));
        if(!response.ok) {
          throw Error(response.statusText);
        }

        return response.text();
      })
      .then(xmlString => xmlParser.parseString(xmlString, (err, result) => {
        if(err) {
          throw Error(err);
        }

        const regionsArray = result.regions.region;
        if(!regionsArray) {
          throw Error("Invalid XML format. Regions > region element not found.")
        }

        let codeNameMapping = {};
        let countriesMapping = {};
        _.forEach(regionsArray, element => {
          const { code: regionCode, name } = element.$;
          codeNameMapping[regionCode] = name;
          countriesMapping[regionCode] = [];

          _.forEach(element.country, country => {
            const { code: countryCode } = country.$;
            countriesMapping[regionCode].push(countryCode);
          });
        });

        dispatch(regionsFetchSuccess(true, codeNameMapping, countriesMapping));
      }))
      .catch((e) => {
        dispatch(regionsFetchSuccess(false))
      });
  }
}