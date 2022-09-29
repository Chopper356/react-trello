import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './views/App';
import store from './store';
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);