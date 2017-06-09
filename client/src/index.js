import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/App'

// redux
import store from './store';


// import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import styles from './css/index.css';

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('app'));
