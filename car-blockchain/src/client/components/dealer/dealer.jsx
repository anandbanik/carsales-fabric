import React from "react";
import { browserHistory, Link } from "react-router";
import custom from "../../styles/custom.css";
import Car from "../car";
import Banner from "../banner";

import dealerStyles from "../../styles/dealer.css";
import sectionStyles from "../../styles/section.css";
import "../../styles/skeleton.css";
import "../../styles/banner.css";

import { fetchVehicle } from "../../helper/nodeservice-helper";

class Dealer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: []
    };
  }

  componentDidMount() {
    return fetchVehicle().then(cars => {
      this.setState({ cars });
    });
  }

  render() {
    return (
      <div>
        
        <div className={custom.breadCrums}>
  <div className={custom.container}>
  <Link style={{textDecoration: "none", color: "white"}} to="/">Home</Link> > Car list </div></div>

  <div style={{ backgroundColor: "#fff",fontWeight: "800", fontSize: "1.3em", border: "1px solid #eee", paddingTop: "20px", paddingBottom: "20px"}}> 
      <div className={custom.container}>
      <b>New and Used Vehicles for Sale</b>
      <span style={{float: "right", lineHeight: "20px",color: "#009933" ,verticalAlign:"top"}}>
        <Link style={{textDecoration: "none", color: "#009933" }} to="/dealer"> Transactions </Link>
      </span>
      </div>
      </div>


       
      <div className={custom.container}>
          {/* Filter Section */}
          <div style={{width: "24%", padding: "20px", backgroundColor: "#fff", border: "1px solid #eee", marginTop: "40px", float:"left"}} >
 <span style={{fontWeight: "800", fontSize: "1.3em",  width: "100%"}}>Filter Results</span>
 <hr></hr>
    Vehicle Type: 
    <br></br>
    <input style={{marginTop: "10px"}} className={custom.inputText}></input>
    <br></br><br></br>
      Color Type: 
      <br></br>
    <input style={{marginTop: "10px"}} className={custom.inputText}></input>
    <br></br><br></br>
      Price Range: 
      <br></br>
    <input style={{marginTop: "10px"}}className={custom.inputText}></input>
    <br></br><br></br>

    <button className={custom.buttonSuccess} >Serach</button>
      </div>

          {/* Cars List Section */}
          <div className={`${sectionStyles["cars-list"]} ${sectionStyles["flex-item"]}`}>
          
            {this.state.cars.map(v => <Car key={v.vin_number} data={v} role={"dealer"} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default Dealer;
