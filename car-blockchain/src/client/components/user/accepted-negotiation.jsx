import React from "react";
import PropTypes from "prop-types";
import "../../styles/skeleton.css";
import "../../styles/custom.css";
import "../../styles/user.css";
import negotiationStyles from "../../styles/negotiation.css";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import getToken from "../../helper/get-token";
import {
  userBanker,
  userInsurance,
  queryRegistration
} from "../../helper/blockchain-helper";
import {
  createLoan,
  createInsurance,
  fetchLoan,
  fetchInsurance
} from "../../helper/nodeservice-helper";

/* eslint-disable no-magic-numbers, camelcase, consistent-return */
class AcceptedNegotiation extends React.Component {
  constructor(props) {
    super(props);

    this.handleLoan = this.handleLoan.bind(this);
    this.handleInsurance = this.handleInsurance.bind(this);
    this.updateInputTermValue = this.updateInputTermValue.bind(this);
    this.updateInputAmountValue = this.updateInputAmountValue.bind(this);
    this.calcCoverage = this.calcCoverage.bind(this);

    this.state = {
      loan: [],
      insurance: [],
      registration: []
    };

    const d = new Date();
    this.start_date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    this.end_date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear() + 1}`;
    this.inputLoanTerm = "";
    this.inputLoanAmount = "";
  }

  calcCoverage(carPrice, duration, type) {
    let coverage = 0;

    if (duration === 6 && type === "comprehensive") {
      coverage = carPrice / 100 * 0.35;
    } else if (duration === 12 && type === "comprehensive") {
      coverage = carPrice / 100 * 0.3;
    } else if (duration === 6 && type === "collateral") {
      coverage = carPrice / 100 * 0.25;
    } else if (duration === 12 && type === "collateral") {
      coverage = carPrice / 100 * 0.2;
    } else {
      coverage = carPrice / 100 * 0.35;
    }
    return coverage;
  }

  updateInputTermValue(evt) {
    this.inputLoanTerm = evt.target.value;
  }

  updateInputAmountValue(evt) {
    this.inputLoanAmount = evt.target.value;
  }

  handleLoan(event) {
    // Set Default Loan Term & Amount
    if (this.inputLoanTerm === "") {
      this.inputLoanTerm = 60;
    }

    if (this.inputLoanAmount === "") {
      this.inputLoanAmount = this.props.data.actual_price;
    }

    const customer_id = this.props.data.customer_id;
    const vin = this.props.data.vin_number;
    const ssn = "user-admin";
    const price = this.inputLoanAmount;
    const loan_period_months = this.inputLoanTerm;
    const monthly_payment = this.inputLoanAmount / loan_period_months;

    getToken("user-admin", "user").then(bearToken => {
      // Blockchain Server: user applies for loan to banker
      userBanker({
        bearToken,
        peers: "dmv/peer0",
        ssn,
        vin,
        month: loan_period_months,
        price
      });

      // Node Server: user applies for loan to banker
      createLoan({
        customer_id,
        vin_number: vin,
        amount: price,
        loan_period_months,
        ssn_number: ssn,
        monthly_payment,
        status: "applied"
      }).then(loanData => {
        this.setState({
          loan: loanData
        });
        this.tabListHandler(1);
      });
    });

    event.preventDefault();
  }

  handleInsurance(event) {
    // Set Default Loan Term & Amount
    if (this.inputLoanTerm === "") {
      this.inputLoanTerm = this.props.data.actual_price;
    }

    if (this.inputLoanAmount === "") {
      this.inputLoanAmount = 60;
    }

    const loan_period_months = this.inputLoanTerm;
    const aprMonth = 4.3;
    const monthly_payment =
      aprMonth *
      this.inputLoanAmount /
      (1 - Math.pow(1 + aprMonth, -1 * loan_period_months));

    getToken("user-admin", "user").then(bearToken => {
      // Blockchain Server: user applies for loan to insurancer
      userInsurance({
        bearToken,
        peers: "dmv/peer0",
        vin: this.props.data.vin_number
      });

      // Node Server: user applies for car insurance
      createInsurance({
        customer_id: this.props.data.customer_id,
        vin_number: this.props.data.vin_number,
        coverage: this.calcCoverage(
          this.props.data.actual_price,
          loan_period_months,
          ""
        ),
        status: "applied",
        ssn_number: "user-admin",
        monthly_cost: monthly_payment,
        start_date: this.start_date,
        end_date: this.end_date
      }).then(insuranceData => {
        this.setState({
          insurance: insuranceData
        });
        this.tabListHandler(2);
      });
    });

    event.preventDefault();
  }

  tabListHandler(index) {
    switch (index) {
      case 0:
        break;
      case 1:
        return fetchLoan({
          vin_number: this.props.data.vin_number,
          ssn_number: "user-admin"
        }).then(data => {
          this.setState({ loan: data });
        });
      case 2:
        return fetchInsurance({
          vin_number: this.props.data.vin_number,
          ssn_number: "user-admin"
        }).then(data => {
          this.setState({ insurance: data[0] });
        });
      case 3:
        return queryRegistration();
    }
  }

  render() {
    return (
      <div className={negotiationStyles.negotiation}>
        <div className={negotiationStyles["vehicle-info"]}>
          <div className={negotiationStyles["vehicle-info-text"]}>
            <span className={negotiationStyles.subtitle}>Offer Accepted</span>
            <Tabs defaultIndex={0} onSelect={this.tabListHandler.bind(this)}>
              <TabList>
                <Tab selectedClassName={negotiationStyles.selectedTab}>
                  Basic Info
                </Tab>
                <Tab selectedClassName={negotiationStyles.selectedTab}>
                  Loan
                </Tab>
                <Tab selectedClassName={negotiationStyles.selectedTab}>
                  Insurance
                </Tab>
                <Tab selectedClassName={negotiationStyles.selectedTab}>
                  Registration
                </Tab>
              </TabList>

              <TabPanel>
                <section className={negotiationStyles["basic-info"]}>
                  Customer ID: {this.props.data.customer_id}
                  <br />
                  Transaction ID: {this.props.data.id}
                  <br />
                  VIN: {this.props.data.vin_number}
                  <br />
                  Price: {this.props.data.actual_price}
                  <br />
                  Status: {`Dealer ${this.props.data.status}`}
                </section>
              </TabPanel>
              <TabPanel>
                <section className={negotiationStyles["loan-info"]}>
                  Loan Status: {this.state.loan ? this.state.loan.status : ""}
                  <br />
                  APR: {this.state.loan ? this.state.loan.apr : ""}
                  <br />
                  Monthly Payment:{" "}
                  {this.state.loan ? this.state.loan.monthly_payment : ""}
                </section>
              </TabPanel>
              <TabPanel>
                <section className={negotiationStyles["insurance-info"]}>
                  Insurance Status:{" "}
                  {this.state.insurance ? this.state.insurance.status : ""}
                  <br />
                  Insurance Start Date:{" "}
                  {this.state.insurance ? this.state.insurance.start_date : ""}
                  <br />
                  Insurance End Date:{" "}
                  {this.state.insurance ? this.state.insurance.end_date : ""}
                  <br />
                  Insurance Cost:{" "}
                  {this.state.insurance
                    ? this.state.insurance.monthly_cost
                    : ""}
                  <br />
                  Insurance Coverage:{" "}
                  {this.state.insurance ? this.state.insurance.coverage : ""}
                </section>
              </TabPanel>
              <TabPanel>
                <section className={negotiationStyles["registration-info"]}>
                  Registration ID: {this.state.registration.tag_id}
                  <br />
                  Registration Valid Until: {this.state.registration.end_date}
                </section>
              </TabPanel>
            </Tabs>
          </div>

          <div className={negotiationStyles.expectation}>
            <span className={negotiationStyles.subtitle}>Step One</span>
            <br />

            <div>
              <input
                value={this.state.inputLoanTerm}
                onChange={this.updateInputTermValue}
                placeholder={"Loan Term"}
              />
              <input
                value={this.state.inputLoanAmount}
                onChange={this.updateInputAmountValue}
                placeholder={"Loan Amount"}
              />
              <button
                className={negotiationStyles.button}
                onClick={this.handleLoan}
              >
                Apply for Loan
              </button>
            </div>
            <hr />

            <span className={negotiationStyles.subtitle}>Step Two</span>
            <br />
            <div>
              <button
                className={negotiationStyles.button}
                onClick={this.handleInsurance}
              >
                Insurance & Registration
              </button>
            </div>
            <hr />
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

AcceptedNegotiation.propTypes = {
  data: PropTypes.object
};

export default AcceptedNegotiation;
/* eslint-enable */
