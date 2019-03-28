import React from "react";
import { browserHistory, Link } from "react-router";
import custom from "../../styles/custom.css";
import Banner from "../banner";
import Car from "../car";
import { fetchVehicle } from "../../helper/nodeservice-helper";
import TextField from "material-ui/TextField";
import userStyles from "../../styles/user.css";
import sectionStyles from "../../styles/section.css";
import  skeleton from "../../styles/skeleton.css";
import "../../styles/custom.css";
//import //Action
import History from "material-ui/svg-icons/Action/history";


/*
 * User Car Inventory View
 */
class UserView extends React.Component {
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
        <Link style={{textDecoration: "none", color: "#009933" }} to="/userHistory"> My History <History style={{marginBottom:  "-5px", color: "#009933"}}/></Link>
      </span>
      </div>
      </div>
      <div className={custom.container}>
      <br/>
      

       

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
          
            {this.state.cars.map(v => (
              <Car key={v.vin_number} data={v} role={"user"} />
            ))}


{/* <button
          onClick={() => {
            browserHistory.push("/history");
          }}
          className={`${userStyles.history}`}
        >
          History
        </button> */}
          </div>
          </div>

  
      
       
      
    );
  }
}

export default UserView;
