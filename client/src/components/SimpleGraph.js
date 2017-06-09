import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import YearSelection from './YearSelection';

class Graph extends React.Component {
  //noinspection JSUnusedGlobalSymbols,JSUnresolvedFunction,JSUnresolvedVariable
  static propTypes = {
    type: PropTypes.oneOf(['line', 'bar', 'radar']).isRequired,
    data: PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string).isRequired,
      datasets: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.number).isRequired
      }))
    }).isRequired
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.chart = new Chart(this.chartElement.getContext("2d"), {
      type: this.props.type,  // http://www.chartjs.org/docs/latest/charts
      data: this.props.data,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  mergeNewDatasetsToGraph = newDss => {
    let { datasets: oldDss } = this.chart.data;

    // filter out unwanted (removed) datasets
    const usedLabels = _.map(newDss, ds => ds.label);
    const removeDss = _.filter(oldDss, oldDs => !_.find(usedLabels, l => l === oldDs.label));
    for(let i = oldDss.length - 1; i >= 0; i--) {
      if(_.find(removeDss, removeDs => removeDs.label === oldDss[i].label)) {
        oldDss.splice(i, 1);
      }
    }

    _.forEach(newDss, newDs => {  // every new dataset
      const found = _.find(oldDss, ds => ds.label === newDs.label);
      if(found) { // found dataset with same label
        if(newDs.data.length !== found.data.length) { // data array length different
          found.data = newDs.data;
        } else {  // data array length the same
          found.backgroundColor = newDs.backgroundColor;
          _.map(newDs.data, (data, index) => { // every value in same dataset
            if(found.data[index] !== data) {
              found.data[index] = data;
            }
          })
        }
      } else {
        oldDss.push(newDs);
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    // new datasets received
    const { labels: newLabels, datasets: newDatasets } = nextProps.data;
    const { labels, datasets } = this.props.data;
    let update = false;

    if(newLabels !== labels) {
      this.chart.config.data.labels = newLabels;
      update = true;
    }

    if(newDatasets !== datasets) {
      const { datasets: ds } = this.chart.data;
      if(ds[0] === undefined) {
        this.chart.data.datasets = newDatasets;
      } else {
        // diff algorithm to update only specific sets
        this.mergeNewDatasetsToGraph(newDatasets);
      }
      update = true;
    }

    if(update) {
      this.chart.update();
    }
  }

  render() {
    return (
      <canvas height="100px" ref={e => this.chartElement = e}/>
    )
  }
}

export default Graph;