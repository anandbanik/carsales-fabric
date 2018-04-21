import React from "react";
import PropTypes from "prop-types";
import Banner from "../banner";

import "../../styles/user.css";
import sectionStyles from "../../styles/section.css";
import "../../styles/negotiation.css";
import "../../styles/skeleton.css";
import "../../styles/custom.css";

import getToken from "../../helper/get-token";
import { fetchVehicle } from "../../helper/nodeservice-helper";
import {
  queryDMVRegistration,
  registrationUser
} from "../../helper/blockchain-helper";

/* eslint-disable no-loop-func */
class RegisterBox extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const data = this.props;

    getToken("dmv-admin", "user").then(bearToken => {
      // Blockchain Server: broker approves the transaction
      registrationUser({
        bearToken,
        peers: "dmv/peer0",
        ssn: data.ssnNumber,
        status: "approve",
        vin: data.vin
      });
    });
  }

  render() {
    this.props = this.props && this.props.data;
    return (
      <tr>
        <td> {this.props.ssnNumber} </td>
        <td> {this.props.vin} </td>
        <td> {this.props.startDate} </td>
        <td> {this.props.endDate} </td>
        <td> {this.props.status} </td>
        <td>
          <button onClick={this.handleSubmit}>Approve</button>
        </td>
      </tr>
    );
  }
}

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registrations: []
    };
  }

  componentDidMount() {
    const ret = [];
    const tmpKep = {};
    return fetchVehicle().then(cars => {
      return getToken("user-admin", "user").then(bearToken => {
        let requests = 0;
        for (const i in cars) {
          requests++;
          queryDMVRegistration({
            bearToken,
            vin: cars[i].vin_number
          }).then(data => {
            requests--;
            if (data.result) {
              ret.push(data.result);
            }
            if (requests === 0) {
              tmpKep.registrations = ret;
              this.setState(tmpKep);
            }
          });
        }
      });
    });
  }

  render() {
    return (
      <div>
        <Banner className={"dmv-banner"} title={"DMV Registration View"} />
        <div
          className={`${sectionStyles["cars-list"]} ${
            sectionStyles["flex-item"]
          } ${sectionStyles["display-table"]}`}
        >
          <table>
            <tbody>
              <tr>
                <td> SSN Number </td>
                <td> VIN Number </td>
                <td> Start Date </td>
                <td> End Date </td>
                <td> Status </td>
                <td> Approve </td>
              </tr>
              {this.state.registrations.map(v => (
                <RegisterBox key={v.vin} data={v} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

RegisterBox.propTypes = {
  data: PropTypes.object,
  vin: PropTypes.number,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  ssnNumber: PropTypes.string,
  status: PropTypes.string
};

export default Registration;

/* eslint-enable */
