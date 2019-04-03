import React from "react";
import PropTypes from "prop-types";
import Banner from "../banner";
import { browserHistory, Link } from "react-router";
import custom from "../../styles/custom.css";
import getToken from "../../helper/get-token";
import {
  fetchAllInsurances,
  createInsurance
} from "../../helper/nodeservice-helper";
import { brokerUser } from "../../helper/blockchain-helper";

import sectionStyles from "../../styles/section.css";
import "../../styles/skeleton.css";
import "../../styles/custom.css";

class InsuranceBox extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const data = this.props;

    getToken("user-admin", "user").then(bearToken => {
      // Blockchain Server: broker apporves the transaction
      brokerUser({
        bearToken,
        peers: "insurance/peer0",
        ssn: "user-admin",
        status: "approve",
        vin: data.vin_number
      });

      return createInsurance({
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
        // window.location = window.location;
      });
    });
  }

  render() {
    this.props = this.props && this.props.data;
    return (
      <tr>
        <td> {this.props.vin_number} </td>
        <td> {this.props.coverage} </td>
        <td> {this.props.monthly_cost} </td>
        <td> {this.props.start_date} </td>
        <td> {this.props.end_date} </td>
        <td> {this.props.status} </td>
        <td>
          <button onClick={this.handleSubmit} className={custom.buttonSuccess}>Approve</button>
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
        {/* <Banner className={"broker-banner"} title={"Insurance Broker View"} /> */}
        <div className={custom.breadCrums}>
  <div className={custom.container}>
  <Link style={{textDecoration: "none", color: "white"}} to="/">Home</Link> > Insurance Broker </div></div>
        
  <div style={{ backgroundColor: "#fff",fontWeight: "800", fontSize: "1.3em", border: "1px solid #eee", paddingTop: "20px", paddingBottom: "20px"}}> 
      <div className={custom.container}>
      <b>Insurance Broker View</b>
      </div>
      </div>

      <div className={custom.container}>
      <div style={{padding: "30px",  minHeight:"400px", marginTop:"40px",textAlign: "center" , borderRadius: "4px" ,border: "1px dashed #ddd", backgroundColor: "#fff"}} >

       {this.state.insurance.length === 0 ? <span style={{color: "#ddd", lineHeight: "400px",fontSize: "30px"  }}>
No transactions 
</span> : 

          <table className={custom.tableStyle}>
            <tbody>
              <tr >
                <td > VIN Number </td>
                <td> Coverage </td>
                <td> Monthly Cost </td>
                <td> Start Date </td>
                <td> End Date </td>
                <td> Status </td>
                <td> Approve </td>
              </tr>
              {this.state.insurance.map(v => (
                <InsuranceBox key={v.vin_number} data={v} />
              ))}
            </tbody>
          </table>}
          </div></div>
        </div>
      
    );
  }
}

InsuranceBox.propTypes = {
  data: PropTypes.object,
  vin_number: PropTypes.string,
  coverage: PropTypes.number,
  status: PropTypes.string,
  monthly_cost: PropTypes.number,
  start_date: PropTypes.string,
  end_date: PropTypes.string
};

export default Broker;
