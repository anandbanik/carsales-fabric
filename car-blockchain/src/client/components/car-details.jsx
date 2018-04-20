import React from "react";
import PropTypes from "prop-types";
import { browserHistory } from "react-router";
import ReactModal from "react-modal";

import "../styles/skeleton.css";
import customStyles from "../styles/custom.css";
import "../styles/user.css";
import sectionStyles from "../styles/section.css";
import carDetails from "../styles/car-details.css";

import getToken from "../helper/get-token";
import { userDealer } from "../helper/blockchain-helper";
import { createNegotiation } from "../helper/nodeservice-helper";

class CarDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commentBox: "",
      requestedPrice: "",
      sentMessage: "",
      showModal: false,
      showedModalContent: ""
    };

    this.handleComments = this.handleComments.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleComments(event) {
    this.setState({
      commentBox: event.target.value
    });
  }

  handlePrice(event) {
    this.setState({
      requestedPrice: event.target.value
    });
  }

  handleSubmit(event) {
    const requestedPrice = this.state.requestedPrice.trim();
    if (requestedPrice === "" || isNaN(parseInt(requestedPrice))) {
      this.handleOpenModal();
      this.setState({
        showedModalContent: "Please input a valid price.",
        requestedPrice: "",
        commentBox: ""
      });
    } else {
      getToken("user-admin", "user").then(bearToken => {
        // Block-chain CreateDmvDealer
        userDealer({
          bearToken,
          peers: "dmv/peer0",
          vin: this.props.vin_number,
          request_price: this.state.requestedPrice,
          comment: this.state.commentBox
        });

        // Node-server create-negotiation
        createNegotiation({
          ssn_number: "user-admin",
          vin_number: this.props.vin_number,
          actual_price: this.state.requestedPrice,
          loan: "",
          insurance: "",
          registration: "",
          comments: `Customer : ${this.state.commentBox}`
        }).then(negotiation => {
          this.handleOpenModal();
          this.setState({
            showedModalContent: "You've successfully sent a message to dealer.",
            sentMessage: negotiation,
            commentBox: "",
            requestedPrice: ""
          });
        });
      });
      event.preventDefault();
    }
  }

  render() {
    this.props = this.props.location.state || {};
    return (
      <div
        className={`${carDetails["car-details"]} ${
          sectionStyles["flex-container"]
        }`}
      >
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

        <div className={`${carDetails["car-details-info"]}`}>
          <h4>
            {this.props.vehicle_year} {this.props.vehicle_make}{" "}
            {this.props.vehicle_model}
          </h4>

          <div className={carDetails["info-left"]}>
            Exterior color: {this.props.vehicle_color}
            <br />
            31,498 miles<br />
            VIN: {this.props.vin_number}
            <br />
            <span className={carDetails.location}>
              for Sale in Pleasanton, CA
            </span>
          </div>
          <div className={carDetails["info-right"]}>
            ${this.props.list_price}
          </div>
          <hr />
          <img src={this.props.img} />
        </div>

        <div className={`${carDetails["contact-dealer"]}`}>
          <table>
            <tbody>
              <tr>
                <th>Email Dealer</th>
              </tr>
              <tr>
                <td>
                  Hello, I would like to learn more about this{" "}
                  {this.props.vehicle_year} {this.props.vehicle_make}{" "}
                  {this.props.vehicle_model}.
                </td>
              </tr>
              <tr>
                <td>
                  Expected Price:
                  <input
                    className={carDetails["expected-price"]}
                    value={this.state.requestedPrice}
                    onChange={this.handlePrice}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  Comments: <br />
                  <textarea
                    value={this.state.commentBox}
                    onChange={this.handleComments}
                    rows="4"
                    cols="50"
                    placeholder="Add your personal message"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <button onClick={this.handleSubmit}>Contact Dealer</button>
                  <button
                    onClick={() => {
                      browserHistory.push("/user");
                    }}
                  >
                    Back to Inventory
                  </button>
                  <button
                    onClick={() => {
                      browserHistory.push("/");
                    }}
                  >
                    Back to Main
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

CarDetails.propTypes = {
  img: PropTypes.string,
  vehicle_make: PropTypes.string,
  vehicle_model: PropTypes.string,
  vehicle_year: PropTypes.string,
  vehicle_color: PropTypes.string,
  actual_price: PropTypes.string,
  list_price: PropTypes.string,
  vin_number: PropTypes.string,
  location: PropTypes.object
};

export default CarDetails;
