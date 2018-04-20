import React from "react";
import PropTypes from "prop-types";
import ReactModal from "react-modal";

import "../styles/skeleton.css";
import customStyles from "../styles/custom.css";
import "../styles/user.css";
import negotiationStyles from "../styles/negotiation.css";

import getToken from "../helper/get-token";
import { dealerUser } from "../helper/blockchain-helper";
import { updateNegotiation } from "../helper/nodeservice-helper";

/* eslint-disable no-magic-numbers */
class Negotiation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      replyText: "",
      showModal: false
    };

    this.handleComments = this.handleComments.bind(this);
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
      replyText: event.target.value
    });
  }

  handleSubmit(event) {
    if (this.state.replyText.trim() === "") {
      this.handleOpenModal();
      this.setState({
        showedModalContent: "Please enter a reply message."
      });
    } else {
      const id = this.props.data.id;
      const commentsText = this.props.data.comments;
      const dealerName = this.props.data.dealer_name;
      const replyText = this.state.replyText;
      const vin = this.props.data.vin_number;

      getToken("dealer-admin", "dealer").then(bearToken => {
        dealerUser({
          bearToken,
          peers: "dealer/peer0",
          ssn: "user-admin",
          vin,
          comment: commentsText,
          action: "negotiate"
        });

        updateNegotiation({
          id,
          comments: `${commentsText}\n${dealerName}: ${replyText}`
        }).then(negotiation => {
          this.props.data.comments = negotiation.comments;
          this.setState({
            showModal: true,
            replyText: "",
            showedModalContent: "You've successfully sent a message."
          });
        });
      });
    }

    event.preventDefault();
  }

  handleAccept(event) {
    getToken("dealer-admin", "dealer").then(bearToken => {
      dealerUser({
        bearToken,
        peers: "dealer/peer0",
        ssn: "user-admin",
        vin: "vin3",
        comment: "",
        action: "approve"
      });

      updateNegotiation({
        id: this.props.data.id,
        actual_price: this.props.data.actual_price,
        status: "approved"
      }).then(negotiation => {
        this.props.data.comments = negotiation.comments;
        this.setState({
          showModal: true,
          replyText: "",
          showedModalContent: "You've approved the transaction."
        });
      });
    });

    event.preventDefault();
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
            VIN: {this.props.data.vin_number}
            <br />
            Price: {this.props.data.actual_price}
            <br />
            CustomerID: {this.props.data.customer_id}
            <br />
            Comments: <br />
            {this.props.data.comments.split("\n").map((item, key) => {
              return (
                <span key={key}>
                  {item}
                  <br />
                </span>
              );
            })}
            <br />
          </div>

          <div className={negotiationStyles.expectation}>
            <span className={negotiationStyles.subtitle}>
              Reply <br />
            </span>
            <textarea
              className={this.props.data.status === "approved" ? negotiationStyles.hide : ""}
              value={this.state.replyText}
              onChange={this.handleComments}
              rows="4"
              cols="50"
            />
            <br />

            <button
              className={`${negotiationStyles.button} ${
                this.props.data.status === "approved" ? negotiationStyles.hide : ""
              }`}
              onClick={this.handleSubmit.bind(this)}
            >
              Reply
            </button>
            <button
              className={
                this.props.role === "user" || this.props.data.status === "approved"
                  ? negotiationStyles.hide
                  : negotiationStyles.button
              }
              onClick={this.handleAccept.bind(this)}
            >
              Accept Offer
            </button>
            <button
              className={
                this.props.data.status === "approved"
                  ? negotiationStyles.accepted
                  : negotiationStyles.hide
              }
            >
              &#10003; Accepted
            </button>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

Negotiation.propTypes = {
  data: PropTypes.object,
  role: PropTypes.string
};

export default Negotiation;
/* eslint-enable */
