import React from "react";
import PropTypes from "prop-types";
import ReactModal from "react-modal";

import "../../styles/skeleton.css";
import customStyles from "../../styles/custom.css";
import "../../styles/user.css";
import negotiationStyles from "../../styles/negotiation.css";

import AcceptedTabs from "./accepted-tabs";

import getToken from "../../helper/get-token";
import { calcCoverage } from "../../helper/helper-function";

import {
  userBanker,
  userInsurance,
  queryDMVRegistration
} from "../../helper/blockchain-helper";
import {
  createLoan,
  createInsurance,
  fetchLoan,
  fetchInsurance
} from "../../helper/nodeservice-helper";

/* eslint-disable no-magic-numbers, camelcase, consistent-return, react/jsx-handler-names */
class AcceptedNegotiation extends React.Component {
  constructor(props) {
    super(props);

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleLoan = this.handleLoan.bind(this);
    this.handleInsurance = this.handleInsurance.bind(this);
    this.updateInputTermValue = this.updateInputTermValue.bind(this);
    this.updateInputAmountValue = this.updateInputAmountValue.bind(this);

    this.state = {
      loan: [],
      insurance: [],
      registration: [],
      currentTabIndex: 0,
      showModal: false
    };

    const d = new Date();
    this.start_date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    this.end_date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear() + 1}`;
    this.inputLoanTerm = "";
    this.inputLoanAmount = "";
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  updateInputTermValue(evt) {
    this.inputLoanTerm = evt.target.value;
  }

  updateInputAmountValue(evt) {
    this.inputLoanAmount = evt.target.value;
  }

  handleLoan(event) {
    if (isNaN(this.inputLoanAmount) || isNaN(this.inputLoanTerm)) {
      this.handleOpenModal();
      this.setState({
        showedModalContent: "Please enter a valid loan amount/term."
      });
      return;
    }

    // Set Default Loan Term & Amount
    if (this.inputLoanTerm === "") {
      this.inputLoanTerm = 60;
    }

    if (this.inputLoanAmount === "") {
      this.inputLoanAmount = this.props.data.actual_price;
    }

    getToken("user-admin", "user").then(bearToken => {
      // Blockchain Server: user applies for loan to banker
      userBanker({
        bearToken,
        peers: "dmv/peer0",
        ssn: "user-admin",
        vin: this.props.data.vin_number,
        month: this.inputLoanTerm,
        price: this.inputLoanAmount
      });

      // Node Server: user applies for loan to banker
      createLoan({
        customer_id: this.props.data.customer_id,
        vin_number: this.props.data.vin_number,
        amount: this.inputLoanAmount,
        loan_period_months: this.inputLoanTerm,
        ssn_number: "user-admin",
        monthly_payment: this.inputLoanAmount / this.inputLoanTerm,
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
        coverage: calcCoverage(
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
    this.setState({ currentTabIndex: index });
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
        return getToken("user-admin", "user").then(bearToken1 => {
          return queryDMVRegistration({
            bearToken: bearToken1,
            vin: this.props.data.vin_number
          }).then(data => {
            this.setState({ registration: data.result });
          });
        });
    }
  }

  render() {
    return (
      <div className={negotiationStyles.negotiation}>
        {/* Modal Box */}
        <ReactModal
          className={customStyles.customModal}
          isOpen={this.state.showModal}
          ariaHideApp={false}
        >
          <p
            className={customStyles.closeButton}
            onClick={this.handleCloseModal}
          >
            &#10005;
          </p>
          <div>{this.state.showedModalContent}</div>
        </ReactModal>

        <div className={negotiationStyles["vehicle-info"]}>
          <div className={negotiationStyles["vehicle-info-text"]}>
            <span className={negotiationStyles.subtitle}>Offer Accepted</span>
            <AcceptedTabs
              tabListHandler={this.tabListHandler.bind(this)}
              data={this.props}
              loan={this.state.loan}
              insurance={this.state.insurance}
              registration={this.state.registration}
            />
          </div>

          <div className={negotiationStyles.expectation}>
            {/* Apply for loan */}
            <div
              className={
                this.state.currentTabIndex === 1
                  ? negotiationStyles.show
                  : negotiationStyles.hide
              }
            >
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
                disabled={this.state.loan.status}
              >
                Apply for Loan
              </button>
            </div>

            {/* Apply for Registration */}
            <div
              className={
                this.state.currentTabIndex === 2
                  ? negotiationStyles.show
                  : negotiationStyles.hide
              }
            >
              <button
                className={negotiationStyles.button}
                onClick={this.handleInsurance}
                disabled={this.state.insurance.status}
              >
                Insurance & Registration
              </button>
            </div>
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
