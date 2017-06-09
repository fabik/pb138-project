import React from 'react';
import { connect } from 'react-redux';

import SimpleGraph from './SimpleGraph';
import YearSelection from './YearSelection';
import { Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import { makeCountryKey, makeRegionKey, makeWorldKey } from '../reducers/utils/dataKeyGenerator';
import _ from 'lodash';

const mapStateToProps = state => {
  return {
    indicators: state.indicators.indicatorsNamesMapping,
    selectedIndicator: state.indicators.selectedIndicator,
    years: state.filters.years,
    selections: state.filters.selections,
    data: state.data.data,
    countries: state.countries.countriesNamesMapping,
    regions: state.regions.regionsNamesMapping
  }
};

class DataVisualizer extends React.Component {
  constructor() {
    super();

    this.state = {
      chartType: 'bar' // 'line'|'bar'|'radial
    }
  }

  generateDatasetsForSimpleGraph = () => {
    const { years,
      selectedIndicator,
      selections,
      data,
      countries,
      regions } = this.props;

    let datasets = [];
    selections.map(selection => {
      // get data from redux store or call api
      let dataset = {label: "", data: [], backgroundColor: selection.color};
      let keys = [];
      if(selection.type === 'world') {
        dataset.label = "world";
        keys = years.map(year => makeWorldKey(selectedIndicator, year));
      } else if(selection.type === 'region') {
        // dataset.label = selection.region;
        dataset.label = regions.get(selection.region);
        keys = years.map(year => makeRegionKey(selectedIndicator, year, selection.region));
      } else if(selection.type === 'country') {
        // dataset.label = selection.country;
        dataset.label = countries.get(selection.country);
        keys = years.map(year => makeCountryKey(selectedIndicator, year, selection.country));
      }
      // retrieve data
      keys.map(key => {
        const value = data.get(key);
        dataset.data.push(value ? parseFloat(value) : null);
      });


      datasets.push(dataset);
    });

    return datasets;
  };

  changeChartType = type => {
    if(this.state.chartType !== type) {
      this.setState({
        chartType: type
      });
    }
  };

  render() {
    const { chartType } = this.state;
    const { years, selectedIndicator } = this.props;
    const labels = years.length !== 0 ? years.map(year => year.toString()) : ['No years selected.'];

    const datasets = selectedIndicator ? this.generateDatasetsForSimpleGraph() : [];
    let data = {
      labels,
      datasets: datasets.length === 0 ? [] : datasets
    };

    return (
      <Row className="visualizer">
        <Col xs={12} sm={12} md={12} className="x_panel">
          <Row className="x_title">
            <Col md={3}>
              <h3>{selectedIndicator ? this.props.indicators.get(selectedIndicator) : "No indicator selected."}</h3>
            </Col>
            <Col md={6}>
              <ButtonToolbar>
                <Button onClick={() => this.changeChartType('line')} active={chartType === 'line'}>Line chart</Button>
                <Button onClick={() => this.changeChartType('bar')} active={chartType === 'bar'}>Bar chart</Button>
                <Button onClick={() => this.changeChartType('radar')} active={chartType === 'radar'}>Radar chart</Button>
              </ButtonToolbar>
            </Col>
            <Col md={3}>
              <YearSelection/>
            </Col>
          </Row>

          <Row className="x-content">
            <Col xs={12} sm={12} md={12}>
              <div style={{"height": "400px"}}>
                {chartType === 'line' ? <SimpleGraph type='line' data={data}/> : ""}
                {chartType === 'bar' ? <SimpleGraph type='bar' data={data}/> : ""}
                {chartType === 'radar' ? <SimpleGraph type='radar' data={data}/> : ""}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default connect(mapStateToProps)(DataVisualizer);