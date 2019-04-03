import React from "react";
import PropTypes from "prop-types";
import { browserHistory, Link} from "react-router";
import ReactModal from "react-modal";
import custom from "../styles/custom.css";
import "../styles/skeleton.css";
import customStyles from "../styles/custom.css";
import sectionStyles from "../styles/section.css";
import carDetails from "../styles/car-details.css";
import TextField from "material-ui/TextField";
import getToken from "../helper/get-token";
import { userDealer } from "../helper/blockchain-helper";
import { createNegotiation } from "../helper/nodeservice-helper";
import Location from "material-ui/svg-icons/Communication/location-on";
import Star from "material-ui/svg-icons/Toggle/star";

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
          comments: `<div class='customer'><b>Customer : </b> ${this.state.commentBox}</div>`
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
      <div>
        <div className={custom.breadCrums}>
  <div className={custom.container}>
  <Link style={{textDecoration: "none", color: "white"}} to="/">Home</Link> >  <Link style={{textDecoration: "none", color: "white"}} to="/user">Car list </Link> > Car Details</div></div>
  <div style={{ backgroundColor: "#fff",fontWeight: "800", fontSize: "1.3em", border: "1px solid #eee", paddingTop: "20px", paddingBottom: "20px"}}> 
      <div className={custom.container}>
      <b>{this.props.vehicle_year} {this.props.vehicle_make}{" "}
            {this.props.vehicle_model}</b></div>
      </div>

  
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


<div className={custom.container}> 
        <div style={{float: "left", marginTop: "40px", maxWidth: "60%", backgroundColor: "#ddd", textAlign: "center"}}>
         
          <img style={{maxWidth: "95%"}} src={this.props.img} />

         
          
        </div>


        <div style={{float: "right", maxWidth: "35%", margin:"10px",marginTop: "40px", backgroundColor: "#efefef"}}>
        <div>
        <div style={{     padding: "16px" , backgroundColor: "#fff", border:"1px solid #ddd" }}> 
          <b style={{fontSize: "24px", fontWeight: "600",  marginBottom: "14px"}}>Contact Seller</b>
          <br></br>  <br></br> 
         <span> Send a message right away!</span>
        
        </div>
        <div style={{     padding: "20px" ,  border:"1px solid #ddd", borderTop: "none" }}> 
        Hello, I would like to learn more about this{" "}
                  {this.props.vehicle_year} {this.props.vehicle_make}{" "}
                  {this.props.vehicle_model}.


                  <br></br><br></br>       
         <b> Expected Price:</b>
          <br></br><br></br>
                  <input
                   className={custom.inputText}
                   placeholder="Price$$$"
                    value={this.state.requestedPrice}
                    onChange={this.handlePrice}
                  />
<br></br><br></br>

<b>Comments: </b>
<br /><br />
                  <textarea className={custom.inputText}
                    value={this.state.commentBox}
                    onChange={this.handleComments}
                    rows="4"
                    cols="50"
                    placeholder="Add your personal message"
                  />
                  <br></br><br></br>
        <button className={custom.buttonSuccess} onClick={this.handleSubmit}>Contact Dealer</button>

<hr></hr>
       <span style={{fontSize:"12px"}}>
       By clicking here, you authorize this site and its sellers/partners to contact you by texts which may include marketing. You also agree to our Privacy Statement. Consent is not required to purchase goods/services.
        
       </span>
       </div>
        
        </div>

          
        </div>


        <div style={{float: "left", width: "60%"}}>
        <br></br>
        <h4>
            Used {this.props.vehicle_year} {this.props.vehicle_make}{" "}
            {this.props.vehicle_model}
          </h4>

          <hr />
         <span style={{fontSize: "36px", lineHeight: "50px"}}>
          <b>${this.props.list_price}</b>
          <span style={{fontSize: "14px", lineHeight: "50px",marginLeft:"25%",color: "#098ae4" ,verticalAlign:"top"}}>Pleasanton, CA <Location style={{color: "#098ae4"}}/></span>
          <span style={{fontSize: "14px", lineHeight: "50px",float: "right",  marginLeft:"20px", verticalAlign:"top"}}>31,498 miles | Price Drop! Was $35000</span>
         </span>
         
          <div className={carDetails["info-left"]}>
            Exterior color: {this.props.vehicle_color} | VIN: {this.props.vin_number}
            <br />
          
          </div>
          <br></br>
          <span style={{fontSize: "14px", lineHeight: "25px",color: "#098ae4" ,verticalAlign:"top"}}>
          Sold by ABS Dealer: <br/>
          <Star style={{color: "#009933"}}/> <Star style={{color: "#009933"}}/> <Star  style={{color: "#009933"}}/> <Star style={{color: "#009933"}}/> <Star style={{color: "#009933"}}/> (5) 2 Reviews </span>
        
 <br></br> <br></br>
 <span style={{fontSize: "25px", lineHeight: "50px"}}><b>Seller's Notes</b></span>

         <p>*** 3 Months Warranty with Road Side Assistance Available *** Hello, Selling {this.props.vehicle_make}{" "}
            {this.props.vehicle_model}  in Excellent Condition. Very clean interior and exterior, very well taken care of, clean title and no accidents Mileage: 31,498 Options: Power windows Power door locks Power steering On steering control buttons AM/FM /SIRIUS radio with CD player AUX and USB inputs Automatic transmission Cruise Control Bluetooth AC ice cold New oil change Breaks and tires are in excellent condition Passed smog check the safety inspection.</p>


            
 <span style={{fontSize: "25px", lineHeight: "50px"}}><b>Basics</b></span>
 <div style={{width: "100%"}}>
 <div style={{width: "45%", float: "left", lineHeight: "30px"}}>
 <b>Fuel Type: </b> Gasoline <br></br>
 <b>City MPG:</b> 26<br></br>
 <b>Highway MPG: </b> 36<br></br>
 <b>Drivetrain:</b> FWD<br></br>
 <b>Engine: </b>2.0L I4<br></br>
 
 </div>
 <div style={{width: "45%",  float: "left",lineHeight: "30px"}}>
 <b>Exterior color:</b> {this.props.vehicle_color} <br></br>
 <b>Interior Color: </b>Black <br></br>
  <b>VIN:</b> {this.props.vin_number}<br></br>
  <b>Mileage:</b> 103,811<br></br>
  <b>
Transmission: </b>Automatic 6-Speed
 </div>
 </div>


 <div style={{width: "100%", marginTop: "30px"}}>
 
 <div style={{width: "30%", float: "left", lineHeight: "30px"}}>
 <span style={{fontSize: "20px", lineHeight: "100px"}}><b>Convenience</b></span>
  <ul style={{marginTop: "-25px"}}><li>USB Port</li></ul>
 </div>
 <div style={{width: "30%", float: "left", lineHeight: "30px"}}>
 
 <span style={{fontSize: "20px", lineHeight: "100px"}}><b>Entertainment</b></span>
 <ul style={{marginTop: "-25px"}}><li>Bluetooth</li></ul></div>
 <div style={{width: "30%", float: "left", lineHeight: "30px"}}>
 <span style={{fontSize: "20px", lineHeight: "100px"}}><b>Safety</b></span>
 <ul style={{marginTop: "-25px"}}><li>Stability Control</li></ul>
 </div>
 </div>


 <div style={{width: "100%"}}>
 <span style={{fontSize: "25px", lineHeight: "50px"}}><b>Consumer Reviews:</b></span>
  <div style={{backgroundColor: "#fff", border: "1px solid #ddd", padding: "20px"}}>
  <Star style={{color: "#009933"}}/> <Star style={{color: "#009933"}}/> <Star  style={{color: "#009933"}}/> <Star style={{color: "#009933"}}/> <Star style={{color: "#009933"}}/> 
        <br></br><br></br>
  <b>{this.props.vehicle_make}{" "}</b> 

  <br></br> <i style={{color: "#aaa"}}>by Customer 34453I78S</i><br></br> <br></br>
  The 2012 Ford Focus SEL for my use is a very user friendly and comfortable car for both city and highway driving. I the 160 HP motor is responsive, easy to pass with, and efficient on gas. The DCT transmission works well, but you have to get use to how they work. Ford has gone the extra mile in customer service to extend the mfrs. DCT transmission warranty to up to 200K as a customer satisfaction effort. This a good thing and welcomed by this consumer. Overall styling is very European and a fresh design for a North American car maker. GM tried but in MHO failed to deliver. I have been driving Mercedes Benz for a while and this Ford has made me rethink my options when it comes to my next purchase.
  </div>
  
 </div>


 <div style={{width: "100%", marginTop: "30px", marginBottom: "100px"}}>
 
  <div style={{backgroundColor: "#fff", border: "1px solid #ddd", padding: "20px"}}>
  <Star style={{color: "#009933"}}/> <Star style={{color: "#009933"}}/> <Star  style={{color: "#009933"}}/> <Star style={{color: "#009933"}}/> <Star style={{color: "#009933"}}/> 
        <br></br><br></br>
  <b>{this.props.vehicle_make}{" "}</b> 

  <br></br> <i style={{color: "#aaa"}}>by Customer 34453I78S</i><br></br> <br></br>
  The 2012 Ford Focus SEL for my use is a very user friendly and comfortable car for both city and highway driving. I the 160 HP motor is responsive, easy to pass with, and efficient on gas. The DCT transmission works well, but you have to get use to how they work. Ford has gone the extra mile in customer service to extend the mfrs. DCT transmission warranty to up to 200K as a customer satisfaction effort. This a good thing and welcomed by this consumer. Overall styling is very European and a fresh design for a North American car maker. GM tried but in MHO failed to deliver. I have been driving Mercedes Benz for a while and this Ford has made me rethink my options when it comes to my next purchase.
  </div>
  
 </div>
        </div>

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
