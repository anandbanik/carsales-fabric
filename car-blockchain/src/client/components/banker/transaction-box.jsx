import React from "react";
import PropTypes from "prop-types";

import "../../styles/skeleton.css";
import "../../styles/custom.css";
import "../../styles/user.css";
import negotiationStyles from "../../styles/negotiation.css";

import { createLoan } from "../../helper/nodeservice-helper";

class Transaction extends React.Component {
  constructor(props) {
    super(props);

    this.handleComments = this.handleComments.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeny = this.handleDeny.bind(this);
    this.state = {
      replyText: ""
    };
  }

  handleComments(event) {
    this.setState({
      replyText: event.target.value
    });
    this.props.data.apr = this.state.replyText;
  }

  handleSubmit() {
    // Node service, banker approved & set APR
    const data = this.props.data;

    return createLoan({
      customer_id: data.customer_id,
      vin_number: data.vin_number,
      amount: data.amount,
      loan_period_months: data.loan_period_months,
      ssn_number: data.ssn_number,
      monthly_payment: data.monthly_payment,
      status: "approved",
      apr: this.state.replyText
    }).then(() => {
      this.setState({
        replyText: ""
      });
      window.location = window.location;
    });
  }

  handleDeny() {
    const data = this.props.data;

    return createLoan({
      customer_id: data.customer_id,
      vin_number: data.vin_number,
      amount: data.amount,
      loan_period_months: data.loan_period_months,
      ssn_number: data.ssn_number,
      monthly_payment: data.monthly_payment,
      status: "denined"
    }).then(() => {
      this.setState({
        replyText: ""
      });
      window.location = window.location;
    });
  }

  render() {
    return (
      <div className={negotiationStyles.negotiation}>
        <div className={negotiationStyles["vehicle-info"]}>
          <div className={negotiationStyles["vehicle-info-text"]}>
            <section className={negotiationStyles["basic-info"]}>
              VIN: {this.props.data.vin_number}
              <br />
              CustomerID: {this.props.data.customer_id}
            </section>

            <section className={negotiationStyles["loan-info"]}>
              Loan Status: {this.props.data.status}
              <br />
              Loan APR: {this.props.data.apr}
              <br />
              Loan Term: {this.props.data.loan_period_months}
            </section>
            {/* <section className={negotiationStyles["insurance-info"]}>
              Insurance Status: {this.props.data.insurance_status}
              <br />
              Insuarance Amount: {this.props.data.insurance_amount}
            </section> */}
          </div>
          <div className={negotiationStyles.expectation}>
            <span className={negotiationStyles.subtitle}>
              Set APR:{" "}
              <input
                type="number"
                value={this.state.replyText}
                onChange={this.handleComments}
              />
            </span>
            <br />

            <button
              className={negotiationStyles.button}
              onClick={this.handleSubmit}
            >
              Approve
            </button>
            <button
              className={negotiationStyles.button}
              onClick={this.handleDeny}
            >
              Deny
            </button>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

Transaction.propTypes = {
  data: PropTypes.object
};

export default Transaction;
