import React, {Component} from "react";
import { browserHistory } from "react-router";
import "../styles/normalize.css";
import "../styles/raleway.css";
import skeleton from "../styles/skeleton.css";
import custom from "../styles/custom.css";
import { MuiThemeProvider } from "material-ui/styles";
import AppBar from 'material-ui/AppBar';
import HeaderImg from '../images/car.png';
import Slider from 'react-animated-slider';
import '../styles/horizonatal.css';
import m from '../images/car-inventory/black-c300.jpg';
import PropTypes from "prop-types";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      loggedInUser: null,
      unauthorized: true,
      processingCheck: true,
      uiVersion: null
    };
  }


render() {
  return (
<MuiThemeProvider>

<div >
  <div className={custom.headerTop}>
  <div  className={custom.container}>
  <h1> Blockchain Conference</h1></div>
  </div>
  {this.props.children}

</div>

</MuiThemeProvider>
  )
};


}
Home.propTypes = {
  children: PropTypes.any
};

export default Home;