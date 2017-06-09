import React from 'react';
import { connect } from 'react-redux';
import { selectYears } from '../actions/filters';

import DateRangePicker from './DateRangePicker';
import { updateWorldIndicator, updateCountriesIndicator, updateRegionsIndicator } from '../actions/data';

const mapDispatchToProps = dispatch => {
  return {
    selectYears: (years) => dispatch(selectYears(years)),
    updateWorldIndicator: () => dispatch(updateWorldIndicator()),
    updateRegionsIndicator: () => dispatch(updateRegionsIndicator()),
    updateCountriesIndicator: () => dispatch(updateCountriesIndicator())
  }
};

class YearSelection extends React.Component {
  constructor() {
    super();
  }

  makeArrayFromYears = (startYear, endYear) => {
    let years = [];
    for(let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  onApply = picker => {
    const startYear = picker.startDate.year();
    const endYear = picker.endDate.year();
    this.props.selectYears(this.makeArrayFromYears(startYear, endYear));
    this.props.updateWorldIndicator();
    this.props.updateRegionsIndicator();
    this.props.updateCountriesIndicator();
  };

  onDidMount = (startDate, endDate) => {
    this.props.selectYears(this.makeArrayFromYears(startDate.year(), endDate.year()));
  };

  render() {
    return (
      <DateRangePicker onApply={this.onApply} onDidMount={this.onDidMount}/>
    )
  }
}

export default connect(null, mapDispatchToProps)(YearSelection);