import React from 'react';

import './calengrade.css';

import logo from './assets/logo.svg';
import { CalengradeProvider } from './context/CalengradeContext';
import { CalengradeScreens } from './Screens';

const Calengrade = () => (
  <div id="calengrade">
    <div className="app">
      <img src={logo} alt="logo do Calengrade" className="logo" />
      <CalengradeProvider>
        <div className="content">
          <CalengradeScreens />
        </div>
      </CalengradeProvider>
    </div>
  </div>
);

export default Calengrade;
