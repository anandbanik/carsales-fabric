import React from "react";
import PropTypes from "prop-types";
import ReactModal from "react-modal";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
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
      setPrice: "",
      showModal: false
    };

    this.handleComments = this.handleComments.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.preCheck = this.preCheck.bind(this);
    console.log(props);
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

  handlePrice(event) {
    this.setState({
      setPrice: event.target.value
    });
  }

  preCheck() {
    if (
      isNaN(this.state.setPrice) ||
      parseInt(this.state.setPrice) > parseInt(this.props.data.actual_price)
    ) {
      this.handleOpenModal();
      this.setState({
        replyText: "",
        setPrice: "",
        showedModalContent: "Please enter a valid number."
      });
    }
    if (this.state.setPrice.trim() === "") {
      this.setState({
        setPrice: this.props.data.actual_price
      });
    }
  }

  handleSubmit(event) {
    if (this.state.replyText.trim() === "") {
      this.handleOpenModal();
      this.setState({
        showedModalContent: "Please enter a reply message."
      });
    } else {
      this.preCheck();
      const commentsText = this.props.data.comments;
      const dealerName = this.props.data.dealer_name;
      const replyText = this.state.replyText;
      const vinNumber = this.props.data.vin_number;
      const ssnNumber = this.props.data.ssn_number;
      const status = this.props.data.status;
      const actualPrice = this.state.setPrice;
      const userType = this.props.data.userType;
      const comment  = userType === "Customer" ? `${commentsText}<div class='customer'><b>${userType}: </b> ${replyText} </div>` : 
      `${commentsText}<div class='dealer'><b>${userType}: </b> ${replyText} </div>`;
      console.log("state - > ", this.state);
      getToken("dealer-admin", "dealer").then(bearToken => {
        dealerUser({
          bearToken,
          peers: "dealer/peer0",
          ssn: ssnNumber,
          vin_number: vinNumber,
          comment: commentsText,
          action: "negotiate"
        });
        console.log("Comments Text: "+commentsText)
        updateNegotiation({
          ssn_number: ssnNumber,
          vin_number: vinNumber,
          actual_price: actualPrice,
          status,
          comments: comment
        }).then(() => {
          this.setState({
            showModal: true,
            replyText: "",
            setPrice: "",
            showedModalContent: "You've successfully sent a message."
          });
        });
      });
    }

    event.preventDefault();
  }

  handleAccept(event) {
    const vinNumber = this.props.data.vin_number;
    const ssnNumber = this.props.data.ssn_number;
    const actualPrice = this.state.setPrice;

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
        ssn_number: ssnNumber,
        vin_number: vinNumber,
        actual_price: actualPrice,
        status: "approved"
      }).then(() => {
        this.setState({
          replyText: "",
          showModal: true,
          showedModalContent: "You've approved the transaction."
        });
        window.location = window.location;
      });
    });

    event.preventDefault();
  }

  render() {
    
    return (
      <div className={negotiationStyles.negotiation}>
        {/* Modal Box */}
        
        <span className={negotiationStyles.subtitle}> Negotiation for: {this.props.data.vin_number}</span>
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
           <b> VIN:</b> {this.props.data.vin_number}
            <br />
            <b>Price: </b>{this.props.data.actual_price}
            <br />
            <b>CustomerID:</b> {this.props.data.ssn_number} 
            <br />
           {  this.props.data.comments === "" ? "" : <b>Comments:</b>}
           <br /> 
            {this.props.data.comments.split("\n").map((item, key) => {
              return (
                item === "" ? "" :
                <span key={key}>
                  <div style={{border: "1px solid #ddd", borderRadius: "5px", padding:"10px", clear: "both", height:"150px", overflow:"scroll", width: "90%"}}>
                    {ReactHtmlParser(item)}
                  <div style={{ clear: "both"}}></div>
                  </div>
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
            <input 
              className={
                this.props.role === "user" ||
                this.props.data.status === "approved"
                  ? negotiationStyles.hide
                  : customStyles.inputText
              }
              placeholder="Set Price"
              value={this.state.setPrice}
              onChange={this.handlePrice}
            />
            <textarea
              className={
                this.props.data.status === "approved"
                  ? negotiationStyles.hide
                  : customStyles.inputText
              }
              value={this.state.replyText}
              onChange={this.handleComments}
              rows="4"
              cols="50"
            />
            <br />

            <button
              className={`${customStyles.buttonSuccess} ${
                this.props.data.status === "approved"
                  ? negotiationStyles.hide
                  : ""
              }`}
              onClick={this.handleSubmit.bind(this)}
            >
              Reply
            </button>
            <button
              className={
                this.props.role === "user" ||
                this.props.data.status === "approved"
                  ? negotiationStyles.hide
                  : customStyles.buttonSuccess
              }
              onClick={this.handleAccept.bind(this)}
            >
              Accept Offer
            </button>
            <button
              className={
                this.props.data.status === "approved"
                  ? customStyles.buttonSuccess
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
  role: PropTypes.string,
  actual_price: PropTypes.string
};

export default Negotiation;
/* eslint-enable */
