import React from 'react';
import { connect } from 'react-redux';

import SideMenu from './SideMenu';
import ContentWrapper from './ContentWrapper';
import ProgressBar from './ProgressBar';
import { indicatorsFetch, selectIndicator } from '../actions/indicators';
import { regionsFetch } from '../actions/regions';
import { countriesFetch } from '../actions/countries';
import { updateWorldIndicator, updateCountriesIndicator, updateRegionsIndicator } from '../actions/data';
import { addSelection } from '../actions/filters';

const mapStateToProps = state => {
  return {
    indicatorsLoaded: state.indicators.loaded,
    indicators: state.indicators.indicatorsNamesMapping,
    selectedIndicator: state.indicators.selectedIndicator
  }
};

const mapDispatchToProps = dispatch => {
  return {
    loadIndicators: () => dispatch(indicatorsFetch()),
    loadRegions: () => dispatch(regionsFetch()),
    loadCountries: () => dispatch(countriesFetch()),
    selectIndicator: (indicator) => dispatch(selectIndicator(indicator)),
    updateWorldIndicator: () => dispatch(updateWorldIndicator()),
    updateCountriesIndicator: () => dispatch(updateCountriesIndicator()),
    updateRegionsIndicator: () => dispatch(updateRegionsIndicator()),
    addDefaultSelection: () => dispatch(addSelection("SP.POP.TOTL", { type: 'world' }))
  }
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      timer: null
    }
  }

  componentWillMount() {
    this.props.loadIndicators();
    this.props.loadRegions();
    this.props.loadCountries();
  }

  componentDidMount() {
    // display default indicator
    this.props.selectIndicator("SP.POP.TOTL");
    this.props.addDefaultSelection();
    this.props.updateWorldIndicator();
  }

  render() {
    const { indicatorsLoaded, indicators, selectedIndicator } = this.props;

    let menuArray = []; // settings for each item in side menu
    let selectedIndex = null;
    if(indicators) {
      indicators.keySeq().forEach((key, index) => {
        const text = indicators.get(key);
        menuArray.push({text, onClick: () => {
          if(this.props.selectedIndicator === key) {
            this.props.selectIndicator(null);
          } else {
            this.props.selectIndicator(key);
            this.props.updateWorldIndicator();
            this.props.updateCountriesIndicator();
            this.props.updateRegionsIndicator();
          }
        }});

        if(key === selectedIndicator) {
          selectedIndex = index;
        }
      });
    }

    return (
      <div className='main_container'>
        <ProgressBar/>
        <SideMenu title="Data visualization"
                  menuItems={menuArray}
                  selectedIndex={selectedIndex}
                  loading={!indicatorsLoaded}/>
        <ContentWrapper/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
