import NProgress from 'nprogress/nprogress';
import 'nprogress/nprogress.css';
import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    indicatorsLoading: state.indicators.loading,
    indicatorsLoaded: state.indicators.loaded,
    regionsLoading: state.regions.loading,
    regionsLoaded: state.regions.loaded,
    countriesLoading: state.countries.loading,
    countriesLoaded: state.countries.loaded,
    dataLoading: state.data.loading,
    dataDone: state.data.done
  }
};

class NProgressBar extends React.Component {
  constructor() {
    super();

    this.state = {
      initializationDone: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const { indicatorsLoaded, countriesLoaded, regionsLoaded } = nextProps;

    if(!this.state.initializationDone) {
      if(indicatorsLoaded && countriesLoaded && regionsLoaded) {
        this.setState({
          initializationDone: true
        });
        NProgress.done();
      } else {
        NProgress.inc();
      }
    } else {  // init done, only new data fetch triggers NProgress
      const { dataLoading: oldLoading } = this.props;
      const { dataLoading: newLoading } = nextProps;
      if(newLoading.size === 0) {
        NProgress.done();
      } else {
        const diff = oldLoading - newLoading;
        if(diff > 0) {
          // new data are loading
          NProgress.dec();
        } else {
          // some data are done loading
          NProgress.inc();
        }
      }
    }
  }

  componentDidMount() {
    NProgress.start();
  }

  render() {
    return null;
  }
}

export default connect(mapStateToProps)(NProgressBar);