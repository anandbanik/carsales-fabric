import React from "react";
import PropTypes from "prop-types";
import Banner from "../banner";

import {
  fetchAllInsurances,
  createInsurance
} from "../../helper/nodeservice-helper";
import sectionStyles from "../../styles/section.css";
import "../../styles/skeleton.css";
import "../../styles/custom.css";

class InsuranceBox extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeny = this.handleDeny.bind(this);
  }

  handleSubmit() {
    const data = this.props;

    return createInsurance({
      customer_id: data.customer_id,
      vin_number: data.vin_number,
      coverage: data.coverage,
      status: "approved",
      start_date: data.start_date,
      end_date: data.end_date,
      monthly_cost: data.monthly_cost,
      ssn_number: data.ssn_number
    }).then(() => {
      this.setState({
        replyText: ""
      });
      window.location = window.location;
    });
  }

  handleDeny() {
    const data = this.props;

    return createInsurance({
      customer_id: data.customer_id,
      vin_number: data.vin_number,
      coverage: data.coverage,
      status: "denied",
      start_date: data.start_date,
      end_date: data.end_date,
      monthly_cost: data.monthly_cost,
      ssn_number: data.ssn_number
    }).then(() => {
      this.setState({
        replyText: ""
      });
      window.location = window.location;
    });
  }

  render() {
    this.props = this.props && this.props.data;
    return (
      <tr>
        <td> {this.props.customer_id} </td>
        <td> {this.props.vin_number} </td>
        <td> {this.props.coverage} </td>
        <td> {this.props.monthly_cost} </td>
        <td> {this.props.start_date} </td>
        <td> {this.props.end_date} </td>
        <td>
          <button onClick={this.handleSubmit}>Approve</button>
        </td>
        <td>
          <button onClick={this.handleDeny}>Deny</button>
        </td>
      </tr>
    );
  }
}

class Broker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      insurance: []
    };
  }

  componentDidMount() {
    return fetchAllInsurances().then(insurance => {
      this.setState({ insurance });
    });
  }

  render() {
    return (
      <div>
        <Banner className={"broker-banner"} title={"Insurance Broker View"} />
        <div
          className={`${sectionStyles["cars-list"]} ${
            sectionStyles["flex-item"]
          } ${sectionStyles["display-table"]}`}
        >
          <table>
            <tbody>
              <tr>
                <td> CustomerID </td>
                <td> VIN Number </td>
                <td> Coverage </td>
                <td> Monthly Cost </td>
                <td> Start Date </td>
                <td> End Date </td>
                <td> Approve </td>
                <td> Deny </td>
              </tr>
              {this.state.insurance.map(v => (
                <InsuranceBox key={v.id} data={v} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

InsuranceBox.propTypes = {
  data: PropTypes.object,
  id: PropTypes.number,
  customer_id: PropTypes.number,
  vin_number: PropTypes.string,
  coverage: PropTypes.number,
  monthly_cost: PropTypes.number,
  start_date: PropTypes.string,
  end_date: PropTypes.string
};

export default Broker;
