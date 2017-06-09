import iso3166 from 'iso-3166-2';
import _ from 'lodash';

export function from2To3(code) {
  let code3 = undefined;
  _.forEach(iso3166.codes, (a, b) => {
    if(a.toUpperCase() === code.toUpperCase()) {
      code3 = b.toUpperCase();
    }
  });
  return code3;
}

export function from3To2(code) {
  let code2 = undefined;
  _.forEach(iso3166.codes, (a, b) => {
    if(b.toLowerCase() === code.toLowerCase()) {
      code2 = a.toLowerCase();
    }
  });
  return code2;
}