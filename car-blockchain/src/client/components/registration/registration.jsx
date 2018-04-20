import React from "react";
import PropTypes from "prop-types";
import Banner from "../banner";

import "../../styles/user.css";
import sectionStyles from "../../styles/section.css";
import "../../styles/negotiation.css";
import "../../styles/skeleton.css";
import "../../styles/custom.css";

import { fetchRegistrations } from "../../helper/nodeservice-helper";

class RegisterBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    this.props = this.props && this.props.data;
    return (
      <tr>
        <td> {this.props.id} </td>
        <td> {this.props.customer_id} </td>
        <td> {this.props.vin_number} </td>
        <td> {this.props.tag_id} </td>
        <td> {this.props.insurance_id} </td>
        <td> {this.props.start_date} </td>
        <td> {this.props.end_date} </td>
        <td>
          <button>Approve</button>
        </td>
        <td>
          <button>Deny</button>
        </td>
      </tr>
    );
  }
}

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registrations: [
        {
          id: "1",
          customer_id: "1",
          vin_number: "123123",
          tag_id: "547-ADI",
          insurance_id: "2",
          start_date: "09/18/2017",
          end_date: "09/17/2019",
          status: true
        }
      ]
    };
  }

  componentDidMount() {
    return fetchRegistrations().then(registrations => {
      console.log("REGIS:::", registrations); // eslint-disable-line
      if (!registrations.hasOwnProperty("message")) {
        this.setState({ registrations });
      }
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
                <td>ID</td>
                <td> CustomerID </td>
                <td> VIN Number </td>
                <td> Coverage </td>
                <td> Monthly Cost </td>
                <td> Start Date </td>
                <td> End Date </td>
                <td> Approve </td>
                <td> Deny </td>
              </tr>
              {this.state.registrations.map(v => (
                <RegisterBox key={v.id} data={v} />
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
  id: PropTypes.number,
  customer_id: PropTypes.number,
  vin_number: PropTypes.number,
  start_date: PropTypes.string,
  end_date: PropTypes.string,
  insurance_id: PropTypes.string,
  tag_id: PropTypes.string
};

export default Registration;
