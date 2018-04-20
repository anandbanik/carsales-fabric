/* eslint-disable react/jsx-handler-names, no-loop-func, consistent-return */
import React from "react";

import CardComponent from "./card";
import Banner from "../banner";

import getToken from "../../helper/get-token";
import { fetchVehicle } from "../../helper/nodeservice-helper";
import {
  queryDMVDealer,
  queryDMVRegistration,
  queryDMVInsurance,
  queryDMVBanker
} from "../../helper/blockchain-helper";

import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

let vehicleList = [];
const dealerData = [];
const bankerData = [];
const insuranceData = [];
const registrationData = [];

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dealerExpanded: false,
      bankerExpanded: false,
      insuranceExpanded: false,
      registrationExpanded: false
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleDealerToggle = this.handleDealerToggle.bind(this);
    this.handleBankerToggle = this.handleBankerToggle.bind(this);
    this.handleInsuranceToggle = this.handleInsuranceToggle.bind(this);
    this.handleRegistrationToggle = this.handleRegistrationToggle.bind(this);
  }

  componentDidMount() {
    return fetchVehicle().then(cars => {
      vehicleList = cars;
    });
  }

  handleToggle(category, queryHandler, ret) {
    const tmpKep = {};
    if (!this.state[category]) {
      return getToken("user-admin", "user").then(bearToken => {
        let requests = 0;
        for (const i in vehicleList) {
          requests++;
          queryHandler({
            bearToken,
            vin: vehicleList[i].vin_number
          }).then(data => {
            requests--;
            if (data.result) {
              ret.push(data.result);
            }
            if (requests === 0) {
              tmpKep[category] = true;
              this.setState(tmpKep);
              return ret;
            }
          });
        }
      });
    } else {
      tmpKep[category] = false;
      this.setState(tmpKep);
      ret = [];
      return ret;
    }
  }

  handleDealerToggle() {
    return this.handleToggle("dealerExpanded", queryDMVDealer, dealerData);
  }

  handleBankerToggle() {
    return this.handleToggle("bankerExpanded", queryDMVBanker, bankerData);
  }

  handleInsuranceToggle() {
    return this.handleToggle(
      "insuranceExpanded",
      queryDMVInsurance,
      insuranceData
    );
  }

  handleRegistrationToggle() {
    return this.handleToggle(
      "registrationExpanded",
      queryDMVRegistration,
      registrationData
    );
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
          {/* USER CARD */}
          <Banner className={"admin-banner"} title={"Admin View"} />
          <CardComponent
            title="Dealer"
            subtitle="Car Seller"
            handleToggle={this.handleDealerToggle}
            expanded={this.state.dealerExpanded}
            details={dealerData}
          />
          <CardComponent
            title="Banker"
            subtitle="Car Loan"
            handleToggle={this.handleBankerToggle}
            expanded={this.state.bankerExpanded}
            details={bankerData}
          />
          <CardComponent
            title="Insurance"
            subtitle="Car Insurance"
            handleToggle={this.handleInsuranceToggle}
            expanded={this.state.insuranceExpanded}
            details={insuranceData}
          />
          <CardComponent
            title="Registration"
            subtitle="Car Registration"
            handleToggle={this.handleRegistrationToggle}
            expanded={this.state.registrationExpanded}
            details={registrationData}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

Admin.propTypes = {};

export default Admin;
/* eslint-enable */
